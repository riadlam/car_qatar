import { Navigate } from 'react-router-dom';

/** Register uses the same email-first auth flow as login. */
export default function Register() {
    return <Navigate to="/login" replace />;
}
