<?php

namespace App\Services\Payments;

use Illuminate\Validation\ValidationException;

/**
 * Validates a card and keeps only display metadata. The number and CVC are never stored.
 */
class CardTokenizer
{
    /**
     * @param  array{number: string, holder_name: string, expiry: string, cvc: string}  $input
     * @return array{brand: string, last_four: string, holder_name: string, exp_month: int, exp_year: int}
     */
    public function tokenize(array $input): array
    {
        $digits = preg_replace('/\D+/', '', (string) ($input['number'] ?? '')) ?? '';
        $cvc = preg_replace('/\D+/', '', (string) ($input['cvc'] ?? '')) ?? '';
        $holder = trim(strip_tags((string) ($input['holder_name'] ?? '')));
        $expiry = trim((string) ($input['expiry'] ?? ''));

        if (! $this->luhn($digits) || strlen($digits) < 13 || strlen($digits) > 19) {
            throw ValidationException::withMessages([
                'number' => ['Enter a valid card number.'],
            ]);
        }

        if ($holder === '' || mb_strlen($holder) > 100) {
            throw ValidationException::withMessages([
                'holder_name' => ['Cardholder name is required.'],
            ]);
        }

        if (! preg_match('/^(0[1-9]|1[0-2])\/(\d{2})$/', $expiry, $match)) {
            throw ValidationException::withMessages([
                'expiry' => ['Use expiry format MM/YY.'],
            ]);
        }

        $month = (int) $match[1];
        $year = 2000 + (int) $match[2];
        $expires = \DateTimeImmutable::createFromFormat('Y-n-j', sprintf('%d-%d-1', $year, $month));
        $endOfMonth = $expires?->modify('last day of this month')->setTime(23, 59, 59);
        if (! $endOfMonth || $endOfMonth < new \DateTimeImmutable('today')) {
            throw ValidationException::withMessages([
                'expiry' => ['This card has expired.'],
            ]);
        }

        $cvcLength = strlen($cvc);
        if ($cvcLength < 3 || $cvcLength > 4) {
            throw ValidationException::withMessages([
                'cvc' => ['Enter a valid CVC.'],
            ]);
        }

        unset($cvc, $input['cvc'], $input['number']);

        return [
            'brand' => $this->brand($digits),
            'last_four' => substr($digits, -4),
            'holder_name' => $holder,
            'exp_month' => $month,
            'exp_year' => $year,
        ];
    }

    private function luhn(string $digits): bool
    {
        if ($digits === '' || ! ctype_digit($digits)) {
            return false;
        }

        $sum = 0;
        $alt = false;
        for ($i = strlen($digits) - 1; $i >= 0; $i--) {
            $n = (int) $digits[$i];
            if ($alt) {
                $n *= 2;
                if ($n > 9) {
                    $n -= 9;
                }
            }
            $sum += $n;
            $alt = ! $alt;
        }

        return $sum % 10 === 0;
    }

    private function brand(string $digits): string
    {
        if (str_starts_with($digits, '4')) {
            return 'Visa';
        }
        if (preg_match('/^5[1-5]/', $digits) || preg_match('/^2[2-7]/', $digits)) {
            return 'Mastercard';
        }
        if (preg_match('/^3[47]/', $digits)) {
            return 'Amex';
        }
        if (preg_match('/^6(?:011|5)/', $digits)) {
            return 'Discover';
        }

        return 'Card';
    }
}
