import { lazy, Suspense, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { isActiveChauffeur, isCustomer, isPartnerAdmin, isPendingChauffeur } from './utils/roles';
import { ToastProvider } from './context/ToastContext';
import Skeleton from './components/ui/Skeleton';

const Home = lazy(() => import('./pages/Home'));
const Chauffeurs = lazy(() => import('./pages/Chauffeurs'));
const Business = lazy(() => import('./pages/Business'));
const Corporations = lazy(() => import('./pages/Corporations'));
const TravelAgencies = lazy(() => import('./pages/TravelAgencies'));
const StrategicPartnerships = lazy(() => import('./pages/StrategicPartnerships'));
const IconicPlaces = lazy(() => import('./pages/IconicPlaces'));
const Hotels = lazy(() => import('./pages/Hotels'));
const Malls = lazy(() => import('./pages/Malls'));
const Beaches = lazy(() => import('./pages/Beaches'));
const Restaurants = lazy(() => import('./pages/Restaurants'));
const Help = lazy(() => import('./pages/Help'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));
const Account = lazy(() => import('./pages/Account'));
const Journeys = lazy(() => import('./pages/Journeys'));
const JourneyRide = lazy(() => import('./pages/JourneyRide'));
const ChauffeurPortal = lazy(() => import('./pages/ChauffeurPortal'));
const PartnerPortal = lazy(() => import('./pages/PartnerPortal'));
const GuestPay = lazy(() => import('./pages/GuestPay'));
const Booking = lazy(() => import('./pages/Booking'));
const Checkout = lazy(() => import('./pages/Checkout'));
const BusinessSolutions = lazy(() => import('./pages/BusinessSolutions'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Contact = lazy(() => import('./pages/Contact'));

function GuestRoute({ children }) {
    const { isAuthenticated, loading, consumeReturnTo } = useAuth();
    const redirectRef = useRef(null);

    if (loading) {
        return <Skeleton variant="page" />;
    }

    if (isAuthenticated) {
        if (!redirectRef.current) {
            redirectRef.current = consumeReturnTo();
        }
        return <Navigate to={redirectRef.current || '/'} replace />;
    }

    return children;
}

function journeysRedirect(user) {
    if (isActiveChauffeur(user)) return '/chauffeur';
    if (isPendingChauffeur(user)) return '/complete-profile';
    return '/account';
}

function RoleRoute({ allow, redirectTo, children }) {
    const { isAuthenticated, loading, user, setReturnTo } = useAuth();

    if (loading) {
        return <Skeleton variant="page" />;
    }

    if (!isAuthenticated) {
        const from = `${window.location.pathname}${window.location.search}`;
        setReturnTo(from);
        return <Navigate to={`/login?from=${encodeURIComponent(from)}`} replace />;
    }

    if (!allow(user)) {
        return <Navigate to={redirectTo(user)} replace />;
    }

    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <Suspense fallback={<Skeleton variant="page" />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/partners" element={<Chauffeurs />} />
                            <Route path="/chauffeurs" element={<Navigate to="/partners" replace />} />
                            <Route path="/business" element={<Business />} />
                            <Route path="/buisness" element={<Navigate to="/business" replace />} />
                            <Route path="/corporations" element={<Corporations />} />
                            <Route path="/travel-agencies" element={<TravelAgencies />} />
                            <Route path="/strategic-partnerships" element={<StrategicPartnerships />} />
                            <Route path="/iconic-places" element={<IconicPlaces />} />
                            <Route path="/hotels" element={<Hotels />} />
                            <Route path="/malls" element={<Malls />} />
                            <Route path="/beaches" element={<Beaches />} />
                            <Route path="/restaurants" element={<Restaurants />} />
                            <Route path="/help" element={<Help />} />
                            <Route path="/business-solutions" element={<BusinessSolutions />} />
                            <Route path="/about-us" element={<AboutUs />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/leave-a-message" element={<Navigate to="/contact" replace />} />
                            <Route
                                path="/login"
                                element={
                                    <GuestRoute>
                                        <Login />
                                    </GuestRoute>
                                }
                            />
                            <Route path="/oauth/callback" element={<OAuthCallback />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/complete-profile" element={<CompleteProfile />} />
                            <Route path="/account" element={<Account />} />
                            <Route
                                path="/journeys"
                                element={
                                    <RoleRoute allow={isCustomer} redirectTo={journeysRedirect}>
                                        <Journeys />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/journeys/ride/:id/track"
                                element={<Navigate to=".." relative="path" replace />}
                            />
                            <Route
                                path="/journeys/ride/:id"
                                element={
                                    <RoleRoute allow={isCustomer} redirectTo={journeysRedirect}>
                                        <JourneyRide mode="details" />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/journeys/:tab"
                                element={
                                    <RoleRoute allow={isCustomer} redirectTo={journeysRedirect}>
                                        <Journeys />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/chauffeur"
                                element={
                                    <RoleRoute
                                        allow={isActiveChauffeur}
                                        redirectTo={(user) =>
                                            isPendingChauffeur(user) ? '/complete-profile' : '/account'
                                        }
                                    >
                                        <ChauffeurPortal />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/chauffeur/:tab"
                                element={
                                    <RoleRoute
                                        allow={isActiveChauffeur}
                                        redirectTo={(user) =>
                                            isPendingChauffeur(user) ? '/complete-profile' : '/account'
                                        }
                                    >
                                        <ChauffeurPortal />
                                    </RoleRoute>
                                }
                            />
                            <Route path="/booking" element={<Booking />} />
                            <Route path="/booking/checkout" element={<Checkout />} />
                            <Route path="/booking/checkout/" element={<Checkout />} />
                            <Route path="/pay/:token" element={<GuestPay />} />
                            <Route
                                path="/partner"
                                element={
                                    <RoleRoute allow={isPartnerAdmin} redirectTo={() => '/account'}>
                                        <PartnerPortal />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/partner/:tab"
                                element={
                                    <RoleRoute allow={isPartnerAdmin} redirectTo={() => '/account'}>
                                        <PartnerPortal />
                                    </RoleRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    );
}
