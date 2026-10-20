import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';

export default function Login({ registrationAvailable }) {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });

    function submit(event) {
        event.preventDefault();
        post('/login');
    }

    return (
        <AuthLayout>
            <Head title="Sign in" />
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Welcome back</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Sign in to your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Access your HR dashboard and employee directory.</p>
            </div>
            <form onSubmit={submit} className="space-y-5">
                <label className="block text-sm font-medium text-slate-700">
                    Email address
                    <span className="relative mt-1.5 block">
                        <img src="/images/Email-icon.svg" alt="" className="pointer-events-none absolute left-3 top-1/2 h-4 w-5 -translate-y-1/2" />
                        <input type="text" inputMode="email" value={data.email} onChange={(event) => setData('email', event.target.value)} required autoFocus autoComplete="username" placeholder="you@company.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'login-email-error' : undefined} className={`w-full rounded-lg border bg-white py-3 pl-11 pr-4 font-normal outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-sky-100 ${errors.email ? 'border-rose-500 focus:border-rose-600' : 'border-slate-300 focus:border-sky-600'}`} />
                    </span>
                    {errors.email && <span id="login-email-error" className="mt-1 block text-xs font-normal text-rose-700">{errors.email}</span>}
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Password
                    <span className="relative mt-1.5 block">
                        <img src="/images/Password-Icon.svg" alt="" className="pointer-events-none absolute left-3 top-1/2 h-5 w-4 -translate-y-1/2" />
                        <input type="password" value={data.password} onChange={(event) => setData('password', event.target.value)} required autoComplete="current-password" placeholder="Enter your password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'login-password-error' : undefined} className={`w-full rounded-lg border bg-white py-3 pl-11 pr-4 font-normal outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-sky-100 ${errors.password ? 'border-rose-500 focus:border-rose-600' : 'border-slate-300 focus:border-sky-600'}`} />
                    </span>
                    {errors.password && <span id="login-password-error" className="mt-1 block text-xs font-normal text-rose-700">{errors.password}</span>}
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={data.remember} onChange={(event) => setData('remember', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600" />
                    Keep me signed in
                </label>
                <button disabled={processing} className="w-full rounded-lg bg-gradient-to-r from-[#866F9F] to-[#2789CE] px-5 py-3 font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60">{processing ? 'Signing in...' : 'Sign in'}</button>
            </form>
            {registrationAvailable && <p className="mt-7 text-center text-sm text-slate-600">First time setup? <Link href="/register" className="font-semibold text-sky-700 hover:underline">Create the administrator account</Link></p>}
        </AuthLayout>
    );
}
