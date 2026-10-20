import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import FieldError from '../../Components/FieldError';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(event) {
        event.preventDefault();
        post('/register');
    }

    return (
        <AuthLayout>
            <Head title="Create account" />
            <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Get started</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Create your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Set up your account to access the HR workspace.</p>
            </div>
            <form onSubmit={submit} className="space-y-4">
                {[
                    ['name', 'Full name', 'text', 'Your full name', 'name'],
                    ['email', 'Email address', 'text', 'you@company.com', 'username'],
                    ['password', 'Password', 'password', 'At least 8 characters', 'new-password'],
                    ['password_confirmation', 'Confirm password', 'password', 'Repeat your password', 'new-password'],
                ].map(([name, label, type, placeholder, autocomplete]) => (
                    <label key={name} className="block text-sm font-medium text-slate-700">
                        {label}
                        <input type={type} name={name} value={data[name]} onChange={(event) => setData(name, event.target.value)} required autoComplete={autocomplete} placeholder={placeholder} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `register-${name}-error` : undefined} className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 font-normal outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-sky-100 ${errors[name] ? 'border-rose-500 focus:border-rose-600' : 'border-slate-300 focus:border-sky-600'}`} />
                        <FieldError id={`register-${name}-error`} message={errors[name]} />
                    </label>
                ))}
                <button disabled={processing} className="w-full rounded-lg bg-gradient-to-r from-[#866F9F] to-[#2789CE] px-5 py-3 font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60">{processing ? 'Creating account...' : 'Create account'}</button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600">Already registered? <Link href="/login" className="font-semibold text-sky-700 hover:underline">Sign in</Link></p>
        </AuthLayout>
    );
}
