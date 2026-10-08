<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** @var list<array{0: string, 1: string}> */
    private array $currencyColumns = [
        ['countries', 'default_currency'],
        ['pricing_rules', 'currency'],
        ['seat_addons', 'currency'],
        ['surcharges', 'currency'],
        ['quotes', 'currency'],
        ['bookings', 'currency'],
        ['booking_cancellations', 'currency'],
        ['payments', 'currency'],
        ['wallets', 'currency'],
        ['wallet_transactions', 'currency'],
        ['partner_payouts', 'currency'],
        ['cancellation_policies', 'currency'],
    ];

    public function up(): void
    {
        foreach ($this->currencyColumns as [$table, $column]) {
            if (! Schema::hasTable($table) || ! Schema::hasColumn($table, $column)) {
                continue;
            }

            DB::table($table)
                ->where(function ($query) use ($column) {
                    $query->whereIn($column, ['USD', 'usd', 'US$', '$'])
                        ->orWhereNull($column)
                        ->orWhere($column, '');
                })
                ->update([$column => 'QAR']);

            // MySQL column default → QAR where still USD
            try {
                DB::statement("ALTER TABLE `{$table}` ALTER `{$column}` SET DEFAULT 'QAR'");
            } catch (\Throwable) {
                // Ignore engines / SQLite that don't support ALTER DEFAULT this way.
            }
        }
    }

    public function down(): void
    {
        // Irreversible data migration — keep QAR.
    }
};
