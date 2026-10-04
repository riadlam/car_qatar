<?php

namespace App\Support;

final class MailboxPassword
{
    public static function rules(): array
    {
        return [
            'required',
            'string',
            'min:10',
            'max:128',
            'regex:/[a-z]/',
            'regex:/[A-Z]/',
            'regex:/[0-9]/',
            'regex:/[^A-Za-z0-9]/',
        ];
    }

    public static function messages(): array
    {
        return [
            'password.min' => 'Password must be at least 10 characters.',
            'password.regex' => 'Password must include uppercase, lowercase, a number, and a symbol.',
        ];
    }

    public static function validate(string $password, string $username = ''): ?string
    {
        $password = trim($password);
        $username = strtolower(trim($username));

        if (strlen($password) < 10) {
            return 'Password must be at least 10 characters.';
        }
        if (strlen($password) > 128) {
            return 'Password is too long.';
        }
        if (! preg_match('/[a-z]/', $password)) {
            return 'Password must include a lowercase letter.';
        }
        if (! preg_match('/[A-Z]/', $password)) {
            return 'Password must include an uppercase letter.';
        }
        if (! preg_match('/[0-9]/', $password)) {
            return 'Password must include a number.';
        }
        if (! preg_match('/[^A-Za-z0-9]/', $password)) {
            return 'Password must include a symbol (for example ! @ # $ %).';
        }
        if ($username !== '' && str_contains(strtolower($password), $username)) {
            return 'Password must not contain the username.';
        }

        return null;
    }

    public static function generate(int $length = 16): string
    {
        $length = max(12, min(32, $length));
        $lower = 'abcdefghijkmnopqrstuvwxyz';
        $upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        $digits = '23456789';
        $symbols = '!@#$%*?';

        $chars = [
            $lower[random_int(0, strlen($lower) - 1)],
            $upper[random_int(0, strlen($upper) - 1)],
            $digits[random_int(0, strlen($digits) - 1)],
            $symbols[random_int(0, strlen($symbols) - 1)],
        ];

        $all = $lower.$upper.$digits.$symbols;
        for ($i = count($chars); $i < $length; $i++) {
            $chars[] = $all[random_int(0, strlen($all) - 1)];
        }

        shuffle($chars);

        return implode('', $chars);
    }
}
