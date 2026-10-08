<x-mail::message>
# Confirm your email

Use this code to continue creating your AL MAJD account:

<x-mail::panel>
**{{ $code }}**
</x-mail::panel>

This code expires in {{ $expiresMinutes }} minutes. If you did not request it, you can ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
