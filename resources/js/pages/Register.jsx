import { Navigate } from 'react-router-dom';

/** Register uses the same email → OTP → profile flow as login (create tab). */
export default function Register() {
    return <Navigate to="/login?mode=signup" replace />;
}
