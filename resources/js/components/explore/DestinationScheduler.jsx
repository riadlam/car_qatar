import { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forwardGeocodeClient } from '../../maps/useMapboxSearch';
import Select, { components as selectComponents } from 'react-select';
import MapboxLocationField from '../booking/MapboxLocationField';

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
 * Supports controlled destination for card → picker fill.
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
    selectedDestination = undefined,
    onDestinationChange,
}) {
    const navigate = useNavigate();
    const uid = useId();
    const [internalDestination, setInternalDestination] = useState(null);
    const [pickup, setPickup] = useState('');
    const [pickupCoords, setPickupCoords] = useState(null);
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isControlled = selectedDestination !== undefined;
    const destination = isControlled ? selectedDestination : internalDestination;

    const setDestination = (opt) => {
        if (isControlled) {
            onDestinationChange?.(opt);
        } else {
            setInternalDestination(opt);
        }
    };

    const options = useMemo(
        () =>
            destinations.map((d) => ({
                value: d.id,
                label: d.label,
                area: d.area,
                lat: d.lat ?? null,
                lng: d.lng ?? null,
            })),
        [destinations],
    );

    // Keep controlled value in sync with options (e.g. after API load)
    const selectValue = useMemo(() => {
        if (!destination) return null;
        const match = options.find((o) => o.value === destination.value || o.label === destination.label);
        return match
            ? { ...match, ...destination, lat: destination.lat ?? match.lat, lng: destination.lng ?? match.lng }
            : destination;
    }, [destination, options]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setTouched(true);

        const fd = new FormData(e.currentTarget);
        const time = String(fd.get('pickup-time') || '');
        const date = String(fd.get('pickup-date') || '');
        const pickupLabel = pickup.trim();
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        if (pickupCoords?.lat == null || pickupCoords?.lng == null) {
            setError('Choose a pickup location from the suggestions.');
            return;
        }
        if (!selectValue) {
            setError('Please choose a destination.');
            return;
        }
        if (!date) {
            setError('Choose a date.');
            return;
        }
        if (date < todayKey) {
            setError('Choose a date that is today or later.');
            return;
        }
        if (!time) {
            setError('Choose a pickup time.');
            return;
        }

        let dropLat = selectValue.lat;
        let dropLng = selectValue.lng;
        if (dropLat == null || dropLng == null) {
            setSubmitting(true);
            setError('');
            try {
                const place = await forwardGeocodeClient(
                    [selectValue.label, selectValue.area].filter(Boolean).join(', ') + ', Qatar',
                    'qatar',
                );
                dropLat = place?.lat;
                dropLng = place?.lng;
            } catch {
                dropLat = null;
                dropLng = null;
            }
            setSubmitting(false);
        }
        if (dropLat == null || dropLng == null) {
            setError('This destination has no map location yet.');
            return;
        }

        setError('');
        const dropoff = selectValue.label;
        const q = new URLSearchParams();
        q.set('pickup', pickupLabel);
        q.set('dropoff', dropoff);
        q.set('time', time);
        q.set('date', date);
        q.set('lat', String(pickupCoords.lat));
        q.set('lng', String(pickupCoords.lng));
        q.set('drop_lat', String(dropLat));
        q.set('drop_lng', String(dropLng));
        q.set('mode', 'transfer');
        q.set('service', service === 'tourist_trip' ? 'one_way' : service || 'one_way');
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
                    <MapboxLocationField
                        id={`${uid}-pickup`}
                        name="pickup-location"
                        label="Pickup location"
                        value={pickup}
                        coords={pickupCoords}
                        onChange={(v) => {
                            setPickup(v);
                            setPickupCoords(null);
                        }}
                        onPick={(loc) => setPickupCoords({ lat: loc.lat, lng: loc.lng })}
                        searchScope="qatar"
                        variant="light"
                        required
                    />

                    <Field id={`${uid}-destination`} label={destinationLabel} endAdornment={Chevron}>
                        <Select
                            inputId={`${uid}-destination`}
                            instanceId={`${uid}-dest-select`}
                            options={options}
                            value={selectValue}
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
                        disabled={submitting}
                        className="font-geist flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 py-3 text-[16px] leading-6 font-500 tracking-[0.15px] whitespace-nowrap text-white transition hover:bg-wine-600 disabled:cursor-wait disabled:opacity-70 lg:min-h-10 lg:min-w-[9.5rem] lg:py-2"
                    >
                        {submitting ? 'Finding destination…' : 'View options'}
                    </button>
                </div>
            </form>

            {error || (touched && !selectValue) ? (
                <p className="font-geist mt-3 m-0 text-[13px] text-wine-500" role="alert">
                    {error || 'Please choose a destination.'}
                </p>
            ) : null}
        </div>
    );
}
