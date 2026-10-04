<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>@yield('title', 'Mailboxes')</title>
    <style>
        :root {
            --bg: #f6f5f3;
            --card: #ffffff;
            --ink: #1a1a1a;
            --muted: #6b6b6b;
            --line: #e6e4e0;
            --wine: #5b0520;
            --wine-hover: #7a0a2c;
            --ok: #0f6b3a;
            --err: #9b1c1c;
            --overlay: rgba(20, 16, 14, 0.45);
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Georgia, "Times New Roman", serif;
            color: var(--ink);
            background: linear-gradient(180deg, #efece7 0%, var(--bg) 40%, #faf9f7 100%);
            min-height: 100vh;
        }
        .wrap {
            width: min(920px, calc(100% - 2rem));
            margin: 0 auto;
            padding: 2.5rem 0 4rem;
        }
        .card {
            background: var(--card);
            border: 1px solid var(--line);
            border-radius: 18px;
            padding: 1.5rem;
            box-shadow: 0 10px 30px rgba(26, 26, 26, 0.04);
        }
        h1 {
            margin: 0;
            font-size: 2rem;
            font-weight: 400;
            letter-spacing: 0.02em;
        }
        p, label, th, td, button, input, a, span {
            font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        }
        .muted { color: var(--muted); }
        .top {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 1.25rem;
        }
        .btn {
            appearance: none;
            border: 0;
            border-radius: 999px;
            padding: 0.7rem 1.1rem;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.35rem;
        }
        .btn-primary { background: var(--wine); color: #fff; }
        .btn-primary:hover { background: var(--wine-hover); }
        .btn-ghost {
            background: #fff;
            color: var(--ink);
            border: 1px solid var(--line);
        }
        .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
        .field { margin-bottom: 1rem; }
        .field label {
            display: block;
            margin-bottom: 0.4rem;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }
        .field input {
            width: 100%;
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 0.85rem 0.95rem;
            font-size: 1rem;
            outline: none;
            background: #fff;
        }
        .field input:focus { border-color: var(--wine); }
        .row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 0.5rem;
            align-items: center;
        }
        .suffix {
            white-space: nowrap;
            color: var(--muted);
            font-size: 0.95rem;
            padding-right: 0.25rem;
        }
        .actions { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.5rem; }
        .error {
            background: #fff1f1;
            border: 1px solid #f0caca;
            color: var(--err);
            border-radius: 12px;
            padding: 0.85rem 1rem;
            margin-bottom: 1rem;
            font-size: 0.95rem;
        }
        .ok {
            background: #edf8f1;
            border: 1px solid #cfe8d8;
            color: var(--ok);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        .ok code, .modal code {
            display: inline-block;
            background: rgba(255,255,255,0.7);
            padding: 0.15rem 0.4rem;
            border-radius: 6px;
            font-size: 0.95rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.5rem;
        }
        th, td {
            text-align: left;
            padding: 0.85rem 0.4rem;
            border-bottom: 1px solid var(--line);
            font-size: 0.95rem;
        }
        th { color: var(--muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .row-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            justify-content: flex-end;
        }
        .login-wrap {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 1.5rem;
        }
        .login-card { width: min(420px, 100%); }
        .modal-backdrop {
            position: fixed;
            inset: 0;
            background: var(--overlay);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            z-index: 40;
        }
        .modal-backdrop.is-open { display: flex; }
        .modal {
            width: min(480px, 100%);
            background: var(--card);
            border: 1px solid var(--line);
            border-radius: 18px;
            padding: 1.35rem 1.4rem 1.45rem;
            box-shadow: 0 24px 60px rgba(0,0,0,0.18);
            max-height: calc(100vh - 2rem);
            overflow: auto;
        }
        .modal h2 {
            margin: 0 0 0.35rem;
            font-size: 1.45rem;
            font-weight: 400;
        }
        .modal-head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .modal-close {
            appearance: none;
            border: 0;
            background: transparent;
            font-size: 1.4rem;
            line-height: 1;
            cursor: pointer;
            color: var(--muted);
            padding: 0.1rem 0.35rem;
        }
        body.modal-open { overflow: hidden; }
        .hint {
            margin: 0.45rem 0 0;
            font-size: 0.82rem;
            color: var(--muted);
            line-height: 1.45;
        }
        .req-list {
            margin: 0.55rem 0 0;
            padding: 0;
            list-style: none;
            display: grid;
            gap: 0.25rem;
            font-size: 0.82rem;
            color: var(--muted);
        }
        .req-list li::before {
            content: "• ";
            color: #b0aaa2;
        }
        .req-list li.is-ok { color: var(--ok); }
        .req-list li.is-ok::before { content: "✓ "; }
        .field-error {
            margin: 0.45rem 0 0;
            font-size: 0.85rem;
            color: var(--err);
        }
    </style>
</head>
<body>
    @yield('body')
</body>
</html>
