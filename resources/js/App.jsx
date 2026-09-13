import { useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { isActiveChauffeur, isCustomer, isPendingChauffeur } from './utils/roles';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/Home';
import Chauffeurs from './pages/Chauffeurs';
import Business from './pages/Business';
import Corporations from './pages/Corporations';
import TravelAgencies from './pages/TravelAgencies';
import StrategicPartnerships from './pages/StrategicPartnerships';
import IconicPlaces from './pages/IconicPlaces';
import Hotels from './pages/Hotels';
import Malls from './pages/Malls';
import Beaches from './pages/Beaches';
import Restaurants from './pages/Restaurants';
import Help from './pages/Help';
import Login from './pages/Login';
import Register from './pages/Register';
import CompleteProfile from './pages/CompleteProfile';
import Account from './pages/Account';
import Journeys from './pages/Journeys';
import JourneyRide from './pages/JourneyRide';
import ChauffeurPortal from './pages/ChauffeurPortal';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import BusinessSolutions from './pages/BusinessSolutions';
import AboutUs from './pages/AboutUs';
import Skeleton from './components/ui/Skeleton';

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
                    <Route
                        path="/login"
                        element={
                            <GuestRoute>
                                <Login />
                            </GuestRoute>
                        }
                    />
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
                                redirectTo={(user) => (isPendingChauffeur(user) ? '/complete-profile' : '/account')}
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
                                redirectTo={(user) => (isPendingChauffeur(user) ? '/complete-profile' : '/account')}
                            >
                                <ChauffeurPortal />
                            </RoleRoute>
                        }
                    />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/booking/checkout" element={<Checkout />} />
                    <Route path="/booking/checkout/" element={<Checkout />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    );
}
