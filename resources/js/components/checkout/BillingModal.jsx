import { useEffect, useState } from 'react';
import { firstApiError, saveBillingProfile } from '../../api/checkout';

const EMPTY = {
    company: '',
    street: '',
    zip: '',
    city: '',
    country: '',
};

export function billingSummary(profile) {
    if (!profile) return '';
    return [profile.company, profile.street, [profile.zip, profile.city].filter(Boolean).join(' '), profile.country]
        .filter(Boolean)
        .join(', ');
}

export default function BillingModal({ open, countries, profile, onClose, onSaved }) {
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        setError('');
        setForm({
            company: profile?.company || '',
            street: profile?.street || '',
            zip: profile?.zip || '',
            city: profile?.city || '',
            country: profile?.country || countries[0] || '',
        });
    }, [open, profile, countries]);

    if (!open) return null;

    async function onSubmit(event) {
        event.preventDefault();
        if (!form.street.trim() || !form.zip.trim() || !form.city.trim() || !form.country) {
            setError('Street, ZIP, city, and country are required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const saved = await saveBillingProfile({
                company: form.company.trim() || null,
                street: form.street.trim(),
                zip: form.zip.trim(),
                city: form.city.trim(),
                country: form.country,
            });
            onSaved(saved);
            onClose();
        } catch (err) {
            setError(firstApiError(err, 'Could not save billing details.'));
        } finally {
            setSaving(false);
        }
    }

    const field =
        'font-geist box-border h-12 w-full rounded-lg border border-[#d8d8dc] px-3.5 text-[16px] text-ink-text outline-none focus:border-wine-700';

    return (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/50 p-4 sm:items-center" role="presentation">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-[480px] rounded-2xl bg-white p-5 shadow-[0_16px_48px_rgba(24,26,27,0.2)] sm:p-6"
            >
                <h2 className="font-fragment m-0 text-[22px] leading-7 font-400 text-ink-text">
                    {profile ? 'Edit billing information' : 'Add billing information'}
                </h2>
                <p className="font-geist m-0 mt-1 text-[14px] text-muted">
                    This address is stored on your account and copied onto each booking.
                </p>
                <div className="mt-4 grid gap-3">
                    <input
                        className={field}
                        placeholder="Company (optional)"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                    <input
                        className={field}
                        required
                        placeholder="Street and number"
                        value={form.street}
                        onChange={(e) => setForm({ ...form, street: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            className={field}
                            required
                            placeholder="ZIP"
                            value={form.zip}
                            onChange={(e) => setForm({ ...form, zip: e.target.value })}
                        />
                        <input
                            className={field}
                            required
                            placeholder="City"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                    </div>
                    <select
                        className={field}
                        required
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                    >
                        <option value="">Country</option>
                        {countries.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>
                {error ? <p className="font-geist m-0 mt-3 text-[14px] text-rose-700">{error}</p> : null}
                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-geist h-11 cursor-pointer rounded-full border border-[#d8d8dc] px-4 text-[15px] font-500 text-ink-text hover:bg-page"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="font-geist h-11 cursor-pointer rounded-full border-0 bg-wine-700 px-4 text-[15px] font-500 text-white hover:bg-wine-600 disabled:opacity-50"
                    >
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}
