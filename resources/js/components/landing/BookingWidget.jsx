import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import MapboxLocationField from '../booking/MapboxLocationField';
import {
    CITY_TOUR_HOUR_OPTIONS,
    HOUR_OPTIONS,
    MAX_STOPS,
    PASSENGER_OPTIONS,
    SCHOOL_TERMS,
    STUDENT_OPTIONS,
} from '../../data/bookingServices';
import { fetchGulfDestinations, fetchServiceTypes } from '../../api/catalog';
import { heroSearchScope } from '../../maps/searchScopes';
import {
    fallbackGulfDestinations,
    fallbackServiceTabs,
    mapGulfDestination,
    mapServiceType,
} from '../../utils/catalogMappers';
import { tripSelectionToSearchParams } from '../../utils/bookingMappers';

const DEFAULT_TIME = '17:15';

function hasCoords(coords) {
    return coords != null && Number.isFinite(Number(coords.lat)) && Number.isFinite(Number(coords.lng));
}

function placeFromPick(loc) {
    if (!hasCoords(loc)) return null;
    return { lat: Number(loc.lat), lng: Number(loc.lng) };
}

function todayLocal() {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}

function emptyLeg() {
    return { pickup: '', dropoff: '', pickupCoords: null, dropoffCoords: null };
}

const Chevron = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const BookingToneContext = createContext('dark');
const FieldDensityContext = createContext('regular');

function Field({ id, label, children, endAdornment, tone: toneProp }) {
    const contextTone = useContext(BookingToneContext);
    const compact = useContext(FieldDensityContext) === 'compact';
    const tone = toneProp || contextTone;
    const light = tone === 'light';
    return (
        <div className="relative flex min-w-0 flex-1 flex-col">
            <label
                htmlFor={id}
                className={`font-geist font-400 tracking-[0.15px] ${
                    compact ? 'mb-0.5 text-[11px] leading-4' : 'mb-1 text-[14px] leading-5'
                } ${light ? 'text-ink-text/70' : 'text-white/80'}`}
            >
                {label}
            </label>
            <div
                className={`relative flex items-center border-b transition-[border-color] focus-within:border-b-2 ${
                    compact ? 'gap-1.5 pb-1' : 'gap-2 pb-2'
                } ${
                    light
                        ? 'border-ink-text/25 focus-within:border-wine-700'
                        : 'border-white/80 focus-within:border-wine-500'
                }`}
            >
                {children}
                {endAdornment && (
                    <span className={`shrink-0 ${light ? 'text-ink-text/45' : 'text-white/70'}`}>{endAdornment}</span>
                )}
            </div>
        </div>
    );
}

function inputClass(tone = 'dark', compact = false) {
    return `font-geist w-full min-w-0 appearance-none border-0 bg-transparent p-0 font-400 tracking-[0.15px] outline-none ${
        compact ? 'text-[14px] leading-5' : 'text-[16px] leading-6'
    } ${tone === 'light' ? 'text-ink-text placeholder:text-ink-text/35' : 'text-white placeholder:text-white/40'}`;
}

/**
 * Dropdown in the site's own style (same glass menu + wine active row as the nav),
 * portalled so the booking card's rounded clipping can't cut the list off.
 */
function SelectField({ id, label, value, onChange, options, tone: toneProp }) {
    const contextTone = useContext(BookingToneContext);
    const compact = useContext(FieldDensityContext) === 'compact';
    const tone = toneProp || contextTone;
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
            tone={tone}
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
                className={`font-geist w-full min-w-0 cursor-pointer truncate border-0 bg-transparent p-0 text-left font-400 tracking-[0.15px] outline-none ${
                    compact ? 'text-[14px] leading-5' : 'text-[16px] leading-6'
                } ${tone === 'light' ? 'text-ink-text' : 'text-white'}`}
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
                                className={`${tone === 'light' ? 'nav-dd--light' : 'nav-dd--dark'} z-[220] m-0 list-none overflow-y-auto rounded-lg p-2`}
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
                                                o.value === value
                                                    ? 'bg-wine-700 text-white'
                                                    : tone === 'light'
                                                      ? 'text-ink-text hover:bg-page'
                                                      : 'text-white hover:bg-white/10'
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

export function BookingForm({
    tab,
    stacked = false,
    onSearch,
    gulfDestinations = fallbackGulfDestinations(),
    maxStops = MAX_STOPS,
    durationOptions = HOUR_OPTIONS,
    passengerOptions = PASSENGER_OPTIONS,
    studentOptions = STUDENT_OPTIONS,
    termOptions = SCHOOL_TERMS,
    tone = 'dark',
    initial = null,
    submitLabel = 'View options',
    layout = 'default',
    serviceOptions = null,
    onServiceChange = null,
}) {
    const uid = `${useId().replace(/:/g, '')}-${stacked ? 'm' : 'd'}`;
    const compact = layout === 'bar';
    const inputCls = inputClass(tone, compact);
    const scheme = tone === 'light' ? 'light' : 'dark';
    const fieldVariant = tone === 'light' ? 'light' : 'dark';

    const [pickup, setPickup] = useState(initial?.pickup || '');
    const [dropoff, setDropoff] = useState(initial?.dropoff || '');
    const [legs, setLegs] = useState(initial?.legs?.length ? initial.legs : [emptyLeg(), emptyLeg()]);
    const [error, setError] = useState('');
    const [duration, setDuration] = useState(initial?.duration || durationOptions[0]?.value || '2');
    const [passengers, setPassengers] = useState(initial?.passengers || passengerOptions[0]?.value || '1');
    const [destination, setDestination] = useState(
        initial?.destination || gulfDestinations[0]?.value || '',
    );
    const [schoolLocation, setSchoolLocation] = useState(initial?.schoolLocation || '');
    const [students, setStudents] = useState(initial?.students || studentOptions[0]?.value || '1');
    const [term, setTerm] = useState(initial?.term || termOptions[0]?.value || SCHOOL_TERMS[0].value);
    const [date, setDate] = useState(initial?.date || '');
    const [time, setTime] = useState(initial?.time || DEFAULT_TIME);
    const [pickupCoords, setPickupCoords] = useState(initial?.pickupCoords || null);
    const [dropoffCoords, setDropoffCoords] = useState(initial?.dropoffCoords || null);
    const [schoolCoords, setSchoolCoords] = useState(initial?.schoolCoords || null);

    useEffect(() => {
        if (!gulfDestinations.length) return;
        setDestination((prev) =>
            gulfDestinations.some((d) => d.value === prev)
                ? prev
                : gulfDestinations[0].value,
        );
    }, [gulfDestinations]);

    useEffect(() => {
        if (!durationOptions.length) return;
        setDuration((prev) =>
            durationOptions.some((o) => o.value === prev) ? prev : durationOptions[0].value,
        );
    }, [durationOptions]);

    useEffect(() => {
        if (!passengerOptions.length) return;
        setPassengers((prev) =>
            passengerOptions.some((o) => o.value === prev) ? prev : passengerOptions[0].value,
        );
    }, [passengerOptions]);

    useEffect(() => {
        if (!studentOptions.length) return;
        setStudents((prev) =>
            studentOptions.some((o) => o.value === prev) ? prev : studentOptions[0].value,
        );
    }, [studentOptions]);

    useEffect(() => {
        if (!termOptions.length) return;
        setTerm((prev) =>
            termOptions.some((o) => o.value === prev) ? prev : termOptions[0].value,
        );
    }, [termOptions]);

    const isMultiStops = tab === 'multi_stops';
    const isSchool = tab === 'school_chauffeured';
    const hasSchedule = !isSchool;

    const updateLeg = (index, key, value) =>
        setLegs((prev) =>
            prev.map((leg, i) => {
                if (i !== index) return leg;
                const next = { ...leg, [key]: value };
                if (key === 'pickup' || key === 'dropoff') next[`${key}Coords`] = null;
                return next;
            }),
        );
    const setLegCoords = (index, key, coords) =>
        setLegs((prev) => prev.map((leg, i) => (i === index ? { ...leg, [key]: coords } : leg)));
    const addLeg = () =>
        setLegs((prev) => (prev.length >= maxStops ? prev : [...prev, emptyLeg()]));
    const removeLeg = (index) =>
        setLegs((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));

    const gulfOption = gulfDestinations.find((d) => d.value === destination || d.slug === destination);

    const missingMessage = () => {
        const needsSchedule = () => {
            if (!date) return 'Choose a pick-up date.';
            if (date < todayLocal()) return 'Choose a pick-up date that is today or later.';
            if (!time) return 'Choose a pick-up time.';
            return '';
        };

        if (isMultiStops) {
            if (!legs.length) return 'Add at least one stop.';
            for (let i = 0; i < legs.length; i += 1) {
                if (!hasCoords(legs[i].pickupCoords)) {
                    return `Choose pick-up ${i + 1} from the suggestions.`;
                }
                if (!hasCoords(legs[i].dropoffCoords)) {
                    return `Choose drop-off ${i + 1} from the suggestions.`;
                }
            }
            return needsSchedule();
        }

        if (!hasCoords(pickupCoords)) return 'Choose a pick-up location from the suggestions.';

        if (tab === 'by_hour') {
            if (!duration) return 'Choose a duration.';
            return needsSchedule();
        }

        if (tab === 'city_tour') {
            if (!duration) return 'Choose a duration.';
            if (!passengers) return 'Choose the number of passengers.';
            return needsSchedule();
        }

        if (tab === 'arab_gulf_trips') {
            if (!gulfOption?.slug && !gulfOption?.value) return 'Choose a destination.';
            if (!hasCoords(gulfOption)) return 'This destination has no map location yet.';
            if (!passengers) return 'Choose the number of passengers.';
            return needsSchedule();
        }

        if (isSchool) {
            if (!hasCoords(schoolCoords)) return 'Choose a school location from the suggestions.';
            if (!students) return 'Choose the number of students.';
            if (!term) return 'Choose a school term.';
            return '';
        }

        if (!hasCoords(dropoffCoords)) return 'Choose a drop-off location from the suggestions.';
        return needsSchedule();
    };

    const submit = (e) => {
        e.preventDefault();
        const message = missingMessage();
        if (message) {
            setError(message);
            return;
        }
        setError('');

        const gulfSlug = gulfOption?.slug || gulfOption?.value || '';
        onSearch?.({
            tab,
            pickup: (isMultiStops ? legs[0]?.pickup || '' : pickup).trim(),
            dropoff: isMultiStops
                ? legs[legs.length - 1]?.dropoff?.trim() || ''
                : tab === 'arab_gulf_trips'
                  ? gulfOption?.label || ''
                  : isSchool
                    ? schoolLocation.trim()
                    : tab === 'one_way'
                      ? dropoff.trim()
                      : '',
            legs: isMultiStops
                ? legs.map((leg) => ({
                      pickup: leg.pickup.trim(),
                      dropoff: leg.dropoff.trim(),
                      pickupCoords: leg.pickupCoords,
                      dropoffCoords: leg.dropoffCoords,
                  }))
                : null,
            duration: tab === 'by_hour' || tab === 'city_tour' ? duration : null,
            passengers: tab === 'city_tour' || tab === 'arab_gulf_trips' ? passengers : null,
            students: isSchool ? students : null,
            term: isSchool ? term : null,
            gulf: tab === 'arab_gulf_trips' ? gulfSlug : null,
            date: hasSchedule ? date : '',
            time: hasSchedule ? time : '',
            pickupCoords: isMultiStops ? legs[0]?.pickupCoords : pickupCoords,
            dropoffCoords: isMultiStops
                ? legs[legs.length - 1]?.dropoffCoords
                : tab === 'arab_gulf_trips'
                  ? { lat: Number(gulfOption.lat), lng: Number(gulfOption.lng) }
                  : isSchool
                    ? schoolCoords
                    : tab === 'one_way'
                      ? dropoffCoords
                      : null,
        });
    };

    const dateField = (
        <Field id={`${uid}-date`} label="Pick up date" endAdornment={Chevron}>
            <input
                id={`${uid}-date`}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputCls} cursor-pointer`}
                style={{ colorScheme: scheme }}
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
                className={`${inputCls} cursor-pointer`}
                style={{ colorScheme: scheme }}
                aria-label="Pickup time"
            />
        </Field>
    );

    const locationScope = heroSearchScope(tab === 'arab_gulf_trips' ? 'gulf' : 'qatar');
    const schoolScope = heroSearchScope('school');

    const pickupField = (
        <MapboxLocationField
            id={`${uid}-pickup`}
            label="Pick up location"
            value={pickup}
            coords={pickupCoords}
            onChange={(v) => {
                setPickup(v);
                setPickupCoords(null);
            }}
            searchScope={locationScope}
            onPick={(loc) => setPickupCoords(placeFromPick(loc))}
            variant={fieldVariant}
            density={compact ? 'compact' : 'regular'}
        />
    );

    const submitButton = (
        <div className={`flex w-full items-center ${stacked ? 'pt-1' : 'lg:w-auto lg:shrink-0 lg:pl-2'}`}>
            <button
                type="submit"
                data-cy="search-button"
                className="font-geist flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 py-3 text-[16px] leading-6 font-500 tracking-[0.15px] whitespace-nowrap text-white transition hover:bg-wine-600 lg:min-h-10 lg:min-w-[9.5rem] lg:py-2"
            >
                {submitLabel}
            </button>
        </div>
    );

    const formError = error ? (
        <p className={`font-geist m-0 text-[13px] leading-5 ${tone === 'light' ? 'text-wine-700' : 'text-rose-200'}`} role="alert">
            {error}
        </p>
    ) : null;

    const divider = !stacked && (
        <>
            <hr aria-orientation="vertical" aria-hidden="true" className={`mx-4 hidden w-px self-stretch border-0 lg:block ${tone === 'light' ? 'bg-ink-text/15' : 'bg-white/25'}`} />
            <hr aria-hidden="true" className={`border-0 border-t lg:hidden ${tone === 'light' ? 'border-ink-text/10' : 'border-white/15'}`} />
        </>
    );

    if (isMultiStops && layout !== 'bar') {
        return (
            <BookingToneContext.Provider value={tone}>
            <form onSubmit={submit} className="flex w-full flex-col gap-5">
                {legs.map((leg, index) => (
                    <div
                        // eslint-disable-next-line react/no-array-index-key -- rows are positional
                        key={`leg-${index}`}
                        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3"
                    >
                        <MapboxLocationField
                            id={`${uid}-leg-${index}-pickup`}
                            label={`Pick up location ${index + 1}`}
                            value={leg.pickup}
                            coords={leg.pickupCoords}
                            onChange={(v) => updateLeg(index, 'pickup', v)}
                            onPick={(loc) => setLegCoords(index, 'pickupCoords', placeFromPick(loc))}
                            searchScope={locationScope}
                            variant={fieldVariant}
                            density={compact ? 'compact' : 'regular'}
                        />
                        <MapboxLocationField
                            id={`${uid}-leg-${index}-dropoff`}
                            label={`Drop off location ${index + 1}`}
                            value={leg.dropoff}
                            coords={leg.dropoffCoords}
                            onChange={(v) => updateLeg(index, 'dropoff', v)}
                            onPick={(loc) => setLegCoords(index, 'dropoffCoords', placeFromPick(loc))}
                            searchScope={locationScope}
                            variant={fieldVariant}
                            density={compact ? 'compact' : 'regular'}
                        />
                        {legs.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeLeg(index)}
                                className={`font-geist shrink-0 cursor-pointer self-start rounded-full border px-4 py-2 text-[14px] leading-5 font-500 transition sm:self-end ${
                                    tone === 'light'
                                        ? 'border-ink-text/20 text-ink-text hover:bg-page'
                                        : 'border-white/25 text-white hover:bg-white/10'
                                }`}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}

                {legs.length < maxStops && (
                    <button
                        type="button"
                        onClick={addLeg}
                        className={`font-geist w-full cursor-pointer rounded-full border px-4 py-2.5 text-[15px] leading-5 font-500 transition sm:w-auto sm:self-start ${
                            tone === 'light'
                                ? 'border-ink-text/20 text-ink-text hover:bg-page'
                                : 'border-white/25 text-white hover:bg-white/10'
                        }`}
                    >
                        Add stop
                    </button>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
                    {dateField}
                    {timeField}
                    {submitButton}
                </div>
                {formError}
            </form>
            </BookingToneContext.Provider>
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
                    options={durationOptions.length ? durationOptions : HOUR_OPTIONS}
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
                    options={durationOptions.length ? durationOptions : CITY_TOUR_HOUR_OPTIONS}
                />,
                <SelectField
                    key="passengers"
                    id={`${uid}-passengers`}
                    label="Number of passengers"
                    value={passengers}
                    onChange={setPassengers}
                    options={passengerOptions.length ? passengerOptions : PASSENGER_OPTIONS}
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
                    options={gulfDestinations}
                />,
                <SelectField
                    key="passengers"
                    id={`${uid}-passengers`}
                    label="Number of passengers"
                    value={passengers}
                    onChange={setPassengers}
                    options={passengerOptions.length ? passengerOptions : PASSENGER_OPTIONS}
                />,
            ];
        }

        if (isSchool) {
            return [
                pickupField,
                <MapboxLocationField
                    key="school"
                    id={`${uid}-school`}
                    label="School / university location"
                    value={schoolLocation}
                    coords={schoolCoords}
                    onChange={(v) => {
                        setSchoolLocation(v);
                        setSchoolCoords(null);
                    }}
                    onPick={(loc) => setSchoolCoords(placeFromPick(loc))}
                    searchScope={schoolScope}
                    variant={fieldVariant}
                    density={compact ? 'compact' : 'regular'}
                />,
                <SelectField
                    key="students"
                    id={`${uid}-students`}
                    label="Number of students"
                    value={students}
                    onChange={setStudents}
                    options={studentOptions.length ? studentOptions : STUDENT_OPTIONS}
                />,
            ];
        }

        return [
            pickupField,
            <MapboxLocationField
                key="dropoff"
                id={`${uid}-dropoff`}
                label="Drop off location"
                value={dropoff}
                coords={dropoffCoords}
                onChange={(v) => {
                    setDropoff(v);
                    setDropoffCoords(null);
                }}
                onPick={(loc) => setDropoffCoords(placeFromPick(loc))}
                searchScope={locationScope}
                variant={fieldVariant}
                density={compact ? 'compact' : 'regular'}
            />,
        ];
    })();

    const wideTrip = tripFields.length > 2;

    if (layout === 'bar') {
        const slot = 'flex w-full min-w-0 sm:w-[calc(50%-0.5rem)] sm:max-w-[18rem] sm:flex-1';
        const barFields = isMultiStops
            ? legs.flatMap((leg, index) => {
                  const row = [
                      <div key={`bar-leg-${index}-pickup`} className={slot}>
                          <MapboxLocationField
                              id={`${uid}-leg-${index}-pickup`}
                              label={`Pick up ${index + 1}`}
                              value={leg.pickup}
                              coords={leg.pickupCoords}
                              onChange={(v) => updateLeg(index, 'pickup', v)}
                              onPick={(loc) => setLegCoords(index, 'pickupCoords', placeFromPick(loc))}
                              searchScope={locationScope}
                              variant={fieldVariant}
                              density="compact"
                          />
                      </div>,
                      <div key={`bar-leg-${index}-dropoff`} className={slot}>
                          <MapboxLocationField
                              id={`${uid}-leg-${index}-dropoff`}
                              label={`Drop off ${index + 1}`}
                              value={leg.dropoff}
                              coords={leg.dropoffCoords}
                              onChange={(v) => updateLeg(index, 'dropoff', v)}
                              onPick={(loc) => setLegCoords(index, 'dropoffCoords', placeFromPick(loc))}
                              searchScope={locationScope}
                              variant={fieldVariant}
                              density="compact"
                          />
                      </div>,
                  ];
                  if (legs.length > 1) {
                      row.push(
                          <button
                              key={`bar-leg-${index}-remove`}
                              type="button"
                              onClick={() => removeLeg(index)}
                              className="font-geist mb-1 shrink-0 cursor-pointer self-end rounded-full border border-ink-text/20 px-3 py-1.5 text-[12px] font-500 text-ink-text"
                          >
                              Remove
                          </button>,
                      );
                  }
                  return row;
              })
            : tripFields.map((field, index) => (
                  <div key={field.key || `bar-field-${index}`} className={slot}>
                      {field}
                  </div>
              ));

        return (
            <BookingToneContext.Provider value={tone}>
                <FieldDensityContext.Provider value="compact">
                    <form
                        onSubmit={submit}
                        className="mx-auto flex w-full max-w-5xl flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center sm:gap-3"
                    >
                        {serviceOptions?.length ? (
                            <div className="flex w-full min-w-0 sm:w-[9.5rem] sm:max-w-[12rem] sm:flex-1">
                                <SelectField
                                    id={`${uid}-service`}
                                    label="Service"
                                    value={tab}
                                    onChange={onServiceChange}
                                    options={serviceOptions}
                                />
                            </div>
                        ) : null}
                        {barFields}
                        {isMultiStops && legs.length < maxStops ? (
                            <button
                                type="button"
                                onClick={addLeg}
                                className="font-geist mb-1 shrink-0 cursor-pointer self-end rounded-full border border-ink-text/20 px-3 py-1.5 text-[12px] font-500 text-ink-text"
                            >
                                Add stop
                            </button>
                        ) : null}
                        {hasSchedule ? (
                            <>
                                <div className="flex w-full min-w-0 sm:w-[9.5rem] sm:max-w-[12rem] sm:flex-1">{dateField}</div>
                                <div className="flex w-full min-w-0 sm:w-[8.5rem] sm:max-w-[10rem] sm:flex-1">{timeField}</div>
                            </>
                        ) : (
                            <div className="flex w-full min-w-0 sm:w-[9.5rem] sm:max-w-[12rem] sm:flex-1">
                                <SelectField
                                    id={`${uid}-term`}
                                    label="Duration"
                                    value={term}
                                    onChange={setTerm}
                                    options={termOptions.length ? termOptions : SCHOOL_TERMS}
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="font-geist flex h-11 w-full shrink-0 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 text-[14px] font-500 whitespace-nowrap text-white transition hover:bg-wine-600 sm:mb-0.5 sm:h-9 sm:w-auto"
                        >
                            {submitLabel}
                        </button>
                        {error ? (
                            <p className="font-geist m-0 w-full text-[12px] leading-4 text-wine-700" role="alert">
                                {error}
                            </p>
                        ) : null}
                    </form>
                </FieldDensityContext.Provider>
            </BookingToneContext.Provider>
        );
    }

    return (
        <BookingToneContext.Provider value={tone}>
        <form
            onSubmit={submit}
            className={`flex w-full items-stretch ${
                stacked
                    ? 'flex-col gap-5'
                    : 'flex-col gap-4 lg:min-h-[60px] lg:flex-row lg:flex-wrap lg:items-center lg:gap-0'
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
                        options={termOptions.length ? termOptions : SCHOOL_TERMS}
                    />
                )}
            </div>

            {divider}

            {submitButton}
            {formError ? <div className="w-full pt-3">{formError}</div> : null}
        </form>
        </BookingToneContext.Provider>
    );
}

export function TabPills({ tab, setTab, tabs, className = '', tone = 'dark' }) {
    const light = tone === 'light';
    return (
        <div
            role="radiogroup"
            aria-label="Trip type selection"
            className={`relative w-full max-w-full rounded-2xl border p-1.5 ${
                light ? 'border-ink-text/15 bg-page' : 'bl-glass-dark border-white/25'
            } ${className}`}
        >
            <div className="-mx-0.5 flex gap-1 overflow-x-auto px-0.5 py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible [&::-webkit-scrollbar]:hidden">
                {tabs.map((t) => {
                    const active = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setTab(t.id)}
                            className={`font-geist shrink-0 rounded-full px-3 py-2.5 text-center text-[13px] leading-4 font-500 tracking-[0.15px] whitespace-nowrap transition sm:px-3.5 sm:text-[14px] sm:leading-5 lg:px-4 lg:text-[15px] ${
                                active
                                    ? 'bg-wine-700 text-white shadow-sm'
                                    : light
                                      ? 'text-ink-text hover:bg-white'
                                      : 'text-white hover:bg-white/10'
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
    const [searchParams] = useSearchParams();
    const requestedService = searchParams.get('service');
    const [tab, setTab] = useState('one_way');
    const [serviceTabs, setServiceTabs] = useState(() => fallbackServiceTabs());
    const [gulfDestinations, setGulfDestinations] = useState(() => fallbackGulfDestinations());
    const navigate = useNavigate();
    const isMobile = variant === 'mobile';

    useEffect(() => {
        let cancelled = false;
        Promise.all([fetchServiceTypes(), fetchGulfDestinations()])
            .then(([types, destinations]) => {
                if (cancelled) return;
                const mappedTabs = (Array.isArray(types) ? types : []).map(mapServiceType);
                if (mappedTabs.length) {
                    setServiceTabs(mappedTabs);
                    setTab((prev) => {
                        if (requestedService && mappedTabs.some((t) => t.id === requestedService)) {
                            return requestedService;
                        }
                        return mappedTabs.some((t) => t.id === prev) ? prev : mappedTabs[0].id;
                    });
                }
                const mappedGulf = (Array.isArray(destinations) ? destinations : []).map(
                    mapGulfDestination,
                );
                if (mappedGulf.length) setGulfDestinations(mappedGulf);
            })
            .catch(() => {
                if (cancelled) return;
                setServiceTabs(fallbackServiceTabs());
                setGulfDestinations(fallbackGulfDestinations());
            });
        return () => {
            cancelled = true;
        };
    }, [requestedService]);

    useEffect(() => {
        if (!requestedService) return;
        setTab((prev) => (serviceTabs.some((t) => t.id === requestedService) ? requestedService : prev));
    }, [requestedService, serviceTabs]);

    const maxStops = useMemo(() => {
        const multi = serviceTabs.find((t) => t.id === 'multi_stops');
        return multi?.max_stops || MAX_STOPS;
    }, [serviceTabs]);

    const activeService = useMemo(
        () => serviceTabs.find((t) => t.id === tab) || null,
        [serviceTabs, tab],
    );

    const formDurationOptions = useMemo(() => {
        if (activeService?.duration_options?.length) return activeService.duration_options;
        if (tab === 'city_tour') return CITY_TOUR_HOUR_OPTIONS;
        return HOUR_OPTIONS;
    }, [activeService, tab]);

    const formPassengerOptions = useMemo(
        () =>
            activeService?.passenger_options?.length
                ? activeService.passenger_options
                : PASSENGER_OPTIONS,
        [activeService],
    );

    const formStudentOptions = useMemo(
        () =>
            activeService?.student_options?.length
                ? activeService.student_options
                : STUDENT_OPTIONS,
        [activeService],
    );

    const formTermOptions = useMemo(
        () =>
            activeService?.term_options?.length
                ? activeService.term_options
                : SCHOOL_TERMS,
        [activeService],
    );

    const goBooking = ({
        tab: selectedTab,
        pickup,
        dropoff,
        legs,
        duration,
        passengers,
        students,
        term,
        gulf,
        date,
        time,
        pickupCoords,
        dropoffCoords,
    }) => {
        const mode = serviceTabs.find((t) => t.id === selectedTab)?.mode || 'transfer';
        const q = tripSelectionToSearchParams(
            {
                tab: selectedTab,
                pickup,
                dropoff,
                legs,
                duration,
                passengers,
                students,
                term,
                gulf,
                date,
                time,
                pickupCoords,
                dropoffCoords,
            },
            mode,
        );
        navigate(`/booking?${q.toString()}`);
    };

    if (isMobile) {
        return (
            <div data-cy="booking-widget" className="mx-auto flex w-full max-w-full flex-col items-center justify-center">
                {/* Sticky glass tabs — scrollable on narrow screens */}
                <div className="sticky top-[72px] z-30 mb-4 w-full py-2">
                    <TabPills tab={tab} setTab={setTab} tabs={serviceTabs} />
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
                            <BookingForm
                                tab={tab}
                                stacked
                                onSearch={goBooking}
                                gulfDestinations={gulfDestinations}
                                maxStops={maxStops}
                                durationOptions={formDurationOptions}
                                passengerOptions={formPassengerOptions}
                                studentOptions={formStudentOptions}
                                termOptions={formTermOptions}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div data-cy="booking-widget" className="mx-auto flex w-full max-w-full flex-col items-center justify-center">
            <div className="mb-6 w-full max-w-[1120px]">
                <TabPills tab={tab} setTab={setTab} tabs={serviceTabs} />
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
                        <BookingForm
                            tab={tab}
                            onSearch={goBooking}
                            gulfDestinations={gulfDestinations}
                            maxStops={maxStops}
                            durationOptions={formDurationOptions}
                            passengerOptions={formPassengerOptions}
                            studentOptions={formStudentOptions}
                            termOptions={formTermOptions}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
