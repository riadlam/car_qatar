import { useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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

function GuestRoute({ children }) {
    const { isAuthenticated, loading, consumeReturnTo } = useAuth();
    const redirectRef = useRef(null);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-page text-ink-text">
                Loading...
            </div>
        );
    }

    if (isAuthenticated) {
        if (!redirectRef.current) {
            redirectRef.current = consumeReturnTo();
        }
        return <Navigate to={redirectRef.current || '/'} replace />;
    }

    return children;
}

export default function App() {
    return (
        <AuthProvider>
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
                    <Route path="/journeys" element={<Journeys />} />
                    <Route path="/journeys/ride/:id/track" element={<JourneyRide mode="track" />} />
                    <Route path="/journeys/ride/:id" element={<JourneyRide mode="details" />} />
                    <Route path="/journeys/:tab" element={<Journeys />} />
                    <Route path="/chauffeur" element={<ChauffeurPortal />} />
                    <Route path="/chauffeur/:tab" element={<ChauffeurPortal />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/booking/checkout" element={<Checkout />} />
                    <Route path="/booking/checkout/" element={<Checkout />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
