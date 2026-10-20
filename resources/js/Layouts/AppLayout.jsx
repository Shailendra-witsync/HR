import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import PageFeedback from '../Components/PageFeedback';
import FieldError from '../Components/FieldError';

const navigation = [
    { label: 'Dashboard', href: '/dashboard', icon: 'Dashboard.svg', permission: 'dashboard', active: (url) => url === '/dashboard' },
    { label: 'Add Human Resources', href: '/employees/create', icon: 'add-human-resources.svg', permission: 'add_employees', active: (url) => url === '/employees/create' },
    { label: 'Drafts Saved', icon: 'draft-saved.svg', comingSoon: true },
    { label: 'Modify Details', href: '/employees?view=modify', icon: 'modify-details.svg', permission: 'modify_employees', active: (url) => url.startsWith('/employees') && url.includes('view=modify') },
    { label: 'Financial Exposure', icon: 'financial-exposure.svg', comingSoon: true },
    { label: 'List Of Human Resources', href: '/employees', icon: 'list-of-human-resources.svg', permission: 'list_employees', active: (url) => url.startsWith('/employees') && url !== '/employees/create' && !url.includes('view=modify') },
    { label: 'Manage Access', href: '/manage-access', icon: 'manage-access.svg', permission: 'manage_access', active: (url) => url.startsWith('/manage-access') },
    { label: 'Reports', icon: 'Reports.svg', comingSoon: true },
    { label: 'Settings', href: '/settings', icon: 'Settings.svg', permission: 'settings', active: (url) => url.startsWith('/settings') },
];

export default function AppLayout({ title, children }) {
    const page = usePage();
    const { auth } = page.props;
    const { url } = page;
    const searchForm = useForm({ search: '' });
    const [menuOpen, setMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const visibleNavigation = navigation.filter((item) => item.comingSoon || auth?.permissions?.[item.permission]?.view);

    function toggleNavigation() {
        if (window.matchMedia('(min-width: 768px)').matches) {
            setSidebarCollapsed((collapsed) => !collapsed);
            return;
        }

        setMenuOpen((open) => !open);
    }

    function submitSearch(event) {
        event.preventDefault();
        searchForm.get('/employees', { preserveState: true, preserveScroll: true });
    }

    return (
        <>
            <Head title={title} />
            <PageFeedback />
            <header className="hr-header">
                <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                        <button type="button" onClick={toggleNavigation} className="rounded p-2 text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70" aria-label={menuOpen ? 'Close navigation' : 'Toggle navigation'} aria-expanded={menuOpen}>
                            <span className="block h-0.5 w-6 bg-current" />
                            <span className="mt-1.5 block h-0.5 w-6 bg-current" />
                            <span className="mt-1.5 block h-0.5 w-6 bg-current" />
                        </button>
                        <Link href="/dashboard" className="flex min-w-0 items-center gap-3 sm:gap-5">
                            <img src="/images/logo.svg" alt="Witsync" className="h-9 w-24 object-contain sm:w-28" />
                            <span className="hidden border-l border-white/40 pl-5 text-xl font-semibold text-white sm:block">Human Resources Module</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        {auth?.permissions?.list_employees?.view && (
                            <div className="relative hidden md:block">
                                <form onSubmit={submitSearch} className="flex items-center gap-2 rounded-md bg-white/15 px-3">
                                    <img src="/images/Search.svg" alt="" className="h-4 w-4 brightness-0 invert" />
                                    <input value={searchForm.data.search} onChange={(event) => searchForm.setData('search', event.target.value)} placeholder="Type in to search..." aria-label="Search employees" aria-invalid={Boolean(searchForm.errors.search)} className="w-40 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/70 lg:w-52" />
                                    <button type="submit" className="sr-only">Search employees</button>
                                </form>
                                {searchForm.errors.search && <div className="absolute rounded bg-white px-2 py-1 shadow"><FieldError message={searchForm.errors.search} /></div>}
                            </div>
                        )}
                        <div className="hidden items-center gap-1 sm:flex">
                            <button type="button" title="Notifications are coming soon" aria-label="Notifications (coming soon)" className="relative rounded-md p-2 text-white hover:bg-white/15">
                                <img src="/images/Notification.svg" alt="" className="h-5 w-5" />
                            </button>
                            <button type="button" title="Messages are coming soon" aria-label="Messages (coming soon)" className="rounded-md p-2 text-white hover:bg-white/15">
                                <img src="/images/Message.svg" alt="" className="h-5 w-5" />
                            </button>
                            <Link href="/dashboard" title="Dashboard" aria-label="Dashboard" className="rounded-md p-2 text-white hover:bg-white/15">
                                <img src="/images/Dashboard.svg" alt="" className="h-5 w-5" />
                            </Link>
                        </div>
                        <details className="group relative text-white">
                            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md p-1 hover:bg-white/15 sm:gap-3 sm:border-l sm:border-white/40 sm:pl-4">
                                <img src="/images/user-avatar.svg" alt="" className="h-9 w-9 rounded-full border-2 border-white/60 bg-white p-1" />
                                <span className="hidden text-left text-sm sm:block"><span className="block text-white/75">Hello,</span><strong>{auth?.user?.name}</strong></span>
                                <span aria-hidden="true" className="text-xs">▼</span>
                            </summary>
                            <div className="absolute right-0 z-40 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-xl">
                                {auth?.permissions?.manage_access?.view && <Link href="/manage-access" className="block rounded px-3 py-2 hover:bg-slate-50">Manage Access</Link>}
                                {auth?.permissions?.settings?.view && <Link href="/settings" className="block rounded px-3 py-2 hover:bg-slate-50">Settings</Link>}
                                <button onClick={() => router.post('/logout')} className="w-full rounded px-3 py-2 text-left text-rose-700 hover:bg-rose-50">Log out</button>
                            </div>
                        </details>
                    </div>
                </div>
            </header>
            {menuOpen && <button type="button" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 md:hidden" aria-label="Close navigation" />}
            <aside className={`hr-sidebar ${sidebarCollapsed ? 'hr-sidebar-collapsed' : ''} ${menuOpen ? 'hr-sidebar-open' : ''}`}>
                <nav aria-label="Main navigation" className="space-y-2 px-4 py-6">
                    {visibleNavigation.map((item) => (
                        item.comingSoon ? (
                            <div key={item.label} className="hr-nav-link cursor-not-allowed opacity-65" aria-disabled="true" title="Coming soon">
                                <img src={`/images/${item.icon}`} alt="" className="h-5 w-5 shrink-0" />
                                <span className="hr-nav-label min-w-0 flex-1">{item.label}</span>
                                <span className="hr-nav-soon rounded bg-white/15 px-1.5 py-0.5 text-[9px] uppercase tracking-wide">Soon</span>
                            </div>
                        ) : (
                            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} title={sidebarCollapsed ? item.label : undefined} className={`hr-nav-link ${item.active(url) ? 'hr-nav-active' : ''}`}>
                                <img src={`/images/${item.icon}`} alt="" className="h-5 w-5 shrink-0" />
                                <span className="hr-nav-label">{item.label}</span>
                            </Link>
                        )
                    ))}
                </nav>
                <div className="hr-sidebar-caption mx-4 border-t border-white/20 pt-5 text-xs leading-5 text-white/65">Human Resources Module<br />Employee management</div>
            </aside>
            <nav className="hr-mobile-nav md:hidden" aria-label="Quick navigation" style={{ gridTemplateColumns: `repeat(${Math.max(Math.min(visibleNavigation.filter((item) => !item.comingSoon).length, 4), 1)}, minmax(0, 1fr))` }}>
                {visibleNavigation.filter((item) => !item.comingSoon).slice(0, 4).map((item) => (
                    <Link key={item.href} href={item.href} className={`hr-mobile-link ${item.active(url) ? 'hr-mobile-active' : ''}`}>
                        <img src={`/images/${item.icon}`} alt="" className="h-5 w-5" />
                        <span>{item.label.replace('Human Resources', 'HR').replace('List Of HR', 'HR List')}</span>
                    </Link>
                ))}
            </nav>
            <main className={`hr-main flex flex-col ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-[280px]'}`}>
                <div className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8">
                    {children}
                </div>
                <footer className="border-t border-slate-200 bg-white py-2.5">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 sm:flex-row sm:px-8">
                        <Link href="/dashboard" className="flex items-center gap-2.5">
                            <img src="/images/witsync-logo.svg" alt="Witsync" className="h-7 w-24 object-contain object-left" />
                            <span className="hidden h-5 border-l border-slate-200 sm:block" aria-hidden="true" />
                            <span className="text-xs font-medium text-slate-600">Human Resources Module</span>
                        </Link>
                        <p className="text-center text-xs text-slate-500">© {new Date().getFullYear()} Witsync. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </>
    );
}
