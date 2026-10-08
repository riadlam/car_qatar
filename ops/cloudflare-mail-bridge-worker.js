/**
 * Cloudflare Worker relay + SMTP sender.
 *
 * - list_pops / add_pop / passwd_pop → BRIDGE_UPSTREAM PHP on Octenium
 * - send_mail → SMTPS from this Worker (VPS cannot open SMTP to Octenium)
 *
 * Worker vars:
 *   BRIDGE_UPSTREAM = https://bridge.almajdluxurytransport.com/mail-bridge.php
 *   BRIDGE_SECRET   = same as CPANEL_BRIDGE_SECRET
 *   SMTP_HOST       = quantum.octenium.net
 *   SMTP_PORT       = 465
 *
 * VPS .env:
 *   CPANEL_BRIDGE_URL=https://mail-bridge-worker....workers.dev
 *   MAIL_MAILER=cpanel_bridge
 */

import { connect } from 'cloudflare:sockets';

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return Response.json({ ok: false, error: 'Method not allowed' }, { status: 405 });
    }

    const secret = request.headers.get('X-Bridge-Secret') || '';
    if (!env.BRIDGE_SECRET || secret !== env.BRIDGE_SECRET) {
      return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
    }

    if ((body?.action || '') === 'send_mail') {
      try {
        await sendMailSmtp(env, body);
        return Response.json({ ok: true, payload: { status: 1, data: { sent: true } } });
      } catch (err) {
        const message = err && err.message ? String(err.message) : 'SMTP send failed';
        return Response.json({ ok: false, error: message }, { status: 422 });
      }
    }

    const upstream = env.BRIDGE_UPSTREAM;
    if (!upstream) {
      return Response.json({ ok: false, error: 'Bridge not configured' }, { status: 500 });
    }

    const upstreamRes = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bridge-Secret': env.BRIDGE_SECRET,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await upstreamRes.text();
    return new Response(text, {
      status: upstreamRes.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  },
};

async function sendMailSmtp(env, body) {
  const to = String(body.to || '').trim().toLowerCase();
  const subject = String(body.subject || '').trim();
  const html = String(body.html || '');
  const text = String(body.text || '');
  const fromEmail = String(body.from_email || '').trim().toLowerCase();
  const fromName = String(body.from_name || 'AL MAJD').trim() || 'AL MAJD';
  const smtpUser = String(body.smtp_username || fromEmail).trim();
  const smtpPass = String(body.smtp_password || '');

  if (!to || !fromEmail || !subject || (!html && !text) || !smtpUser || !smtpPass) {
    throw new Error('Missing send_mail fields');
  }

  const host = env.SMTP_HOST || 'quantum.octenium.net';
  const port = Number(env.SMTP_PORT || 465);

  const socket = connect({ hostname: host, port, secureTransport: 'on' });
  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = '';

  async function readSmtp() {
    while (true) {
      const parts = buffer.split(/\r?\n/);
      // Keep last incomplete chunk in buffer
      if (!buffer.endsWith('\n') && !buffer.endsWith('\r\n')) {
        buffer = parts.pop() || '';
      } else {
        buffer = '';
        if (parts.length && parts[parts.length - 1] === '') {
          parts.pop();
        }
      }

      const lines = [];
      let done = false;
      let code = 0;
      for (const line of parts) {
        if (!/^\d{3}[ \-]/.test(line)) {
          continue;
        }
        lines.push(line);
        code = Number(line.slice(0, 3));
        if (line[3] === ' ') {
          done = true;
          break;
        }
      }

      if (done) {
        return { code, text: lines.join('\n') };
      }

      // Restore unconsumed complete lines that weren't finished as a response
      if (parts.length) {
        buffer = parts.join('\r\n') + (buffer ? '\r\n' + buffer : '');
      }

      const { value, done: eof } = await reader.read();
      if (eof) {
        throw new Error('SMTP connection closed');
      }
      buffer += decoder.decode(value, { stream: true });
    }
  }

  async function expect(ok) {
    const res = await readSmtp();
    if (!ok.includes(res.code)) {
      throw new Error(`SMTP ${res.text.trim().replace(/\s+/g, ' ')}`);
    }
  }

  async function cmd(line, ok) {
    await writer.write(encoder.encode(line + '\r\n'));
    await expect(ok);
  }

  try {
    await expect([220]);
    await cmd('EHLO almajdluxurytransport.com', [250]);
    await cmd('AUTH LOGIN', [334]);
    await cmd(btoa(smtpUser), [334]);
    await cmd(btoa(smtpPass), [235]);
    await cmd(`MAIL FROM:<${fromEmail}>`, [250]);
    await cmd(`RCPT TO:<${to}>`, [250, 251]);
    await cmd('DATA', [354]);

    const boundary = 'b_' + hex(12);
    const safeName = fromName.replace(/(["\\])/g, '\\$1');
    const encodedSubject = /^[\x20-\x7E]+$/.test(subject)
      ? subject
      : `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
    const rawText = text || strip(html);
    const rawHtml = html || `<pre>${esc(rawText)}</pre>`;

    let data = [
      `From: "${safeName}" <${fromEmail}>`,
      `To: <${to}>`,
      `Subject: ${encodedSubject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${hex(16)}@almajdluxurytransport.com>`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      wrap76(btoa(unescape(encodeURIComponent(rawText)))),
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      wrap76(btoa(unescape(encodeURIComponent(rawHtml)))),
      `--${boundary}--`,
      '',
    ].join('\r\n').replace(/^\./gm, '..');

    await writer.write(encoder.encode(data + '\r\n.\r\n'));
    await expect([250]);
    try { await cmd('QUIT', [221, 250]); } catch {}
  } finally {
    try { reader.releaseLock(); } catch {}
    try { writer.releaseLock(); } catch {}
    try { socket.close(); } catch {}
  }
}

function hex(n) {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function wrap76(s) {
  return (s.match(/.{1,76}/g) || [s]).join('\r\n');
}

function strip(html) {
  return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function esc(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
