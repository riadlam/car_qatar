import { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select, { components as selectComponents } from 'react-select';

/** Same chevron as home BookingWidget */
const Chevron = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

/**
 * Same Field pattern as home BookingWidget — light theme colors.
 */
function Field({ id, label, children, endAdornment }) {
    return (
        <div className="relative flex min-w-0 flex-1 flex-col">
            <label
                htmlFor={id}
                className="font-geist mb-1 text-[14px] leading-5 font-400 tracking-[0.15px] text-ink-text/70"
            >
                {label}
            </label>
            <div className="relative flex items-center gap-2 border-b border-ink-text/25 pb-2 transition-[border-color] focus-within:border-b-2 focus-within:border-wine-700">
                {children}
                {endAdornment ? <span className="pointer-events-none shrink-0 text-ink-text/45">{endAdornment}</span> : null}
            </div>
        </div>
    );
}

const inputCls =
    'font-geist w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-ink-text outline-none placeholder:text-ink-text/35';

/** Underline react-select — sits inside the home-style Field */
const selectStyles = {
    control: (base) => ({
        ...base,
        minHeight: 28,
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        padding: 0,
        '&:hover': { border: 'none' },
    }),
    valueContainer: (base) => ({
        ...base,
        padding: 0,
        margin: 0,
    }),
    placeholder: (base) => ({
        ...base,
        color: 'rgba(15, 19, 25, 0.35)',
        fontFamily: 'inherit',
        fontSize: 16,
        margin: 0,
    }),
    singleValue: (base) => ({
        ...base,
        color: '#0f1319',
        fontFamily: 'inherit',
        fontSize: 16,
        margin: 0,
    }),
    input: (base) => ({
        ...base,
        color: '#0f1319',
        fontFamily: 'inherit',
        fontSize: 16,
        margin: 0,
        padding: 0,
    }),
    menu: (base) => ({
        ...base,
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: 40,
        marginTop: 10,
        boxShadow: '0 16px 40px rgba(15, 19, 25, 0.14)',
        border: '1px solid #e8e8ea',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 60 }),
    option: (base, state) => ({
        ...base,
        fontFamily: 'inherit',
        fontSize: 15,
        backgroundColor: state.isSelected
            ? '#5b0520'
            : state.isFocused
              ? 'rgba(91, 5, 32, 0.08)'
              : '#fff',
        color: state.isSelected ? '#fff' : '#0f1319',
        cursor: 'pointer',
        padding: '10px 14px',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: () => ({ display: 'none' }),
    clearIndicator: (base) => ({
        ...base,
        color: 'rgba(15, 19, 25, 0.4)',
        padding: 0,
        marginRight: 2,
    }),
};

function OptionWithArea(props) {
    const { data } = props;
    return (
        <selectComponents.Option {...props}>
            <div className="flex flex-col gap-0.5">
                <span className="font-geist text-[15px] leading-5 font-500">{data.label}</span>
                {data.area ? (
                    <span
                        className={`font-geist text-[12px] leading-4 ${
                            props.isSelected ? 'text-white/75' : 'text-ink-text/55'
                        }`}
                    >
                        {data.area}
                    </span>
                ) : null}
            </div>
        </selectComponents.Option>
    );
}

/**
 * Explore Qatar appointment scheduler.
 * Home-style fields + searchable destination dropdown (not native select).
 */
export default function DestinationScheduler({
    destinations = [],
    destinationLabel = 'Drop-off location',
    destinationPlaceholder = 'Choose a destination',
    pickupPlaceholder = 'Address, airport, hotel, ...',
    service = 'tourist_trip',
    title,
    subtitle,
    stacked = false,
}) {
    const navigate = useNavigate();
    const uid = useId();
    const [destination, setDestination] = useState(null);
    const [touched, setTouched] = useState(false);

    const options = useMemo(
        () =>
            destinations.map((d) => ({
                value: d.id,
                label: d.label,
                area: d.area,
            })),
        [destinations],
    );

    const onSubmit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (!destination) return;

        const fd = new FormData(e.currentTarget);
        const pickup = String(fd.get('pickup-location') || '').trim();
        const dropoff = destination.label;
        const time = String(fd.get('pickup-time') || '17:15');
        const date = String(fd.get('pickup-date') || '');

        const q = new URLSearchParams();
        if (pickup) q.set('pickup', pickup);
        if (dropoff) q.set('dropoff', dropoff);
        if (time) q.set('time', time);
        if (date) q.set('date', date);
        q.set('mode', 'transfer');
        q.set('service', service);
        navigate(`/booking?${q.toString()}`);
    };

    return (
        <div
            id="schedule"
            className="bl-glass-light scroll-mt-28 w-full overflow-hidden rounded-2xl border border-ink-text/10 p-5 shadow-[0_20px_50px_rgba(15,19,25,0.12)] sm:rounded-lg sm:p-6"
            role="search"
        >
            {(title || subtitle) && (
                <div className="mb-5 text-center sm:mb-6 sm:text-left">
                    {title ? (
                        <h2 className="font-fragment m-0 text-[22px] leading-7 font-400 tracking-[0.15px] text-ink-text sm:text-[28px] sm:leading-9">
                            {title}
                        </h2>
                    ) : null}
                    {subtitle ? (
                        <p className="font-geist mt-1 hidden text-[14px] leading-5 text-ink-text/70 sm:mt-1.5 sm:block sm:text-[15px] sm:leading-6">
                            {subtitle}
                        </p>
                    ) : null}
                </div>
            )}

            <form
                onSubmit={onSubmit}
                className={`flex w-full items-stretch ${
                    stacked
                        ? 'flex-col gap-5'
                        : 'flex-col gap-4 lg:min-h-[60px] lg:flex-row lg:items-center lg:gap-0'
                }`}
            >
                <div
                    className={`flex min-w-0 ${
                        stacked
                            ? 'flex-col gap-5'
                            : 'flex-col gap-4 sm:flex-row sm:gap-4 lg:w-[496px] lg:max-w-[42%] lg:gap-3'
                    }`}
                >
                    <Field id={`${uid}-pickup`} label="Pickup location">
                        <input
                            id={`${uid}-pickup`}
                            name="pickup-location"
                            className={inputCls}
                            placeholder={pickupPlaceholder}
                            autoComplete="off"
                            role="combobox"
                            aria-expanded="false"
                        />
                    </Field>

                    <Field id={`${uid}-destination`} label={destinationLabel} endAdornment={Chevron}>
                        <Select
                            inputId={`${uid}-destination`}
                            instanceId={`${uid}-dest-select`}
                            options={options}
                            value={destination}
                            onChange={(opt) => {
                                setDestination(opt);
                                setTouched(true);
                            }}
                            placeholder={destinationPlaceholder}
                            isClearable
                            isSearchable
                            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                            menuPosition="fixed"
                            styles={selectStyles}
                            components={{ Option: OptionWithArea }}
                            classNamePrefix="almajd-select"
                            className="w-full min-w-0"
                            aria-label={destinationLabel}
                            noOptionsMessage={() => 'No matches in Qatar'}
                        />
                    </Field>
                </div>

                {!stacked && (
                    <>
                        <hr
                            aria-orientation="vertical"
                            aria-hidden="true"
                            className="mx-4 hidden w-px self-stretch border-0 bg-ink-text/15 lg:block"
                        />
                        <hr aria-hidden="true" className="border-0 border-t border-ink-text/10 lg:hidden" />
                    </>
                )}

                <div
                    className={`flex min-w-0 ${
                        stacked
                            ? 'flex-col gap-5'
                            : 'flex-col gap-4 sm:flex-row sm:gap-3 lg:w-[439px] lg:max-w-[38%]'
                    }`}
                >
                    <Field id={`${uid}-date`} label="Date" endAdornment={Chevron}>
                        <input
                            id={`${uid}-date`}
                            name="pickup-date"
                            type="date"
                            required
                            className={`${inputCls} cursor-pointer [color-scheme:light]`}
                            aria-label="Select a date"
                            data-cy="date-picker-input"
                        />
                    </Field>
                    <Field id={`${uid}-time`} label="Pickup time" endAdornment={Chevron}>
                        <input
                            id={`${uid}-time`}
                            name="pickup-time"
                            type="time"
                            defaultValue="17:15"
                            required
                            className={`${inputCls} cursor-pointer [color-scheme:light]`}
                            aria-label="Pickup time"
                        />
                    </Field>
                </div>

                {!stacked && (
                    <>
                        <hr
                            aria-orientation="vertical"
                            aria-hidden="true"
                            className="mx-4 hidden w-px self-stretch border-0 bg-ink-text/15 lg:block"
                        />
                        <hr aria-hidden="true" className="border-0 border-t border-ink-text/10 lg:hidden" />
                    </>
                )}

                <div className={`flex w-full items-center ${stacked ? 'pt-1' : 'lg:w-auto lg:shrink-0 lg:pl-2'}`}>
                    <button
                        type="submit"
                        data-cy="search-button"
                        className="font-geist flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 py-3 text-[16px] leading-6 font-500 tracking-[0.15px] whitespace-nowrap text-white transition hover:bg-wine-600 lg:min-h-10 lg:min-w-[9.5rem] lg:py-2"
                    >
                        View options
                    </button>
                </div>
            </form>

            {touched && !destination ? (
                <p className="font-geist mt-3 m-0 text-[13px] text-wine-500">Please choose a destination.</p>
            ) : null}
        </div>
    );
}
