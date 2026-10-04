@extends('create-email.layout')

@section('title', 'Sign in')

@section('body')
<div class="login-wrap">
    <div class="card login-card">
        <h1>Mailboxes</h1>
        <p class="muted" style="margin: 0.6rem 0 1.4rem;">Sign in to manage addresses.</p>

        @if ($errors->any())
            <div class="error">{{ $errors->first() }}</div>
        @endif

        <form method="post" action="{{ route('create-email.login.submit') }}">
            @csrf
            <div class="field">
                <label for="email">Email</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autocomplete="username">
            </div>
            <div class="field">
                <label for="password">Password</label>
                <input id="password" type="password" name="password" required autocomplete="current-password">
            </div>
            <button class="btn btn-primary" type="submit" style="width: 100%;">Sign in</button>
        </form>
    </div>
</div>
@endsection
