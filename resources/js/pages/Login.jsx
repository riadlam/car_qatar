import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await login(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to log in.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-8"
            >
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">Log in</h1>
                    <p className="text-sm text-slate-400">Uses POST /api/auth/login</p>
                </div>

                {error && (
                    <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                        {error}
                    </p>
                )}

                <label className="block space-y-2 text-sm">
                    <span className="text-slate-300">Email</span>
                    <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-cyan-500 focus:ring-2"
                    />
                </label>

                <label className="block space-y-2 text-sm">
                    <span className="text-slate-300">Password</span>
                    <input
                        type="password"
                        required
                        value={form.password}
                        onChange={(event) => setForm({ ...form, password: event.target.value })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-cyan-500 focus:ring-2"
                    />
                </label>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
                >
                    {submitting ? 'Signing in...' : 'Sign in'}
                </button>

                <p className="text-center text-sm text-slate-400">
                    No account?{' '}
                    <Link to="/register" className="text-cyan-400 hover:text-cyan-300">
                        Register
                    </Link>
                </p>
            </form>
        </main>
    );
}
