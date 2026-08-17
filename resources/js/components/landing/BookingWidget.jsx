import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import MapLocationModal from '../booking/MapLocationModal';
import {
    CITY_TOUR_HOUR_OPTIONS,
    GULF_DESTINATIONS,
    HOUR_OPTIONS,
    MAX_STOPS,
    PASSENGER_OPTIONS,
    SCHOOL_TERMS,
    SERVICE_TABS,
    STUDENT_OPTIONS,
    serviceMode,
} from '../../data/bookingServices';

const TABS = SERVICE_TABS;
const DEFAULT_TIME = '17:15';
const LOCATION_PLACEHOLDER = 'Address, airport, hotel, ...';

const Chevron = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const PinIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
    </svg>
);

function Field({ id, label, children, endAdornment }) {
    return (
        <div className="relative flex min-w-0 flex-1 flex-col">
            <label htmlFor={id} className="font-geist mb-1 text-[14px] leading-5 font-400 tracking-[0.15px] text-white/80">
                {label}
            </label>
            <div className="relative flex items-center gap-2 border-b border-white/80 pb-2 transition-[border-color] focus-within:border-b-2 focus-within:border-wine-500">
                {children}
                {endAdornment && <span className="shrink-0 text-white/70">{endAdornment}</span>}
            </div>
        </div>
    );
}

const inputCls =
    'font-geist w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-white outline-none placeholder:text-white/40';

/** Text field with a map picker — every location on the widget is map selectable */
function LocationField({ id, label, value, onChange, onPick }) {
    const [pickerOpen, setPickerOpen] = useState(false);

    return (
        <>
            <Field
                id={id}
                label={label}
                endAdornment={
                    <button
                        type="button"
                        onClick={() => setPickerOpen(true)}
                        aria-label={`Select ${label.toLowerCase()} on the map`}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                        {PinIcon}
                    </button>
                }
            >
                <input
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputCls}
                    placeholder={LOCATION_PLACEHOLDER}
                    autoComplete="off"
                    required
                />
            </Field>
            <MapLocationModal
                open={pickerOpen}
                label={label}
                initialValue={value}
                onClose={() => setPickerOpen(false)}
                onSelect={(loc) => {
                    onChange(loc.label);
                    onPick?.(loc);
                    setPickerOpen(false);
                }}
            />
        </>
    );
}

/**
 * Dropdown in the site's own style (same glass menu + wine active row as the nav),
 * portalled so the booking card's rounded clipping can't cut the list off.
 */
function SelectField({ id, label, value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState(null);
    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const selected = options.find((o) => o.value === value) || options[0];

    const position = useCallback(() => {
        const el = triggerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom - 16;
        const spaceAbove = rect.top - 16;
        const flip = spaceBelow < 200 && spaceAbove > spaceBelow;
        setMenuStyle({
            position: 'fixed',
            left: rect.left,
            width: Math.max(rect.width, 180),
            maxHeight: Math.max(180, Math.min(288, flip ? spaceAbove : spaceBelow)),
            ...(flip ? { bottom: window.innerHeight - rect.top + 10 } : { top: rect.bottom + 10 }),
        });
    }, []);

    useEffect(() => {
        if (!open) return undefined;

        position();

        const onPointerDown = (e) => {
            if (triggerRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
            setOpen(false);
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        window.addEventListener('resize', position);
        window.addEventListener('scroll', position, true);

        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', position);
            window.removeEventListener('scroll', position, true);
        };
    }, [open, position]);

    return (
        <Field
            id={id}
            label={label}
            endAdornment={
                <span className={`block transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>{Chevron}</span>
            }
        >
            <button
                ref={triggerRef}
                id={id}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="font-geist w-full min-w-0 cursor-pointer truncate border-0 bg-transparent p-0 text-left text-[16px] leading-6 font-400 tracking-[0.15px] text-white outline-none"
            >
                {selected?.label}
            </button>

            {typeof document !== 'undefined' &&
                createPortal(
                    <AnimatePresence>
                        {open && menuStyle && (
                            <motion.ul
                                ref={menuRef}
                                role="listbox"
                                aria-label={label}
                                style={menuStyle}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18 }}
                                className="nav-dd--dark z-[220] m-0 list-none overflow-y-auto rounded-lg p-2"
                            >
                                {options.map((o) => (
                                    <li key={o.value}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={o.value === value}
                                            onClick={() => {
                                                onChange(o.value);
                                                setOpen(false);
                                            }}
                                            className={`font-geist block w-full cursor-pointer rounded-md px-3 py-2.5 text-left text-[15px] leading-5 whitespace-nowrap transition ${
                                                o.value === value ? 'bg-wine-700 text-white' : 'text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {o.label}
                                        </button>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </Field>
    );
}

function BookingForm({ tab, stacked = false, onSearch }) {
    const uid = `${useId().replace(/:/g, '')}-${stacked ? 'm' : 'd'}`;

    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [legs, setLegs] = useState([
        { pickup: '', dropoff: '' },
        { pickup: '', dropoff: '' },
    ]);
    const [duration, setDuration] = useState('2');
    const [passengers, setPassengers] = useState('1');
    const [destination, setDestination] = useState(GULF_DESTINATIONS[0].value);
    const [schoolLocation, setSchoolLocation] = useState('');
    const [students, setStudents] = useState('1');
    const [term, setTerm] = useState(SCHOOL_TERMS[0].value);
    const [date, setDate] = useState('');
    const [time, setTime] = useState(DEFAULT_TIME);
    const [pickupCoords, setPickupCoords] = useState(null);

    const isMultiStops = tab === 'multi_stops';
    const isSchool = tab === 'school_chauffeured';
    const hasSchedule = !isSchool;

    const updateLeg = (index, key, value) =>
        setLegs((prev) => prev.map((leg, i) => (i === index ? { ...leg, [key]: value } : leg)));
    const addLeg = () =>
        setLegs((prev) => (prev.length >= MAX_STOPS ? prev : [...prev, { pickup: '', dropoff: '' }]));
    const removeLeg = (index) =>
        setLegs((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));

    const resolveDropoff = () => {
        if (isMultiStops) return legs[legs.length - 1]?.dropoff?.trim() || '';
        if (tab === 'arab_gulf_trips') return destination;
        if (isSchool) return schoolLocation.trim();
        if (tab === 'one_way') return dropoff.trim();
        return '';
    };

    const submit = (e) => {
        e.preventDefault();
        onSearch?.({
            tab,
            pickup: (isMultiStops ? legs[0]?.pickup || '' : pickup).trim(),
            dropoff: resolveDropoff(),
            legs: isMultiStops
                ? legs.map((leg) => ({ pickup: leg.pickup.trim(), dropoff: leg.dropoff.trim() }))
                : null,
            duration: tab === 'by_hour' || tab === 'city_tour' ? duration : null,
            passengers: tab === 'city_tour' || tab === 'arab_gulf_trips' ? passengers : null,
            students: isSchool ? students : null,
            term: isSchool ? term : null,
            date: hasSchedule ? date : '',
            time: hasSchedule ? time : '',
            pickupCoords,
        });
    };

    const dateField = (
        <Field id={`${uid}-date`} label="Pick up date" endAdornment={Chevron}>
            <input
                id={`${uid}-date`}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputCls} cursor-pointer [color-scheme:dark]`}
                aria-label="Select a date"
                data-cy="date-picker-input"
            />
        </Field>
    );

    const timeField = (
        <Field id={`${uid}-time`} label="Pick up time" endAdornment={Chevron}>
            <input
                id={`${uid}-time`}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`${inputCls} cursor-pointer [color-scheme:dark]`}
                aria-label="Pickup time"
            />
        </Field>
    );

    const pickupField = (
        <LocationField
            id={`${uid}-pickup`}
            label="Pick up location"
            value={pickup}
            onChange={setPickup}
            onPick={(loc) => setPickupCoords({ lat: loc.lat, lng: loc.lng })}
        />
    );

    const submitButton = (
        <div className={`flex w-full items-center ${stacked ? 'pt-1' : 'lg:w-auto lg:shrink-0 lg:pl-2'}`}>
            <button
                type="submit"
                data-cy="search-button"
                className="font-geist flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 py-3 text-[16px] leading-6 font-500 tracking-[0.15px] whitespace-nowrap text-white transition hover:bg-wine-600 lg:min-h-10 lg:min-w-[9.5rem] lg:py-2"
            >
                View options
            </button>
        </div>
    );

    const divider = !stacked && (
        <>
            <hr aria-orientation="vertical" aria-hidden="true" className="mx-4 hidden w-px self-stretch border-0 bg-white/25 lg:block" />
            <hr aria-hidden="true" className="border-0 border-t border-white/15 lg:hidden" />
        </>
    );

    if (isMultiStops) {
        return (
            <form onSubmit={submit} className="flex w-full flex-col gap-5">
                {legs.map((leg, index) => (
                    <div
                        // eslint-disable-next-line react/no-array-index-key -- rows are positional
                        key={`leg-${index}`}
                        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3"
                    >
                        <LocationField
                            id={`${uid}-leg-${index}-pickup`}
                            label={`Pick up location ${index + 1}`}
                            value={leg.pickup}
                            onChange={(v) => updateLeg(index, 'pickup', v)}
                            onPick={index === 0 ? (loc) => setPickupCoords({ lat: loc.lat, lng: loc.lng }) : undefined}
                        />
                        <LocationField
                            id={`${uid}-leg-${index}-dropoff`}
                            label={`Drop off location ${index + 1}`}
                            value={leg.dropoff}
                            onChange={(v) => updateLeg(index, 'dropoff', v)}
                        />
                        {legs.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeLeg(index)}
                                className="font-geist shrink-0 cursor-pointer self-start rounded-full border border-white/25 px-4 py-2 text-[14px] leading-5 font-500 text-white transition hover:bg-white/10 sm:self-end"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}

                {legs.length < MAX_STOPS && (
                    <button
                        type="button"
                        onClick={addLeg}
                        className="font-geist w-full cursor-pointer rounded-full border border-white/25 px-4 py-2.5 text-[15px] leading-5 font-500 text-white transition hover:bg-white/10 sm:w-auto sm:self-start"
                    >
                        Add stop
                    </button>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
                    {dateField}
                    {timeField}
                    {submitButton}
                </div>
            </form>
        );
    }

    const tripFields = (() => {
        if (tab === 'by_hour') {
            return [
                pickupField,
                <SelectField
                    key="duration"
                    id={`${uid}-duration`}
                    label="Duration"
                    value={duration}
                    onChange={setDuration}
                    options={HOUR_OPTIONS}
                />,
            ];
        }

        if (tab === 'city_tour') {
            return [
                pickupField,
                <SelectField
                    key="duration"
                    id={`${uid}-duration`}
                    label="Duration"
                    value={duration}
                    onChange={setDuration}
                    options={CITY_TOUR_HOUR_OPTIONS}
                />,
                <SelectField
                    key="passengers"
                    id={`${uid}-passengers`}
                    label="Number of passengers"
                    value={passengers}
                    onChange={setPassengers}
                    options={PASSENGER_OPTIONS}
                />,
            ];
        }

        if (tab === 'arab_gulf_trips') {
            return [
                pickupField,
                <SelectField
                    key="destination"
                    id={`${uid}-destination`}
                    label="Destination"
                    value={destination}
                    onChange={setDestination}
                    options={GULF_DESTINATIONS}
                />,
                <SelectField
                    key="passengers"
                    id={`${uid}-passengers`}
                    label="Number of passengers"
                    value={passengers}
                    onChange={setPassengers}
                    options={PASSENGER_OPTIONS}
                />,
            ];
        }

        if (isSchool) {
            return [
                pickupField,
                <LocationField
                    key="school"
                    id={`${uid}-school`}
                    label="School / university location"
                    value={schoolLocation}
                    onChange={setSchoolLocation}
                />,
                <SelectField
                    key="students"
                    id={`${uid}-students`}
                    label="Number of students"
                    value={students}
                    onChange={setStudents}
                    options={STUDENT_OPTIONS}
                />,
            ];
        }

        return [
            pickupField,
            <LocationField
                key="dropoff"
                id={`${uid}-dropoff`}
                label="Drop off location"
                value={dropoff}
                onChange={setDropoff}
            />,
        ];
    })();

    const wideTrip = tripFields.length > 2;

    return (
        <form
            onSubmit={submit}
            className={`flex w-full items-stretch ${
                stacked ? 'flex-col gap-5' : 'flex-col gap-4 lg:min-h-[60px] lg:flex-row lg:items-center lg:gap-0'
            }`}
        >
            <div
                className={`flex min-w-0 ${
                    stacked
                        ? 'flex-col gap-5'
                        : `flex-col gap-4 sm:flex-row sm:gap-4 lg:gap-3 ${
                              wideTrip ? 'lg:w-[640px] lg:max-w-[54%]' : 'lg:w-[496px] lg:max-w-[42%]'
                          }`
                }`}
            >
                {tripFields}
            </div>

            {divider}

            <div
                className={`flex min-w-0 ${
                    stacked ? 'flex-col gap-5' : 'flex-col gap-4 sm:flex-row sm:gap-3 lg:flex-1 lg:min-w-[240px]'
                }`}
            >
                {hasSchedule ? (
                    <>
                        {dateField}
                        {timeField}
                    </>
                ) : (
                    <SelectField
                        id={`${uid}-term`}
                        label="Duration"
                        value={term}
                        onChange={setTerm}
                        options={SCHOOL_TERMS}
                    />
                )}
            </div>

            {divider}

            {submitButton}
        </form>
    );
}

function TabPills({ tab, setTab, className = '' }) {
    return (
        <div
            role="radiogroup"
            aria-label="Trip type selection"
            className={`bl-glass-dark relative w-full max-w-full rounded-2xl border border-white/25 p-1.5 ${className}`}
        >
            <div className="-mx-0.5 flex gap-1 overflow-x-auto px-0.5 py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible [&::-webkit-scrollbar]:hidden">
                {TABS.map((t) => {
                    const active = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setTab(t.id)}
                            className={`font-geist shrink-0 rounded-full px-3 py-2.5 text-center text-[13px] leading-4 font-500 tracking-[0.15px] whitespace-nowrap transition sm:px-3.5 sm:text-[14px] sm:leading-5 lg:px-4 lg:text-[15px] ${
                                active ? 'bg-wine-700 text-white shadow-sm' : 'text-white hover:bg-white/10'
                            }`}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function BookingWidget({ variant = 'desktop' }) {
    const [tab, setTab] = useState('one_way');
    const navigate = useNavigate();
    const isMobile = variant === 'mobile';

    const goBooking = ({
        tab: selectedTab,
        pickup,
        dropoff,
        legs,
        duration,
        passengers,
        students,
        term,
        date,
        time,
        pickupCoords,
    }) => {
        const q = new URLSearchParams();
        const mode = serviceMode(selectedTab);
        if (pickup) q.set('pickup', pickup);
        if (dropoff) q.set('dropoff', dropoff);
        if (time) q.set('time', time);
        if (date) q.set('date', date);
        q.set('mode', mode);
        q.set('service', selectedTab);
        if (mode === 'hourly' && duration) q.set('duration', duration);
        if (passengers) q.set('passengers', passengers);
        if (students) q.set('students', students);
        if (term) q.set('term', term);
        legs?.forEach((leg) => {
            if (leg.pickup || leg.dropoff) q.append('legs', `${leg.pickup} > ${leg.dropoff}`);
        });
        if (pickupCoords) {
            q.set('lat', String(pickupCoords.lat));
            q.set('lng', String(pickupCoords.lng));
        }
        navigate(`/booking?${q.toString()}`);
    };

    if (isMobile) {
        return (
            <div data-cy="booking-widget" className="mx-auto flex w-full max-w-full flex-col items-center justify-center">
                {/* Sticky glass tabs — scrollable on narrow screens */}
                <div className="sticky top-[72px] z-30 mb-4 w-full py-2">
                    <TabPills tab={tab} setTab={setTab} />
                </div>

                {/* Glass booking card */}
                <div className="bl-glass-dark w-full overflow-hidden rounded-2xl border border-white/20 p-5" role="search">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <BookingForm tab={tab} stacked onSearch={goBooking} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div data-cy="booking-widget" className="mx-auto flex w-full max-w-full flex-col items-center justify-center">
            <div className="mb-6 w-full max-w-[1120px]">
                <TabPills tab={tab} setTab={setTab} />
            </div>

            <div className="bl-glass-dark w-full max-w-full overflow-hidden rounded-lg border border-white/15 p-6" role="search">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <BookingForm tab={tab} onSearch={goBooking} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
