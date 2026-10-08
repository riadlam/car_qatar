import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SiteLayout from '../components/landing/SiteLayout';
import Skeleton from '../components/ui/Skeleton';
import { confirmGuestPayment, fetchGuestPayment } from '../api/partner';
import { formatMoney, normalizeCurrency } from '../utils/currency';

function money(amount, currency = 'QAR') {
    return formatMoney(amount, normalizeCurrency(currency));
}

export default function GuestPay() {
    const { t } = useTranslation(['booking', 'journeys']);
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);
    const [payload, setPayload] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');
        fetchGuestPayment(token)
            .then((res) => {
                if (!cancelled) setPayload(res);
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(
                        err?.response?.data?.message ||
                            err?.response?.data?.errors?.token?.[0] ||
                            t('guestPay.expired'),
                    );
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [token, t]);

    const onConfirm = async () => {
        setConfirming(true);
        setError('');
        try {
            const res = await confirmGuestPayment(token);
            setPayload({ data: res.data, expires_at: payload?.expires_at });
            setDone(true);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.errors?.token?.[0] ||
                    t('checkout.errors.bookFailed'),
            );
        } finally {
            setConfirming(false);
        }
    };

    const booking = payload?.data;

    return (
        <SiteLayout>
            <div className="mx-auto min-h-[70vh] w-full max-w-[560px] px-4 py-16 sm:px-6 lg:py-24">
                <p className="font-geist m-0 text-[13px] font-500 tracking-[0.08em] text-muted uppercase">
                    {t('guestPay.subtitle')}
                </p>
                <h1 className="font-fragment mt-2 m-0 text-[32px] leading-10 font-400 tracking-[0.2px] text-ink-text sm:text-[40px] sm:leading-[48px]">
                    {t('guestPay.title')}
                </h1>
                <p className="font-geist mt-3 m-0 text-[16px] leading-6 text-ink-text/75">
                    {t('checkout.security.noCharge')}
                </p>

                {loading ? (
                    <div className="mt-10 space-y-3">
                        <Skeleton className="h-28 w-full rounded-2xl" />
                        <Skeleton className="h-40 w-full rounded-2xl" />
                    </div>
                ) : error && !booking ? (
                    <p className="font-geist mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-[15px] text-red-800" role="alert">
                        {error}
                    </p>
                ) : booking ? (
                    <div className="mt-10 space-y-5">
                        <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5 sm:p-6">
                            <p className="font-geist m-0 text-[13px] text-muted">
                                {t('journeys:card.bookingNumber', { number: booking.booking_number })}
                            </p>
                            <p className="font-geist mt-3 m-0 text-[15px] text-ink-text">
                                <span className="font-500">{t('journeys:card.pickup')}</span>
                                <br />
                                {booking.pickup_location?.formatted_address || '—'}
                            </p>
                            {booking.dropoff_location ? (
                                <p className="font-geist mt-3 m-0 text-[15px] text-ink-text">
                                    <span className="font-500">{t('journeys:card.dropoff')}</span>
                                    <br />
                                    {booking.dropoff_location.formatted_address || '—'}
                                </p>
                            ) : null}
                            <p className="font-geist mt-3 m-0 text-[15px] text-ink-text">
                                <span className="font-500">{t('checkout.sidebar.trip')}</span>
                                <br />
                                {booking.pickup_at
                                    ? new Date(booking.pickup_at).toLocaleString()
                                    : '—'}
                            </p>
                            <p className="font-geist mt-3 m-0 text-[15px] text-ink-text">
                                <span className="font-500">{t('journeys:card.vehicle')}</span>
                                <br />
                                {booking.vehicle_class?.name || '—'}
                                {booking.service_type?.name ? ` · ${booking.service_type.name}` : ''}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3 py-2">
                                <span className="font-geist text-[15px] text-ink-text/80">
                                    {Number(booking.tax_amount) > 0
                                        ? t('sidebar.priceExTax')
                                        : t('sidebar.price')}
                                </span>
                                <span className="font-geist text-[15px] text-ink-text">
                                    {money(booking.subtotal, booking.currency)}
                                </span>
                            </div>
                            {Number(booking.tax_amount) > 0 ? (
                                <div className="flex items-center justify-between gap-3 border-t border-[#f0f0f2] py-2">
                                    <span className="font-geist text-[15px] text-ink-text/80">
                                        {t('sidebar.estimatedTax')}
                                    </span>
                                    <span className="font-geist text-[15px] text-ink-text">
                                        {money(booking.tax_amount, booking.currency)}
                                    </span>
                                </div>
                            ) : null}
                            <div className="flex items-center justify-between gap-3 border-t border-[#f0f0f2] pt-3">
                                <span className="font-geist text-[16px] font-500 text-ink-text">{t('checkout.sidebar.total')}</span>
                                <span className="font-geist text-[18px] font-500 text-ink-text">
                                    {money(booking.total, booking.currency)}
                                </span>
                            </div>
                        </div>

                        {done ? (
                            <p className="font-geist m-0 rounded-2xl border border-wine-200 bg-wine-50 p-5 text-center text-[16px] text-ink-text">
                                {t('guestPay.paid')}
                            </p>
                        ) : (
                            <>
                                {error ? (
                                    <p className="font-geist m-0 text-[14px] text-red-700" role="alert">
                                        {error}
                                    </p>
                                ) : null}
                                <button
                                    type="button"
                                    disabled={confirming}
                                    onClick={onConfirm}
                                    className="font-geist w-full rounded-full bg-wine-700 py-3.5 text-[16px] font-500 text-white transition hover:bg-wine-600 disabled:opacity-60"
                                >
                                    {confirming ? t('checkout.sidebar.confirming') : t('guestPay.pay')}
                                </button>
                            </>
                        )}
                    </div>
                ) : null}
            </div>
        </SiteLayout>
    );
}
