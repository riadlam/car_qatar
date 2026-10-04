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

        <form method="post" action="{{ route('create-email.store') }}" id="create-form">
            @csrf
            <input type="hidden" name="_modal" value="create">
            <div class="field">
                <label for="username">Username</label>
                <div class="row">
                    <input id="username" type="text" name="username" value="{{ old('username', $suggestedLocal) }}" required autocomplete="off" pattern="[A-Za-z0-9._+\-]+">
                    <span class="suffix">{{ '@'.$domain }}</span>
                </div>
            </div>
            <div class="field">
                <label for="password">Password</label>
                <input id="password" type="text" name="password" value="{{ old('password', $suggestedPassword) }}" required minlength="8" autocomplete="new-password">
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

        <form method="post" action="{{ route('create-email.password') }}" id="password-form">
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
                <input id="pw-password" type="text" name="password" value="{{ old('password', $suggestedPassword) }}" required minlength="8" autocomplete="new-password">
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
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
        let out = '';
        for (let i = 0; i < 16; i++) out += chars[Math.floor(Math.random() * chars.length)];
        return out;
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
    });
    document.getElementById('gen-pass')?.addEventListener('click', () => {
        document.getElementById('password').value = genPassword();
    });
    document.getElementById('gen-pw-pass')?.addEventListener('click', () => {
        document.getElementById('pw-password').value = genPassword();
    });
</script>
@endsection
