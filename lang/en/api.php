<?php

return [

    'auth' => [
        'credentials_incorrect' => 'The provided credentials are incorrect.',
        'chauffeur_declined' => 'Your chauffeur application was not approved.',
        'logged_out' => 'Logged out successfully.',
        'otp_sent' => 'A confirmation code has been sent to your email.',
        'otp_resent' => 'A new confirmation code has been sent to your email.',
        'otp_verified' => 'Email confirmed. Continue creating your account.',
        'otp_invalid' => 'That confirmation code is incorrect.',
        'otp_expired' => 'That confirmation code has expired. Request a new one.',
        'otp_locked' => 'Too many incorrect attempts. Request a new code.',
        'otp_cooldown' => 'Please wait :seconds seconds before requesting another code.',
        'otp_send_limit' => 'Too many codes sent. Try again in an hour.',
        'otp_email_taken' => 'An account with this email already exists. Sign in instead.',
        'otp_token_required' => 'Confirm your email before creating an account.',
        'otp_token_invalid' => 'Email confirmation expired. Please verify your email again.',
    ],

    'profile' => [
        'password_updated' => 'Password updated successfully.',
        'account_deleted' => 'Account deleted successfully.',
    ],

    'middleware' => [
        'customer_only' => 'Only a customer account can access journeys.',
        'customer_or_partner' => 'Only a customer or partner account can book.',
        'partner_only' => 'Only a partner account can access this.',
        'partner_inactive' => 'No active partner organization is linked to this account.',
        'chauffeur_only' => 'Only an approved chauffeur can access this.',
    ],

    'chauffeur' => [
        'paused_offers' => 'Your account is paused. You cannot receive or accept ride offers until an admin resumes you.',
    ],

    'wallet' => [
        'credit_amount_positive' => 'Credit amount must be greater than zero.',
        'credit_super_admin_only' => 'Only a Super Admin can credit wallets.',
        'roles_only' => 'Wallets are only for customers, partners, and chauffeurs.',
        'frozen' => 'This wallet is frozen.',
        'frozen_contact' => 'Your wallet is frozen. Contact support.',
        'cannot_pay_status' => 'This booking cannot be paid with wallet in its current status.',
        'booking_total_invalid' => 'Booking total is invalid.',
        'currency_mismatch' => 'Wallet currency does not match this booking.',
        'insufficient_balance' => 'Insufficient wallet balance. Need :currency :amount, available :available.',
        'cannot_pay_booking' => 'You cannot pay this booking from your wallet.',
        'adjust_super_admin_only' => 'Only a Super Admin can adjust wallets.',
        'debit_note_required' => 'A note is required for admin debits.',
        'insufficient_for_adjustment' => 'Insufficient balance for this adjustment.',
    ],

    'booking' => [
        'vehicle_class_required' => 'A vehicle class is required to create a single quote.',
        'no_priced_classes' => 'No priced vehicle classes available for this service.',
        'quote_not_priced' => 'Quote must be in priced status to convert.',
        'quote_expired' => 'This quote has expired. Refresh the price and try again.',
        'quote_not_yours' => 'This quote does not belong to you.',
        'quote_missing_class' => 'Quote is missing a vehicle class.',
        'quote_missing_pickup' => 'Quote is missing a pickup time.',
        'partner_guest_required' => 'Partner bookings require guest traveler details.',
        'billing_required' => 'Add billing information before booking.',
        'already_cancelled' => 'Booking is already cancelled.',
        'completed_cannot_cancel' => 'Completed bookings cannot be cancelled.',
        'unknown_service' => 'Unknown or inactive service type.',
        'unknown_vehicle_class' => 'Unknown or inactive vehicle class.',
        'quote_cannot_refresh' => 'This quote has expired and cannot be refreshed.',
    ],

    'review' => [
        'submitted' => 'Thank you for your review.',
        'not_completed' => 'You can only review a completed trip.',
        'already_submitted' => 'You already reviewed this trip.',
        'no_chauffeur' => 'This trip has no chauffeur to review.',
    ],

];
