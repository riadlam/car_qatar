import { useEffect, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Link, useNavigate } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import AddCardModal from '../components/account/AddCardModal';
import { useAuth } from '../context/AuthContext';

const TITLES = ['Mr.', 'Mrs.'];
const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'ar', label: 'العربية' },
    { value: 'de', label: 'Deutsch' },
];

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

function Section({ title, children, action }) {
    return (
        <section className="border-b border-[#eef1f3] py-8 last:border-b-0">
            <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="font-fragment m-0 text-[22px] leading-8 font-400 tracking-[0.25px] text-ink-text sm:text-[24px]">
                    {title}
                </h2>
                {action}
            </div>
            {children}
        </section>
    );
}

function Row({ label, value, onEdit }) {
    return (
        <div className="flex flex-col gap-1 border-b border-[#f3f3f4] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
                <p className="font-geist m-0 text-[13px] font-500 tracking-[0.04em] text-muted uppercase">
                    {label}
                </p>
                <p className="font-geist mt-1 m-0 break-words text-[16px] leading-6 text-ink-text">
                    {value || '—'}
                </p>
            </div>
            {onEdit ? (
                <button
                    type="button"
                    onClick={onEdit}
                    className="font-geist shrink-0 cursor-pointer self-start text-[14px] font-500 text-wine-700 underline-offset-2 hover:underline sm:self-center"
                >
                    Edit
                </button>
            ) : null}
        </div>
    );
}

function EditModal({ open, title, onClose, children, onSave, saveLabel = 'Save' }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-[90] flex items-end justify-center bg-ink-text/45 p-0 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="font-fragment m-0 text-[22px] leading-8 font-400 text-ink-text">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-black/5"
                    >
                        ×
                    </button>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave();
                    }}
                    className="space-y-4"
                >
                    {children}
                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] px-5 py-2 text-[15px] font-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-5 py-2 text-[15px] font-500 text-white hover:bg-wine-600"
                        >
                            {saveLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function displayName(user) {
    const parts = [user?.title, user?.first_name || user?.name, user?.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();
    return parts || user?.name || '—';
}

export default function Account() {
    const navigate = useNavigate();
    const { user, loading, isAuthenticated, updateUser, deleteAccount, setReturnTo } = useAuth();

    const [edit, setEdit] = useState(null);
    const [draft, setDraft] = useState({});
    const [cardOpen, setCardOpen] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState('');

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            setReturnTo('/account');
            navigate('/login?from=%2Faccount', { replace: true });
        }
    }, [loading, isAuthenticated, navigate, setReturnTo]);

    if (loading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-page text-ink-text">
                Loading...
            </div>
        );
    }

    const cards = user.payment_methods || [];
    const langLabel = LANGUAGES.find((l) => l.value === (user.language || 'en'))?.label || 'English';
    const bookingLabel =
        user.booking_notifications === 'email'
            ? 'On (Email)'
            : user.booking_notifications === 'sms'
              ? 'On (SMS)'
              : user.booking_notifications === 'off'
                ? 'Off'
                : 'On (Email & SMS)';

    const openEdit = (key, initial) => {
        setDraft(initial);
        setEdit(key);
        setPasswordMsg('');
    };

    const closeEdit = () => {
        setEdit(null);
        setDraft({});
        setPasswordMsg('');
    };

    return (
        <SiteLayout>
            <div id="top" className="bg-page pt-[96px] pb-16 lg:pt-[120px] lg:pb-24">
                <div className="mx-auto max-w-[760px] px-6 lg:px-0">
                    <h1 className="font-fragment m-0 text-[32px] leading-10 font-400 tracking-[0.25px] text-ink-text sm:text-[40px] sm:leading-[48px]">
                        Account
                    </h1>
                    <p className="font-geist mt-2 m-0 text-[16px] leading-6 text-muted">
                        Manage your account settings
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            to="/journeys"
                            className="font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[#d8d8dc] bg-white px-4 py-2 text-[14px] font-500 text-ink-text transition hover:border-wine-700 hover:text-wine-700"
                        >
                            My journeys
                        </Link>
                        <Link
                            to="/chauffeur"
                            className="font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[#d8d8dc] bg-white px-4 py-2 text-[14px] font-500 text-ink-text transition hover:border-wine-700 hover:text-wine-700"
                        >
                            Chauffeur portal
                        </Link>
                    </div>

                    <div className="mt-8 rounded-2xl border border-[#e8e8ea] bg-white px-5 sm:px-8">
                        <Section title="Personal information">
                            <Row
                                label="Name"
                                value={displayName(user)}
                                onEdit={() =>
                                    openEdit('name', {
                                        title: user.title || 'Mr.',
                                        first_name: user.first_name || '',
                                        last_name: user.last_name || '',
                                    })
                                }
                            />
                            <Row
                                label="Mobile number"
                                value={user.phone || '—'}
                                onEdit={() => openEdit('phone', { phone: user.phone || '' })}
                            />
                            <Row
                                label="Company"
                                value={user.company || '—'}
                                onEdit={() => openEdit('company', { company: user.company || '' })}
                            />
                            <Row
                                label="Street address"
                                value={user.street_address || '—'}
                                onEdit={() =>
                                    openEdit('address', {
                                        street_address: user.street_address || '',
                                    })
                                }
                            />
                        </Section>

                        <Section title="Email address">
                            <Row
                                label="Email address"
                                value={user.email}
                                onEdit={() => openEdit('email', { email: user.email || '' })}
                            />
                        </Section>

                        <Section title="Password">
                            <Row
                                label="Password"
                                value="••••••••••••"
                                onEdit={() =>
                                    openEdit('password', {
                                        current: '',
                                        next: '',
                                        confirm: '',
                                    })
                                }
                            />
                        </Section>

                        <Section
                            title="Payment methods"
                            action={
                                <button
                                    type="button"
                                    onClick={() => setCardOpen(true)}
                                    className="font-geist cursor-pointer text-[14px] font-500 text-wine-700 underline-offset-2 hover:underline"
                                >
                                    Add new card
                                </button>
                            }
                        >
                            <p className="font-geist mb-4 m-0 text-[14px] text-muted">
                                Personal credit or debit cards
                            </p>
                            {cards.length === 0 ? (
                                <p className="font-geist m-0 rounded-xl border border-dashed border-[#d8d8dc] bg-page/60 px-4 py-8 text-center text-[15px] text-muted">
                                    You haven&apos;t added any payment methods yet
                                </p>
                            ) : (
                                <ul className="m-0 list-none space-y-3 p-0">
                                    {cards.map((card) => (
                                        <li
                                            key={card.id}
                                            className="flex items-center justify-between gap-4 rounded-xl border border-[#e8e8ea] px-4 py-4"
                                        >
                                            <div>
                                                <p className="font-geist m-0 text-[15px] font-500 text-ink-text">
                                                    {card.brand} •••• {card.last4}
                                                </p>
                                                <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                                    {card.name} · Expires {card.expiry}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateUser({
                                                        payment_methods: cards.filter(
                                                            (c) => c.id !== card.id,
                                                        ),
                                                    })
                                                }
                                                className="font-geist cursor-pointer text-[14px] font-500 text-wine-700 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Section>

                        <Section title="Notifications">
                            <Row
                                label="Marketing emails"
                                value={user.marketing_emails === false ? 'Off' : 'On'}
                                onEdit={() =>
                                    openEdit('marketing', {
                                        marketing_emails: user.marketing_emails !== false,
                                    })
                                }
                            />
                            <Row
                                label="Booking notifications"
                                value={bookingLabel}
                                onEdit={() =>
                                    openEdit('booking', {
                                        booking_notifications:
                                            user.booking_notifications || 'email_sms',
                                    })
                                }
                            />
                        </Section>

                        <Section title="Communication language">
                            <p className="font-geist mb-3 m-0 text-[14px] leading-5 text-muted">
                                Select the language of your email and SMS booking updates.
                            </p>
                            <Row
                                label="Language"
                                value={langLabel}
                                onEdit={() =>
                                    openEdit('language', { language: user.language || 'en' })
                                }
                            />
                        </Section>

                        <section className="py-8">
                            <button
                                type="button"
                                onClick={() => openEdit('delete', {})}
                                className="font-geist cursor-pointer text-[16px] font-500 text-rose-700 underline-offset-2 hover:underline"
                            >
                                Delete account
                            </button>
                        </section>
                    </div>
                </div>
            </div>

            {/* Name */}
            <EditModal
                open={edit === 'name'}
                title="Edit name"
                onClose={closeEdit}
                onSave={() => {
                    updateUser({
                        title: draft.title,
                        first_name: draft.first_name.trim(),
                        last_name: draft.last_name.trim(),
                        name: [draft.first_name, draft.last_name].filter(Boolean).join(' '),
                    });
                    closeEdit();
                }}
            >
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">Title</span>
                    <select
                        className={fieldClass}
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    >
                        {TITLES.map((t) => (
                            <option key={t}>{t}</option>
                        ))}
                    </select>
                </label>
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">First name</span>
                    <input
                        required
                        className={fieldClass}
                        value={draft.first_name}
                        onChange={(e) => setDraft({ ...draft, first_name: e.target.value })}
                    />
                </label>
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">Last name</span>
                    <input
                        required
                        className={fieldClass}
                        value={draft.last_name}
                        onChange={(e) => setDraft({ ...draft, last_name: e.target.value })}
                    />
                </label>
            </EditModal>

            {/* Phone */}
            <EditModal
                open={edit === 'phone'}
                title="Edit mobile number"
                onClose={closeEdit}
                onSave={() => {
                    updateUser({ phone: draft.phone });
                    closeEdit();
                }}
            >
                <PhoneInput
                    defaultCountry="dz"
                    value={draft.phone || ''}
                    onChange={(phone) => setDraft({ ...draft, phone })}
                    forceDialCode
                    className="almajd-phone"
                />
            </EditModal>

            {/* Company */}
            <EditModal
                open={edit === 'company'}
                title="Edit company"
                onClose={closeEdit}
                onSave={() => {
                    updateUser({ company: draft.company.trim() });
                    closeEdit();
                }}
            >
                <input
                    className={fieldClass}
                    placeholder="Company name"
                    value={draft.company}
                    onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                />
            </EditModal>

            {/* Address */}
            <EditModal
                open={edit === 'address'}
                title="Edit street address"
                onClose={closeEdit}
                onSave={() => {
                    updateUser({ street_address: draft.street_address.trim() });
                    closeEdit();
                }}
            >
                <textarea
                    rows={3}
                    className={fieldClass}
                    placeholder="Street address"
                    value={draft.street_address}
                    onChange={(e) => setDraft({ ...draft, street_address: e.target.value })}
                />
            </EditModal>

            {/* Email */}
            <EditModal
                open={edit === 'email'}
                title="Edit email address"
                onClose={closeEdit}
                onSave={() => {
                    updateUser({ email: draft.email.trim() });
                    closeEdit();
                }}
            >
                <input
                    type="email"
                    required
                    className={fieldClass}
                    value={draft.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
            </EditModal>

            {/* Password */}
            <EditModal
                open={edit === 'password'}
                title="Change password"
                onClose={closeEdit}
                saveLabel="Update password"
                onSave={() => {
                    if ((draft.next || '').length < 8) {
                        setPasswordMsg('Password must be at least 8 characters.');
                        return;
                    }
                    if (draft.next !== draft.confirm) {
                        setPasswordMsg('New passwords do not match.');
                        return;
                    }
                    updateUser({ has_password: true, password_updated_at: Date.now() });
                    closeEdit();
                }}
            >
                {passwordMsg ? (
                    <p className="font-geist m-0 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[14px] text-rose-700">
                        {passwordMsg}
                    </p>
                ) : null}
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">
                        Current password
                    </span>
                    <input
                        type="password"
                        className={fieldClass}
                        value={draft.current}
                        onChange={(e) => setDraft({ ...draft, current: e.target.value })}
                    />
                </label>
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">New password</span>
                    <input
                        type="password"
                        required
                        minLength={8}
                        className={fieldClass}
                        value={draft.next}
                        onChange={(e) => setDraft({ ...draft, next: e.target.value })}
                    />
                </label>
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">
                        Confirm new password
                    </span>
                    <input
                        type="password"
                        required
                        minLength={8}
                        className={fieldClass}
                        value={draft.confirm}
                        onChange={(e) => setDraft({ ...draft, confirm: e.target.value })}
                    />
                </label>
            </EditModal>

            {/* Marketing */}
            <EditModal
                open={edit === 'marketing'}
                title="Marketing emails"
                onClose={closeEdit}
                onSave={() => {
                    updateUser({ marketing_emails: draft.marketing_emails });
                    closeEdit();
                }}
            >
                <label className="font-geist flex cursor-pointer items-center gap-3 text-[15px]">
                    <input
                        type="checkbox"
                        checked={!!draft.marketing_emails}
                        onChange={(e) =>
                            setDraft({ ...draft, marketing_emails: e.target.checked })
                        }
                        className="h-4 w-4 accent-[#5b0520]"
                    />
                    Receive marketing emails
                </label>
            </EditModal>

            {/* Booking notifications */}
            <EditModal
                open={edit === 'booking'}
                title="Booking notifications"
                onClose={closeEdit}
                onSave={() => {
                    updateUser({ booking_notifications: draft.booking_notifications });
                    closeEdit();
                }}
            >
                <select
                    className={fieldClass}
                    value={draft.booking_notifications}
                    onChange={(e) =>
                        setDraft({ ...draft, booking_notifications: e.target.value })
                    }
                >
                    <option value="email_sms">On (Email & SMS)</option>
                    <option value="email">On (Email)</option>
                    <option value="sms">On (SMS)</option>
                    <option value="off">Off</option>
                </select>
            </EditModal>

            {/* Language */}
            <EditModal
                open={edit === 'language'}
                title="Communication language"
                onClose={closeEdit}
                onSave={() => {
                    updateUser({ language: draft.language });
                    closeEdit();
                }}
            >
                <select
                    className={fieldClass}
                    value={draft.language}
                    onChange={(e) => setDraft({ ...draft, language: e.target.value })}
                >
                    {LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value}>
                            {l.label}
                        </option>
                    ))}
                </select>
            </EditModal>

            {/* Delete */}
            <EditModal
                open={edit === 'delete'}
                title="Delete account"
                onClose={closeEdit}
                saveLabel="Delete account"
                onSave={async () => {
                    await deleteAccount();
                    navigate('/', { replace: true });
                }}
            >
                <p className="font-geist m-0 text-[15px] leading-6 text-muted">
                    This permanently removes your local account data from this device. This action
                    cannot be undone.
                </p>
            </EditModal>

            <AddCardModal
                open={cardOpen}
                onClose={() => setCardOpen(false)}
                onSave={(card) =>
                    updateUser({
                        payment_methods: [...cards, card],
                    })
                }
            />
        </SiteLayout>
    );
}
