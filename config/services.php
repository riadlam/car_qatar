<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'mapbox' => [
        'public_token' => env('VITE_MAPBOX_ACCESS_TOKEN', env('MAPBOX_PUBLIC_TOKEN')),
        'secret_token' => env('MAPBOX_SECRET_TOKEN'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI', rtrim((string) env('APP_URL'), '/').'/auth/google/callback'),
    ],

    'cpanel' => [
        'host' => rtrim((string) env('CPANEL_HOST', ''), '/'),
        'user' => env('CPANEL_USER'),
        'api_token' => env('CPANEL_API_TOKEN'),
        'email_domain' => env('CPANEL_EMAIL_DOMAIN', 'almajdluxurytransport.com'),
        'webmail_url' => rtrim((string) env('CPANEL_WEBMAIL_URL', 'https://almajdluxurytransport.com:2096'), '/'),
        'verify_ssl' => filter_var(env('CPANEL_VERIFY_SSL', true), FILTER_VALIDATE_BOOLEAN),
    ],

    'create_email_gate' => [
        'email' => env('CREATE_EMAIL_GATE_EMAIL'),
        'password' => env('CREATE_EMAIL_GATE_PASSWORD'),
    ],

];
