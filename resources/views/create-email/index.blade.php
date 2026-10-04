@extends('create-email.layout')

@section('title', 'Mailboxes')

@section('body')
<div class="wrap">
    <div class="top">
        <div>
            <h1>Mailboxes</h1>
            <p class="muted" style="margin: 0.4rem 0 0;">{{ '@'.$domain }}</p>
        </div>
        <form method="post" action="{{ route('create-email.logout') }}">
            @csrf
            <button class="btn btn-ghost" type="submit">Log out</button>
        </form>
    </div>

    @if (session('created'))
        <div class="ok">
            <strong>Mailbox ready</strong>
            <p style="margin: 0.55rem 0 0;">Address: <code>{{ session('created.email') }}</code></p>
            <p style="margin: 0.35rem 0 0;">Password: <code>{{ session('created.password') }}</code></p>
            <p style="margin: 0.8rem 0 0;">
                <a class="btn btn-primary" href="{{ session('created.webmail_url') }}" target="_blank" rel="noopener noreferrer">Open webmail</a>
            </p>
            <p class="muted" style="margin: 0.7rem 0 0; font-size: 0.85rem;">Copy the password now — it won’t be shown again.</p>
        </div>
    @endif

    <div class="grid">
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
                                <td style="text-align: right;">
                                    <a class="btn btn-ghost" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" href="{{ $webmailUrl }}" target="_blank" rel="noopener noreferrer">Webmail</a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </section>

        <section class="card">
            <h2 style="margin: 0 0 0.35rem; font-size: 1.35rem; font-weight: 400;">Create mailbox</h2>
            <p class="muted" style="margin: 0 0 1rem; font-size: 0.92rem;">Use an anonymous username if you don’t want a personal name on the address.</p>

            @if ($errors->any())
                <div class="error">{{ $errors->first() }}</div>
            @endif

            <form method="post" action="{{ route('create-email.store') }}" id="create-form">
                @csrf
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
                    <button class="btn btn-ghost" type="button" id="gen-user">Anonymous username</button>
                    <button class="btn btn-ghost" type="button" id="gen-pass">New password</button>
                    <button class="btn btn-primary" type="submit">Create</button>
                </div>
            </form>
        </section>
    </div>
</div>

<script>
    const words = ["octanium","vellum","nimbus","cobalt","harbor","lumen","sable","quartz","meridian","cascade","ember","frost","glyph","helix","ivory","jasper","kestrel","lattice","marble","nebula","onyx","prism","quasar","ripple","solstice","timber","umbra","vortex"];
    const rand = (n) => Math.random().toString(36).slice(2, 2 + n);
    document.getElementById('gen-user')?.addEventListener('click', () => {
        const word = words[Math.floor(Math.random() * words.length)];
        document.getElementById('username').value = word + rand(3);
    });
    document.getElementById('gen-pass')?.addEventListener('click', () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
        let out = '';
        for (let i = 0; i < 16; i++) out += chars[Math.floor(Math.random() * chars.length)];
        document.getElementById('password').value = out;
    });
</script>
@endsection
