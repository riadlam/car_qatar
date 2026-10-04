<?php

namespace App\Http\Controllers;

use App\Services\Cpanel\CpanelEmailService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use RuntimeException;
use Throwable;

class CreateEmailController extends Controller
{
    public function __construct(
        private readonly CpanelEmailService $emails,
    ) {}

    public function showLogin(): View|RedirectResponse
    {
        if (session('create_email_authed')) {
            return redirect()->route('create-email.index');
        }

        return view('create-email.login');
    }

    public function login(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $expectedEmail = (string) config('services.create_email_gate.email');
        $expectedPassword = (string) config('services.create_email_gate.password');

        if (
            $expectedEmail === ''
            || $expectedPassword === ''
            || ! hash_equals(strtolower($expectedEmail), strtolower($data['email']))
            || ! hash_equals($expectedPassword, $data['password'])
        ) {
            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'Invalid email or password.']);
        }

        $request->session()->regenerate();
        $request->session()->put('create_email_authed', true);

        return redirect()->route('create-email.index');
    }

    public function logout(Request $request): RedirectResponse
    {
        $request->session()->forget('create_email_authed');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('create-email.login');
    }

    public function index(): View
    {
        $accounts = [];
        $listError = null;

        try {
            if (! $this->emails->isConfigured()) {
                $listError = 'Mail service is not configured yet.';
            } else {
                $accounts = $this->emails->listAccounts();
            }
        } catch (Throwable) {
            $listError = 'Unable to reach the mail service. Try again later.';
        }

        return view('create-email.index', [
            'accounts' => $accounts,
            'listError' => $listError,
            'domain' => $this->emails->domain(),
            'webmailUrl' => $this->emails->webmailUrl(),
            'suggestedLocal' => $this->emails->generateAnonymousLocalPart(),
            'suggestedPassword' => $this->emails->generatePassword(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:64', 'regex:/^[A-Za-z0-9._+-]+$/'],
            'password' => ['required', 'string', 'min:8', 'max:128'],
        ]);

        try {
            $created = $this->emails->createAccount($data['username'], $data['password']);
        } catch (RuntimeException $e) {
            return back()
                ->withInput($request->except('password'))
                ->withErrors(['username' => $e->getMessage()]);
        } catch (Throwable) {
            return back()
                ->withInput($request->except('password'))
                ->withErrors(['username' => 'Could not create the mailbox. Try again.']);
        }

        return redirect()
            ->route('create-email.index')
            ->with('created', [
                'email' => $created['email'],
                'password' => $created['password'],
                'webmail_url' => $created['webmail_url'],
            ]);
    }
}
