/** Shared booking icons — fills use wine accent instead of Blacklane blue. */
export const ICON_ACCENT = '#b8446b';

export function IconPassengers({ className = 'h-6 w-6' }) {
    return (
        <svg
            width="1.5em"
            height="1.5em"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden="true"
        >
            <path d="M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20" stroke="currentColor" strokeLinecap="round" />
            <path d="M13 14V14C13 11.2386 15.2386 9 18 9V9C20.7614 9 23 11.2386 23 14V14.5" stroke="currentColor" strokeLinecap="round" />
            <path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconLuggage({ className = 'h-6 w-6' }) {
    return (
        <svg
            width="1.5em"
            height="1.5em"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M19.2609 9.69589L20.6455 18.6959C20.8319 19.9074 19.8945 21 18.6688 21H5.33122C4.10545 21 3.16809 19.9074 3.35448 18.6959L4.73909 9.69589C4.8892 8.72022 5.7287 8 6.71584 8H17.2842C18.2713 8 19.1108 8.72022 19.2609 9.69589Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M9 11L9 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 11L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconPerson({ className = 'h-6 w-6' }) {
    return (
        <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M5 20V19C5 15.134 8.13401 12 12 12V12C15.866 12 19 15.134 19 19V20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconChevronLeft() {
    return (
        <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconChevronRight() {
    return (
        <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconChevronDown() {
    return (
        <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconArrowDown() {
    return (
        <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" aria-hidden="true">
            <path d="M12 3L12 21M12 21L20.5 12.5M12 21L3.5 12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconInfo() {
    return (
        <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-muted">
            <path d="M12 11.5V16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconOffer() {
    return (
        <svg width="1.5em" strokeWidth="1.5" height="1.5em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 20H5C3.89543 20 3 19.1046 3 18V9C3 7.89543 3.89543 7 5 7H19C20.1046 7 21 7.89543 21 9V18C21 19.1046 20.1046 20 19 20Z" stroke="currentColor" />
            <path d="M7 7V3.6C7 3.26863 7.26863 3 7.6 3H16.4C16.7314 3 17 3.26863 17 3.6V7" stroke="currentColor" />
            <path d="M10 3V7" stroke="currentColor" />
            <path d="M12 3V7" stroke="currentColor" />
            <path d="M16.5 14C16.2239 14 16 13.7761 16 13.5C16 13.2239 16.2239 13 16.5 13C16.7761 13 17 13.2239 17 13.5C17 13.7761 16.7761 14 16.5 14Z" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IncludedIcon({ type }) {
    const c = ICON_ACCENT;
    if (type === 'meet') {
        return (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <g clipPath="url(#bk-meet)">
                    <path
                        d="M14.8385 11.6129H13.9637C15.2823 10.5477 16.1289 8.91997 16.1289 7.09678V4.80252C16.8966 4.35479 17.4191 3.53159 17.4191 2.58052C17.4193 1.15746 16.2619 0 14.8385 0H5.80625C4.38318 0 3.22586 1.15746 3.22586 2.58066C3.22586 3.53159 3.74839 4.35479 4.51612 4.80265V7.09678C4.51612 8.91997 5.36251 10.5477 6.68131 11.6129H5.80651C2.60519 11.6129 0 14.218 0 17.4193V23.8709C0 26.0056 1.73613 27.7418 3.87092 27.7418V39.9999H16.7741V27.7419C18.9089 27.7419 20.645 26.0058 20.645 23.871V17.4194C20.645 14.218 18.0398 11.6129 14.8385 11.6129ZM4.51612 2.58052C4.51612 1.86893 5.09478 1.29026 5.80638 1.29026H14.8386C15.5502 1.29026 16.1289 1.86893 16.1289 2.58052C16.1289 3.29212 15.5502 3.87079 14.8386 3.87079H5.80625C5.09478 3.87079 4.51612 3.29212 4.51612 2.58052ZM14.5121 5.16132C14.0173 5.94718 13.1482 6.45158 12.1785 6.45158H8.46624C7.49651 6.45158 6.62758 5.94705 6.13265 5.16132H14.5121ZM5.80625 7.09678V6.73224C6.52491 7.36131 7.45531 7.74197 8.46624 7.74197H12.1785C13.1894 7.74197 14.1198 7.36131 14.8385 6.73224V7.09678C14.8385 9.58704 12.8126 11.6129 10.3224 11.6129C7.83211 11.6129 5.80625 9.58704 5.80625 7.09678ZM13.2405 12.9032L12.6 14.5058L11.9806 14.0929L13.1702 12.9032H13.2405ZM10.7006 13.5484H9.9445L9.2993 12.9032H11.3458L10.7006 13.5484ZM10.945 21.6909L10.3225 22.3134L9.69997 21.6909L10.2709 14.8386H10.3741L10.945 21.6909ZM8.6649 14.0934L8.04557 14.5064L7.40424 12.9032H7.47464L8.6649 14.0934ZM3.87105 26.4515C2.91999 26.4515 2.09679 25.929 1.64906 25.1613H3.87105V26.4515ZM9.6773 38.7096H5.16132V37.4193H9.67743L9.6773 38.7096ZM15.4838 38.7096H10.9676V37.4193H15.4837L15.4838 38.7096ZM15.4838 36.1289H10.9676V29.0322H9.6773V36.1289H5.16132V26.4515H15.4838V36.1289ZM16.7741 26.4515V25.1613H18.9961C18.5483 25.929 17.7251 26.4515 16.7741 26.4515ZM19.3547 23.8709H16.7741V16.1289H15.4838V25.1611H5.16132V16.1289H3.87105V23.8709H1.29026V17.4193C1.29026 14.929 3.31612 12.9032 5.80638 12.9032H6.01478L7.43864 16.4618L8.92384 15.4715L8.3645 22.1799L10.3225 24.1381L12.2805 22.1801L11.7212 15.4717L13.2064 16.4619L14.6302 12.9033H14.8386C17.3289 12.9033 19.3547 14.9292 19.3547 17.4194V23.8709Z"
                        fill={c}
                    />
                    <path d="M34.0625 17.5002H39.0625" stroke={c} strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M32.4297 25.556L34.4436 25.556" stroke={c} strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M39.0278 5.41666H32.0652C31.0651 5.41666 30.1612 6.01265 29.7673 6.93186L24.5771 19.0422C24.4438 19.3534 24.375 19.6885 24.375 20.027V33.6111M24.375 33.6111V38.9028C24.375 39.317 24.7108 39.6528 25.125 39.6528H31.6806C32.0948 39.6528 32.4306 39.317 32.4306 38.9028V33.6111M24.375 33.6111H32.4306M32.4306 33.6111H39.0278" stroke={c} strokeWidth="1.875" strokeLinecap="round" />
                </g>
                <defs>
                    <clipPath id="bk-meet">
                        <rect width="40" height="40" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        );
    }
    if (type === 'cancel') {
        return (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M13.334 16.6667L26.6673 16.6667" stroke={c} strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.666 23.3333L13.3327 23.3333" stroke={c} strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M26.666 23.3333L28.3327 23.3333" stroke={c} strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 30V18.8465C5 18.5079 5.06877 18.1729 5.20214 17.8617L9.35063 8.18186C9.74457 7.26265 10.6484 6.66666 11.6485 6.66666H28.3515C29.3516 6.66666 30.2554 7.26265 30.6494 8.18186L34.7979 17.8617C34.9312 18.1729 35 18.5079 35 18.8465V22.5M5 30V34.25C5 34.6642 5.33579 35 5.75 35H10.9167C11.3309 35 11.6667 34.6642 11.6667 34.25V30M5 30H11.6667M11.6667 30H23.3333" stroke={c} strokeWidth="1.875" strokeLinecap="round" />
                <path d="M28.334 28.3375L36.6673 36.6667L32.5007 32.5L28.334 36.6667L32.5007 32.5L36.6673 28.3333" stroke={c} strokeWidth="1.87771" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    if (type === 'chargers') {
        return (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M10 15V33C10 34.1046 10.8954 35 12 35H29.6667C30.7712 35 31.6667 34.1046 31.6667 33V23.3333" stroke={c} strokeWidth="2" strokeLinecap="round" />
                <path d="M15 8.93398V13.0007C15 14.1052 14.1046 15.0007 13 15.0007H7C5.89543 15.0007 5 14.1052 5 13.0007V8.93398C5 8.60261 5.26863 8.33398 5.6 8.33398H14.4C14.7314 8.33398 15 8.60261 15 8.93398Z" stroke={c} strokeWidth="2" strokeLinecap="round" />
                <path d="M6.6665 8.33333V5" stroke={c} strokeWidth="2" strokeLinecap="round" />
                <path d="M13.3335 8.33333V5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M30.2778 6.66602L27.5 11.666H34.1667L31.3889 16.666" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    if (type === 'wipes') {
        return (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <g clipPath="url(#bk-wipes)">
                    <path
                        d="M1.83398 32.6933L6.91565 36.76C8.52604 38.0481 10.5268 38.7499 12.589 38.75H23.029C23.4267 38.75 23.8205 38.6717 24.1879 38.5195C24.5553 38.3673 24.8891 38.1442 25.1703 37.863C25.4515 37.5818 25.6746 37.248 25.8268 36.8806C25.979 36.5131 26.0573 36.1194 26.0573 35.7217C26.056 34.9189 25.7365 34.1494 25.1689 33.5818C24.6012 33.0141 23.8317 32.6947 23.029 32.6933H15.2073"
                        stroke={c}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M2.10742 23.61H8.16742C9.96242 23.61 11.7174 24.1417 13.2091 25.1383L16.6674 27.4433C16.9948 27.6407 17.2788 27.9024 17.5023 28.2124C17.7259 28.5225 17.8844 28.8746 17.9683 29.2475C18.0523 29.6204 18.0599 30.0065 17.9907 30.3824C17.9215 30.7583 17.777 31.1164 17.5658 31.435C17.1826 32.0072 16.6041 32.4203 15.9384 32.597C15.2728 32.7737 14.5656 32.7019 13.9491 32.395L9.40242 29.6667M38.1674 30.1983C38.1679 29.7786 38.0856 29.3629 37.9253 28.975C37.7651 28.5871 37.5299 28.2346 37.2334 27.9376C36.9368 27.6405 36.5847 27.4049 36.197 27.244C35.8094 27.0831 35.3938 27.0002 34.9741 27C34.8941 27 34.8191 27.0167 34.7408 27.0233C35.1255 25.592 34.9983 24.0711 34.381 22.7236C33.7638 21.3761 32.6952 20.2864 31.36 19.6429C30.0248 18.9994 28.5068 18.8425 27.0681 19.1992C25.6295 19.5559 24.3607 20.4039 23.4808 21.5967C22.6004 20.9194 21.5106 20.572 20.4007 20.615C19.2909 20.6579 18.2311 21.0884 17.4058 21.8317M36.4391 9.90167C36.3741 11.0049 35.89 12.0416 35.0859 12.7998C34.2818 13.5579 33.2184 13.9802 32.1133 13.9802C31.0081 13.9802 29.9447 13.5579 29.1406 12.7998C28.3365 12.0416 27.8524 11.0049 27.7874 9.90167C27.7874 6.65667 32.1124 1.25 32.1124 1.25C32.1124 1.25 36.4391 6.65667 36.4391 9.90167Z"
                        stroke={c}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <defs>
                    <clipPath id="bk-wipes">
                        <rect width="40" height="40" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        );
    }
    // water
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path
                d="M25.7194 27.848C25.5205 27.2842 25.295 26.6451 25.0423 25.861L24.9549 25.5901L25.9066 23.8443C25.9192 23.8211 25.9307 23.7972 25.941 23.7729C26.5221 22.3974 26.8167 20.9429 26.8167 19.4496V19.2129V12.4446V12.2924C26.8168 9.90033 25.7603 7.6533 23.918 6.12743L22.921 5.30165V4.42095C23.1121 4.2754 23.2359 4.0461 23.2359 3.78751V0.796799C23.2358 0.356798 22.8789 0 22.4389 0H17.5594C17.1193 0 16.7626 0.356798 16.7626 0.796799V3.78751C16.7626 4.04618 16.8864 4.2754 17.0774 4.42087V5.30157L16.0805 6.12736C14.2382 7.65314 13.1816 9.90033 13.1816 12.2923V12.4446V19.2129V19.4496C13.1816 20.9428 13.4763 22.3973 14.0573 23.7729C14.0676 23.7972 14.079 23.821 14.0917 23.8442L15.0434 25.5902L14.956 25.861C14.7033 26.6451 14.4778 27.2841 14.2789 27.848C13.5714 29.8536 13.1816 30.9583 13.1816 34.0089V37.3209C13.1816 38.7981 14.3834 40 15.8608 40H24.1376C25.6149 40 26.8167 38.7982 26.8167 37.3209V34.0089C26.8167 30.9583 26.4268 29.8536 25.7194 27.848ZM18.3563 1.5936H21.6421V2.99063H18.3563V1.5936ZM17.097 7.35478L18.3825 6.29001C18.5652 6.13868 18.671 5.91368 18.671 5.67642V4.58431H21.3273V5.67626C21.3273 5.91361 21.433 6.13861 21.6158 6.28986L22.9013 7.35462C24.2099 8.43861 25.0237 9.97705 25.1908 11.6478H14.8075C14.9746 9.97713 15.7884 8.43877 17.097 7.35478ZM14.7753 13.2415H25.2232V18.4162H14.7753V13.2415ZM25.2231 37.3209C25.2231 37.9194 24.7361 38.4062 24.1376 38.4062H15.8608C15.2622 38.4062 14.7753 37.9194 14.7753 37.3209V34.0088C14.7753 33.6711 14.7801 33.3615 14.7895 33.0742H18.8187C19.2588 33.0742 19.6155 32.7174 19.6155 32.2774C19.6155 31.8374 19.2588 31.4806 18.8187 31.4806H14.9178C14.9602 31.1818 15.0123 30.9044 15.0742 30.6344H22.2029C22.6429 30.6344 22.9997 30.2776 22.9997 29.8376C22.9997 29.3976 22.6429 29.0408 22.2029 29.0408H15.5498C15.622 28.8317 15.6991 28.6127 15.7819 28.3781C15.8034 28.3171 15.8254 28.2547 15.8475 28.1918C15.8671 28.1932 15.8867 28.1948 15.9067 28.1948H21.5733C22.0133 28.1948 22.3701 27.838 22.3701 27.398C22.3701 26.958 22.0133 26.6012 21.5733 26.6012H16.3912C16.4181 26.5189 16.4453 26.4358 16.4729 26.3501L16.6652 25.7537C16.7322 25.5459 16.7109 25.3196 16.6064 25.1279L15.5104 23.1172C15.0949 22.1225 14.8539 21.0798 14.7916 20.01H25.2068C25.1445 21.0796 24.9035 22.1222 24.488 23.117L23.392 25.1278C23.2874 25.3195 23.2663 25.5458 23.3332 25.7536L23.5255 26.3499C23.7849 27.1547 24.0142 27.8047 24.2166 28.378C24.9077 30.337 25.2231 31.231 25.2231 34.0088V37.3209Z"
                fill={c}
            />
            <path
                d="M22.8341 31.4812H21.7323C21.2923 31.4812 20.9355 31.838 20.9355 32.278C20.9355 32.718 21.2923 33.0748 21.7323 33.0748H22.8341C23.2741 33.0748 23.6309 32.718 23.6309 32.278C23.6309 31.838 23.2741 31.4812 22.8341 31.4812Z"
                fill={c}
            />
        </svg>
    );
}

export function MapPinSvg() {
    return (
        <svg width="23" height="32" viewBox="0 0 23 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="11.2908" cy="11.2898" r="11.2898" fill="#f0c5d2" />
            <line x1="11.5" y1="20.3877" x2="11.5" y2="29.6183" stroke="#5b0520" strokeWidth="3" strokeLinecap="round" />
            <circle cx="11.291" cy="11.29" r="9.40817" fill="#5b0520" />
            <circle cx="11.29" cy="11.29" r="4.70409" fill="#FBF8F2" />
        </svg>
    );
}
