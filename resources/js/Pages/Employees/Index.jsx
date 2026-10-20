import React from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import FieldError from '../../Components/FieldError';

export default function Index({ employees, designations, filters }) {
    const { auth } = usePage().props;
    const canAdd = auth?.permissions?.add_employees?.view;
    const canModify = auth?.permissions?.modify_employees?.view;
    const canManage = auth?.permissions?.modify_employees?.manage;
    const form = useForm({
        employee_id: filters.employee_id ?? '',
        name: filters.name ?? '',
        designation: filters.designation ?? '',
    });

    function search(event) {
        event.preventDefault();
        form.get('/employees', { preserveState: true, preserveScroll: true });
    }

    function remove(employee) {
        if (window.confirm(`Remove ${employee.full_name} from the employee directory?`)) {
            router.delete(`/employees/${employee.id}`);
        }
    }

    return (
        <AppLayout title="List of Human Resources">
            <div className="mb-6">
                <p className="text-sm font-medium text-sky-700">Human Resources Module</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">List Of Human Resources</h1>
            </div>

            <form onSubmit={search} className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1.2fr_1fr_auto]">
                <label className="block text-sm text-slate-700">Employee ID<input value={form.data.employee_id} onChange={(event) => form.setData('employee_id', event.target.value)} className={`hr-filter-input ${form.errors.employee_id ? 'border-rose-500' : ''}`} placeholder="Employee ID" aria-label="Employee ID" aria-invalid={Boolean(form.errors.employee_id)} /> <FieldError message={form.errors.employee_id} /></label>
                <label className="block text-sm text-slate-700">Employee Name<input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className={`hr-filter-input ${form.errors.name ? 'border-rose-500' : ''}`} placeholder="Employee Name" aria-label="Employee Name" aria-invalid={Boolean(form.errors.name)} /> <FieldError message={form.errors.name} /></label>
                <label className="block text-sm text-slate-700">Designation<select value={form.data.designation} onChange={(event) => form.setData('designation', event.target.value)} className={`hr-filter-input ${form.errors.designation ? 'border-rose-500' : ''}`} aria-label="Designation" aria-invalid={Boolean(form.errors.designation)}>
                    <option value="">All Designations</option>
                    {designations.map((designation) => <option key={designation} value={designation}>{designation}</option>)}
                </select><FieldError message={form.errors.designation} /></label>
                <div className="flex gap-2">
                    <button disabled={form.processing} className="hr-primary-button">Search</button>
                    {Object.values(form.data).some(Boolean) && <Link href="/employees" className="hr-secondary-button">Clear</Link>}
                </div>
            </form>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-600">{employees.total} employee{employees.total === 1 ? '' : 's'} found</p>
                {canAdd && <Link href="/employees/create" className="hr-outline-button"><img src="/images/Add-More.svg" alt="" className="h-5 w-5" /><span>Add Employee</span></Link>}
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-[#c3d4ed] text-[#587cb6]">
                            <tr>
                                {['Sr. No', 'Departments', 'Designation', 'Employee ID', 'First Name', 'Middle Name', 'Last Name', 'Official Email ID', 'Details'].map((heading) => <th key={heading} className="whitespace-nowrap px-3 py-3 font-semibold">{heading}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees.data.length ? employees.data.map((employee, index) => (
                                <tr key={employee.id} className="odd:bg-white even:bg-[#f3f3f5]">
                                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">{String((employees.from ?? 1) + index).padStart(2, '0')}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{employee.department}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{employee.designation}</td>
                                    <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-900">{employee.employee_id}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{employee.first_name}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{employee.middle_name || '—'}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{employee.last_name}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{employee.official_email}</td>
                                    <td className="px-3 py-3 text-center">
                                        <details className="relative inline-block text-left">
                                            <summary className="list-none cursor-pointer rounded p-1 hover:bg-slate-200" aria-label={`Actions for ${employee.full_name}`}><img src="/images/ellipse.svg" alt="" className="h-5 w-5" /></summary>
                                            <div className="absolute right-0 z-10 mt-1 w-36 rounded-md border border-slate-200 bg-white py-1 text-left shadow-lg">
                                                <Link href={`/employees/${employee.id}`} className="block px-3 py-2 hover:bg-slate-50">View details</Link>
                                                {canModify && <Link href={`/employees/${employee.id}/edit`} className="block px-3 py-2 hover:bg-slate-50">Edit employee</Link>}
                                                {canManage && <button onClick={() => remove(employee)} className="w-full px-3 py-2 text-left text-rose-700 hover:bg-rose-50">Remove</button>}
                                            </div>
                                        </details>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="9" className="px-4 py-12 text-center"><p className="font-medium text-slate-700">No human resources found.</p><p className="mt-1 text-sm text-slate-500">Add an employee or adjust your search.</p>{canAdd && <Link href="/employees/create" className="mt-4 inline-flex hr-primary-button">Add Employee</Link>}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {employees.last_page > 1 && (
                    <nav aria-label="Pagination" className="flex flex-wrap justify-end gap-1 border-t border-slate-200 px-4 py-3">
                        {employees.links.map((page, index) => (
                            page.url
                                ? <Link key={`${page.label}-${index}`} href={page.url} preserveScroll className={`rounded border px-3 py-2 text-sm ${page.active ? 'border-[#587cb6] bg-gradient-to-br from-[#2789CE] to-[#866FA2] text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`} dangerouslySetInnerHTML={{ __html: page.label }} />
                                : <span key={`${page.label}-${index}`} className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-400" dangerouslySetInnerHTML={{ __html: page.label }} />
                        ))}
                    </nav>
                )}
            </div>
        </AppLayout>
    );
}
