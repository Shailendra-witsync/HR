import React from 'react';
import PageFeedback from '../Components/PageFeedback';

export default function AuthLayout({ children }) {
    return (
        <main className="auth-panel grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
            <PageFeedback />
            <section
                className="auth-art relative hidden min-h-screen flex-col justify-between overflow-hidden bg-cover bg-center p-12 text-white lg:flex"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgb(16 26 55 / 82%), rgb(16 26 55 / 35%)), url('/images/Login-BG.svg')`,
                }}
            >
                <a href="/login" className="relative z-10 inline-flex w-fit rounded bg-white/10 p-3">
                    <img src="/images/auth-logo.svg" alt="Witsync" className="w-40" />
                </a>
                <div className="relative z-10 max-w-lg pb-10">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Human Resources Module</p>
                    <h1 className="text-4xl font-semibold leading-tight">People are at the heart of every great workplace.</h1>
                    <p className="mt-4 max-w-md text-base leading-7 text-white/75">A thoughtful space to organize your team and keep employee information close at hand.</p>
                </div>
                <p className="relative z-10 text-xs text-white/60">Witsync HR Management</p>
            </section>
            <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
                <div className="w-full max-w-md">
                    <a href="/login" className="mb-8 inline-flex lg:hidden">
                        <img src="/images/logo.svg" alt="Witsync" className="h-12 w-40 object-contain object-left" />
                    </a>
                    {children}
                </div>
            </section>
        </main>
    );
}
