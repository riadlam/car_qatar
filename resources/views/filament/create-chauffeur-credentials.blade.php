@php
    /** @var array{name?: string, email?: string, password?: string}|null $credentials */
    $credentials = $credentials ?? null;
    $listUrl = $listUrl ?? '#';
@endphp

@if (is_array($credentials))
    <div class="fi-section rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 mb-6">
        <div class="fi-section-header flex flex-col gap-1 px-6 py-4">
            <h3 class="text-base font-semibold text-gray-950 dark:text-white">
                Hand these credentials to the chauffeur
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                Copy email and password now — the password is only shown once here.
            </p>
        </div>
        <div class="fi-section-content px-6 pb-6">
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

            <div class="mt-4 flex flex-wrap gap-3">
                <a
                    href="{{ $listUrl }}"
                    class="fi-btn fi-btn-color-gray fi-btn-size-md fi-btn-outline inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold outline-none"
                >
                    Open chauffeur list
                </a>
                <button
                    type="button"
                    wire:click="clearHandedCredentials"
                    class="fi-btn fi-btn-color-primary fi-btn-size-md fi-btn-outline inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold outline-none"
                >
                    Create another
                </button>
            </div>
        </div>
    </div>
@endif
