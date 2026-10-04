@extends('create-email.layout')

@section('title', 'Mailboxes')

@section('body')
@php
    $flash = session('flash_result');
    $shouldOpen = $openModal ?: ($flash ? 'result' : null);
@endphp
<div class="wrap">
    <div class="top">
        <div>
            <h1>Mailboxes</h1>
            <p class="muted" style="margin: 0.4rem 0 0;">{{ '@'.$domain }}</p>
        </div>
        <div class="actions" style="margin: 0;">
            <button class="btn btn-primary" type="button" data-open-modal="create">New email</button>
            <form method="post" action="{{ route('create-email.logout') }}">
                @csrf
                <button class="btn btn-ghost" type="submit">Log out</button>
            </form>
        </div>
    </div>

    <section class="card">
        <h2 style="margin: 0 0 0.35rem; font-size: 1.35rem; font-weight: 400;">Current addresses</h2>
        <p class="muted" style="margin: 0 0 1rem; font-size: 0.92rem;">{{ count($accounts) }} mailbox{{ count($accounts) === 1 ? '' : 'es' }}</p>

        @if ($listError)
            <div class="error">{{ $listError }}</div>
        @elseif (count($accounts) === 0)
            <p class="muted" style="margin: 0;">No mailboxes found yet.</p>
        @else
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($accounts as $account)
                        <tr>
                            <td>{{ $account['email'] }}</td>
                            <td>
                                <div class="row-actions">
                                    <button
                                        class="btn btn-ghost btn-sm"
                                        type="button"
                                        data-open-modal="password"
                                        data-email-local="{{ $account['local'] }}"
                                        data-email-full="{{ $account['email'] }}"
                                    >Change password</button>
                                    <a class="btn btn-ghost btn-sm" href="{{ $webmailUrl }}" target="_blank" rel="noopener noreferrer">Webmail</a>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </section>
</div>

{{-- Create email modal --}}
<div class="modal-backdrop" id="modal-create" @if($shouldOpen === 'create') data-open-on-load="1" @endif>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="create-title">
        <div class="modal-head">
            <div>
                <h2 id="create-title">New email</h2>
                <p class="muted" style="margin: 0; font-size: 0.92rem;">Create a mailbox on {{ '@'.$domain }}.</p>
            </div>
            <button class="modal-close" type="button" data-close-modal aria-label="Close">&times;</button>
        </div>

        @if ($errors->any() && $shouldOpen === 'create')
            <div class="error">{{ $errors->first() }}</div>
        @endif

        <form method="post" action="{{ route('create-email.store') }}" id="create-form" novalidate>
            @csrf
            <input type="hidden" name="_modal" value="create">
            <div class="field">
                <label for="username">Username</label>
                <div class="row">
                    <input id="username" type="text" name="username" value="{{ old('username', $suggestedLocal) }}" required autocomplete="off" pattern="[A-Za-z0-9._+\-]{3,64}" minlength="3" maxlength="64">
                    <span class="suffix">{{ '@'.$domain }}</span>
                </div>
                <p class="hint">At least 3 characters. Letters, numbers, and . _ + - only.</p>
            </div>
            <div class="field">
                <label for="password">Password</label>
                <input id="password" type="text" name="password" value="{{ old('password', $suggestedPassword) }}" required minlength="10" maxlength="128" autocomplete="new-password">
                <ul class="req-list" data-req-for="password" data-user-for="username">
                    <li data-req="length">At least 10 characters</li>
                    <li data-req="lower">One lowercase letter</li>
                    <li data-req="upper">One uppercase letter</li>
                    <li data-req="digit">One number</li>
                    <li data-req="symbol">One symbol (! @ # $ %)</li>
                    <li data-req="username">Does not contain the username</li>
                </ul>
                <p class="field-error" data-form-error hidden></p>
            </div>
            <div class="actions">
                <button class="btn btn-ghost" type="button" id="gen-user">Suggest username</button>
                <button class="btn btn-ghost" type="button" id="gen-pass">Generate password</button>
                <button class="btn btn-primary" type="submit">Create email</button>
            </div>
        </form>
    </div>
</div>

{{-- Change password modal --}}
<div class="modal-backdrop" id="modal-password" @if($shouldOpen === 'password') data-open-on-load="1" @endif>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="password-title">
        <div class="modal-head">
            <div>
                <h2 id="password-title">Change password</h2>
                <p class="muted" style="margin: 0; font-size: 0.92rem;" id="password-subtitle">Set a new password for this mailbox.</p>
            </div>
            <button class="modal-close" type="button" data-close-modal aria-label="Close">&times;</button>
        </div>

        @if ($errors->any() && $shouldOpen === 'password')
            <div class="error">{{ $errors->first() }}</div>
        @endif

        <form method="post" action="{{ route('create-email.password') }}" id="password-form" novalidate>
            @csrf
            <input type="hidden" name="_modal" value="password">
            <div class="field">
                <label for="pw-username">Mailbox</label>
                <div class="row">
                    <input id="pw-username" type="text" name="username" value="{{ old('username') }}" required autocomplete="off" pattern="[A-Za-z0-9._+\-]+" readonly>
                    <span class="suffix">{{ '@'.$domain }}</span>
                </div>
            </div>
            <div class="field">
                <label for="pw-password">New password</label>
                <input id="pw-password" type="text" name="password" value="{{ old('password', $suggestedPassword) }}" required minlength="10" maxlength="128" autocomplete="new-password">
                <ul class="req-list" data-req-for="pw-password" data-user-for="pw-username">
                    <li data-req="length">At least 10 characters</li>
                    <li data-req="lower">One lowercase letter</li>
                    <li data-req="upper">One uppercase letter</li>
                    <li data-req="digit">One number</li>
                    <li data-req="symbol">One symbol (! @ # $ %)</li>
                    <li data-req="username">Does not contain the username</li>
                </ul>
                <p class="field-error" data-form-error hidden></p>
            </div>
            <div class="actions">
                <button class="btn btn-ghost" type="button" id="gen-pw-pass">Generate password</button>
                <button class="btn btn-primary" type="submit">Update password</button>
            </div>
        </form>
    </div>
</div>

{{-- Result modal --}}
@if ($flash)
<div class="modal-backdrop" id="modal-result" data-open-on-load="1">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <div class="modal-head">
            <div>
                <h2 id="result-title">{{ $flash['title'] ?? 'Done' }}</h2>
                <p class="muted" style="margin: 0; font-size: 0.92rem;">Copy the password now — it won’t be shown again.</p>
            </div>
            <button class="modal-close" type="button" data-close-modal aria-label="Close">&times;</button>
        </div>
        <div class="ok" style="margin: 0;">
            <p style="margin: 0;">Address: <code>{{ $flash['email'] ?? '' }}</code></p>
            <p style="margin: 0.45rem 0 0;">Password: <code>{{ $flash['password'] ?? '' }}</code></p>
        </div>
        <div class="actions">
            <a class="btn btn-primary" href="{{ $flash['webmail_url'] ?? $webmailUrl }}" target="_blank" rel="noopener noreferrer">Open webmail</a>
            <button class="btn btn-ghost" type="button" data-close-modal>Close</button>
        </div>
    </div>
</div>
@endif

<script>
    const words = ["vellum","nimbus","cobalt","harbor","lumen","sable","quartz","meridian","cascade","ember","frost","glyph","helix","ivory","jasper","kestrel","lattice","marble","nebula","onyx","prism","quasar","ripple","solstice","timber","umbra","vortex"];
    const rand = (n) => Math.random().toString(36).slice(2, 2 + n);
    const genPassword = () => {
        const lower = 'abcdefghijkmnopqrstuvwxyz';
        const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const digits = '23456789';
        const symbols = '!@#$%*?';
        const all = lower + upper + digits + symbols;
        const pick = (set) => set[Math.floor(Math.random() * set.length)];
        const chars = [pick(lower), pick(upper), pick(digits), pick(symbols)];
        while (chars.length < 16) chars.push(pick(all));
        for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        return chars.join('');
    };

    const passwordIssues = (password, username) => {
        const issues = [];
        if (password.length < 10) issues.push('Password must be at least 10 characters.');
        if (!/[a-z]/.test(password)) issues.push('Password must include a lowercase letter.');
        if (!/[A-Z]/.test(password)) issues.push('Password must include an uppercase letter.');
        if (!/[0-9]/.test(password)) issues.push('Password must include a number.');
        if (!/[^A-Za-z0-9]/.test(password)) issues.push('Password must include a symbol (for example ! @ # $ %).');
        if (username && password.toLowerCase().includes(username.toLowerCase())) {
            issues.push('Password must not contain the username.');
        }
        return issues;
    };

    const paintRequirements = (list) => {
        if (!list) return;
        const pass = document.getElementById(list.dataset.reqFor);
        const user = document.getElementById(list.dataset.userFor);
        if (!pass) return;
        const value = pass.value || '';
        const username = (user?.value || '').toLowerCase();
        list.querySelectorAll('[data-req]').forEach((li) => {
            const key = li.dataset.req;
            let ok = false;
            if (key === 'length') ok = value.length >= 10;
            if (key === 'lower') ok = /[a-z]/.test(value);
            if (key === 'upper') ok = /[A-Z]/.test(value);
            if (key === 'digit') ok = /[0-9]/.test(value);
            if (key === 'symbol') ok = /[^A-Za-z0-9]/.test(value);
            if (key === 'username') ok = !username || !value.toLowerCase().includes(username);
            li.classList.toggle('is-ok', ok);
        });
    };

    const bindPasswordForm = (form) => {
        const pass = form.querySelector('input[name="password"]');
        const user = form.querySelector('input[name="username"]');
        const list = form.querySelector('.req-list');
        const errorEl = form.querySelector('[data-form-error]');
        const refresh = () => paintRequirements(list);
        pass?.addEventListener('input', refresh);
        user?.addEventListener('input', refresh);
        refresh();

        form.addEventListener('submit', (e) => {
            const username = (user?.value || '').trim();
            const password = (pass?.value || '').trim();
            const issues = [];
            if (!/^[A-Za-z0-9._+-]{1,64}$/.test(username) || (form.id === 'create-form' && username.length < 3)) {
                issues.push(form.id === 'create-form'
                    ? 'Username must be at least 3 characters and use only letters, numbers, and . _ + -'
                    : 'Mailbox username is invalid.');
            }
            issues.push(...passwordIssues(password, username));
            if (issues.length) {
                e.preventDefault();
                if (errorEl) {
                    errorEl.hidden = false;
                    errorEl.textContent = issues[0];
                }
                refresh();
                return;
            }
            if (errorEl) {
                errorEl.hidden = true;
                errorEl.textContent = '';
            }
        });
    };

    const openModal = (id) => {
        document.querySelectorAll('.modal-backdrop.is-open').forEach((el) => el.classList.remove('is-open'));
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('is-open');
        document.body.classList.add('modal-open');
    };
    const closeModals = () => {
        document.querySelectorAll('.modal-backdrop.is-open').forEach((el) => el.classList.remove('is-open'));
        document.body.classList.remove('modal-open');
    };

    document.querySelectorAll('[data-open-modal]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const which = btn.getAttribute('data-open-modal');
            if (which === 'password') {
                const local = btn.getAttribute('data-email-local') || '';
                const full = btn.getAttribute('data-email-full') || '';
                const input = document.getElementById('pw-username');
                if (input) input.value = local;
                const sub = document.getElementById('password-subtitle');
                if (sub) sub.textContent = full ? `Set a new password for ${full}.` : 'Set a new password for this mailbox.';
                document.getElementById('pw-password').value = genPassword();
                paintRequirements(document.querySelector('#password-form .req-list'));
                openModal('modal-password');
                return;
            }
            openModal('modal-' + which);
        });
    });
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
        btn.addEventListener('click', closeModals);
    });
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModals();
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModals();
    });
    document.querySelectorAll('.modal-backdrop[data-open-on-load="1"]').forEach((el) => {
        el.classList.add('is-open');
        document.body.classList.add('modal-open');
    });

    document.getElementById('gen-user')?.addEventListener('click', () => {
        const word = words[Math.floor(Math.random() * words.length)];
        document.getElementById('username').value = word + rand(3);
        paintRequirements(document.querySelector('#create-form .req-list'));
    });
    document.getElementById('gen-pass')?.addEventListener('click', () => {
        document.getElementById('password').value = genPassword();
        paintRequirements(document.querySelector('#create-form .req-list'));
    });
    document.getElementById('gen-pw-pass')?.addEventListener('click', () => {
        document.getElementById('pw-password').value = genPassword();
        paintRequirements(document.querySelector('#password-form .req-list'));
    });

    bindPasswordForm(document.getElementById('create-form'));
    bindPasswordForm(document.getElementById('password-form'));
</script>
@endsection
