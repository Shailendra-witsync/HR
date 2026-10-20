import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

export default function Dashboard({ counts, recent }) {
    const { auth } = usePage().props;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const cards = [
        { label: 'Total employees', value: counts.total, icon: 'list-of-human-resources.svg', caption: 'People in your directory' },
        { label: 'Active employees', value: counts.active, icon: 'Dashboard.svg', caption: 'Currently active' },
        { label: 'Joined this month', value: counts.joined_this_month, icon: 'add-human-resources.svg', caption: 'New team members' },
        { label: 'Inactive employees', value: counts.inactive, icon: 'manage-access.svg', caption: 'Inactive records' },
    ];

    return (
        <AppLayout title="Dashboard">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-sky-700">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Good {greeting}, {auth.user.name}</h1>
                    <p className="mt-2 text-sm text-slate-500">Here is an overview of your people and your HR workspace.</p>
                </div>
                <Link href="/employees/create" className="rounded-md bg-gradient-to-r from-[#866F9F] to-[#2789CE] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-105">+ Add Human Resource</Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <section key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{Number(card.value).toLocaleString()}</p>
                            </div>
                            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50"><img src={`/images/${card.icon}`} alt="" className="h-5 w-5" /></span>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">{card.caption}</p>
                    </section>
                ))}
            </div>

            <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="font-semibold text-slate-900">Recently added employees</h2>
                        <p className="mt-1 text-sm text-slate-500">The latest people added to your HR directory.</p>
                    </div>
                    <Link href="/employees" className="text-sm font-semibold text-sky-700 hover:underline">View employee directory &rarr;</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Department</th><th className="px-5 py-3">Designation</th><th className="px-5 py-3">Employee ID</th><th className="px-5 py-3">Status</th><th className="px-5 py-3"><span className="sr-only">Action</span></th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recent.length ? recent.map((employee) => (
                                <tr key={employee.id}>
                                    <td className="whitespace-nowrap px-5 py-3"><span className="block font-medium text-slate-900">{employee.full_name}</span><span className="text-xs text-slate-500">{employee.official_email}</span></td>
                                    <td className="whitespace-nowrap px-5 py-3">{employee.department}</td>
                                    <td className="whitespace-nowrap px-5 py-3">{employee.designation}</td>
                                    <td className="whitespace-nowrap px-5 py-3">{employee.employee_id}</td>
                                    <td className="whitespace-nowrap px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${employee.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{employee.status[0].toUpperCase() + employee.status.slice(1)}</span></td>
                                    <td className="whitespace-nowrap px-5 py-3 text-right"><Link href={`/employees/${employee.id}`} className="font-medium text-sky-700 hover:underline">Details</Link></td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="px-5 py-12 text-center"><p className="font-medium text-slate-700">Your employee directory is ready.</p><p className="mt-1 text-sm text-slate-500">Add your first employee to see their details here.</p><Link href="/employees/create" className="mt-4 inline-flex rounded-md bg-gradient-to-r from-[#866F9F] to-[#2789CE] px-4 py-2 text-sm font-semibold text-white">Add first employee</Link></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </AppLayout>
    );
}
