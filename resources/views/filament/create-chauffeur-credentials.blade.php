@php
    /** @var array{name?: string, email?: string, password?: string}|null $credentials */
    $credentials = $credentials ?? null;
@endphp

@if (is_array($credentials))
    <div class="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
        <p class="m-0 font-medium text-gray-950 dark:text-white">
            {{ $credentials['name'] ?? 'Chauffeur' }}
        </p>
        <div class="grid gap-3 sm:grid-cols-2">
            <div>
                <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Login email</p>
                <code class="block break-all rounded-lg bg-white px-3 py-2 text-[13px] text-gray-950 shadow-sm ring-1 ring-gray-950/10 dark:bg-white/5 dark:text-white dark:ring-white/10">
                    {{ $credentials['email'] ?? '' }}
                </code>
            </div>
            <div>
                <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Temporary password</p>
                <code class="block break-all rounded-lg bg-white px-3 py-2 text-[13px] text-gray-950 shadow-sm ring-1 ring-gray-950/10 dark:bg-white/5 dark:text-white dark:ring-white/10">
                    {{ $credentials['password'] ?? '' }}
                </code>
            </div>
        </div>
        <p class="m-0 text-xs text-gray-600 dark:text-gray-300">
            Login URL: <span class="font-medium">{{ url('/login') }}</span>
        </p>
    </div>
@endif
