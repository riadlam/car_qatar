import { useTranslation } from 'react-i18next';

const MALE_ICON = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
        <path
            d="M4.5 19.5c.8-3.2 2.9-5 5.5-5s4.7 1.8 5.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <path d="M14.5 4.5 19 9M19 4.5v4.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FEMALE_ICON = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
        <path
            d="M6.5 19.5c.8-3.2 2.9-5 5.5-5s4.7 1.8 5.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <path d="M12 14.5v5M9.75 17h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

/**
 * Required male / female chauffeur preference — two large selectable panels.
 */
export default function ChauffeurGenderPicker({ value, onChange, error = '', name = 'preferred-chauffeur-gender' }) {
    const { t } = useTranslation('booking');
    const options = [
        {
            id: 'male',
            label: t('page.male'),
            hint: t('chauffeur.maleHint'),
            icon: MALE_ICON,
        },
        {
            id: 'female',
            label: t('page.female'),
            hint: t('chauffeur.femaleHint'),
            icon: FEMALE_ICON,
        },
    ];

    return (
        <div>
            <p className="font-geist m-0 text-[14px] text-muted">
                {t('checkout.pickupPrefs.chauffeurPreference')} <span className="text-wine-700">*</span>
            </p>
            <p className="font-geist mt-1 m-0 text-[13px] leading-5 text-muted">
                {t('chauffeur.onlyGender')}
            </p>
            <div
                role="radiogroup"
                aria-label={t('chauffeur.aria')}
                aria-required="true"
                className="mt-3 grid gap-3 sm:grid-cols-2"
            >
                {options.map((opt) => {
                    const on = value === opt.id;
                    return (
                        <label
                            key={opt.id}
                            className={`group relative flex cursor-pointer flex-col gap-2 overflow-hidden rounded-2xl border px-4 py-4 transition-all duration-300 ease-out ${
                                on
                                    ? 'scale-[1.02] border-wine-700 bg-wine-50 text-wine-800 shadow-[0_0_0_1px_#5b0520,0_12px_28px_-16px_rgba(91,5,32,0.55)]'
                                    : 'scale-100 border-[#e0ddd6] bg-white text-ink-text hover:border-[#c9c5bc] hover:shadow-sm'
                            }`}
                        >
                            <input
                                type="radio"
                                name={name}
                                className="sr-only"
                                value={opt.id}
                                checked={on}
                                onChange={() => onChange(opt.id)}
                            />
                            <span
                                className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
                                    on
                                        ? 'bg-wine-700 text-white'
                                        : 'bg-page text-wine-700 group-hover:bg-wine-50'
                                }`}
                            >
                                {opt.icon}
                            </span>
                            <span className="font-fragment text-[18px] leading-6 font-400 tracking-[0.2px]">
                                {opt.label}
                            </span>
                            <span className={`font-geist text-[13px] leading-5 ${on ? 'text-wine-800/80' : 'text-muted'}`}>
                                {opt.hint}
                            </span>
                            <span
                                className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-wine-700 transition-transform duration-300 ${
                                    on ? 'scale-x-100' : 'scale-x-0'
                                }`}
                                aria-hidden="true"
                            />
                        </label>
                    );
                })}
            </div>
            {error ? (
                <p className="font-geist mt-2 m-0 text-[13px] text-rose-700" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function chauffeurGenderLabel(value, t) {
    if (value === 'male') return t('page.male');
    if (value === 'female') return t('page.female');
    return null;
}
