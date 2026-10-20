import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import FieldError from '../../Components/FieldError';

const sections = [
    { type: 'department', title: 'Departments' },
    { type: 'designation', title: 'Designations' },
    { type: 'category', title: 'HR Categories' },
];

function CodificationTable({ section, items, canManage, onEdit, deleteError }) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 bg-[#c3d4ed] px-5 py-3">
                <div className="text-sm font-semibold text-slate-800">{section.title}</div>
                {canManage && <button type="button" onClick={() => onEdit(section.type)} className="hr-outline-button !bg-white">+ Add More</button>}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 font-semibold">Sr. No.</th>
                            <th className="px-5 py-3 font-semibold">{section.title}</th>
                            {section.type === 'designation' && <th className="px-5 py-3 font-semibold">Department</th>}
                            {canManage && <th className="px-5 py-3 font-semibold">Action</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.length === 0 ? (
                            <tr><td colSpan={canManage ? (section.type === 'designation' ? 4 : 3) : (section.type === 'designation' ? 3 : 2)} className="px-5 py-8 text-center text-slate-500">No {section.title.toLowerCase()} added yet.</td></tr>
                        ) : items.map((item, index) => (
                            <tr key={item.id} className="text-slate-700">
                                <td className="px-5 py-3">{String(index + 1).padStart(2, '0')}</td>
                                <td className="px-5 py-3 font-medium">{item.name}</td>
                                {section.type === 'designation' && <td className="px-5 py-3">{item.parent_name || '—'}</td>}
                                {canManage && <td className="px-5 py-3">
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => onEdit(section.type, item)} className="text-sm font-medium text-sky-700 hover:underline">Edit</button>
                                        <button type="button" onClick={() => window.confirm(`Delete ${item.name}?`) && router.delete(`/settings/codifications/${item.id}`, { preserveScroll: true })} className="text-sm font-medium text-rose-700 hover:underline">Delete</button>
                                    </div>
                                </td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {deleteError && <div className="px-5 pb-3"><FieldError message={deleteError} /></div>}
        </section>
    );
}

export default function SettingsIndex({ codifications, departments, canManage }) {
    const sharedErrors = usePage().props.errors ?? {};
    const [tab, setTab] = useState('codification');
    const [editing, setEditing] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const form = useForm({ type: 'department', name: '', parent_id: '' });

    function openForm(type, item = null) {
        setEditing(item);
        setFormOpen(true);
        form.clearErrors();
        form.setData({
            type,
            name: item?.name ?? '',
            parent_id: item?.parent_id ?? '',
        });
    }

    function closeForm() {
        setEditing(null);
        setFormOpen(false);
        form.reset();
        form.clearErrors();
    }

    function submit(event) {
        event.preventDefault();
        const options = { onSuccess: closeForm };
        editing
            ? form.put(`/settings/codifications/${editing.id}`, options)
            : form.post('/settings/codifications', options);
    }

    return (
        <AppLayout title="Settings">
            <Head title="Settings" />
            <div className="mb-6">
                <p className="text-sm font-medium text-sky-700">Human Resources Module</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
            </div>
            <div className="mb-6 flex gap-2 border-b border-slate-200" role="tablist" aria-label="Settings sections">
                <button type="button" role="tab" aria-selected={tab === 'general'} onClick={() => setTab('general')} className={`hr-form-tab ${tab === 'general' ? 'hr-form-tab-active' : ''}`}>General</button>
                <button type="button" role="tab" aria-selected={tab === 'codification'} onClick={() => setTab('codification')} className={`hr-form-tab ${tab === 'codification' ? 'hr-form-tab-active' : ''}`}>HR Codification</button>
            </div>

            {tab === 'general' ? (
                <div className="rounded-lg border border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-500 shadow-sm">NO DATA FOUND</div>
            ) : (
                <div className="space-y-5">
                    {sections.map((section) => (
                        <CodificationTable
                            key={section.type}
                            section={section}
                            items={codifications[section.type] ?? []}
                            canManage={canManage}
                            onEdit={openForm}
                            deleteError={section.type === 'department' ? sharedErrors.codification : null}
                        />
                    ))}
                </div>
            )}

            {formOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}>
                    <form onSubmit={submit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="codification-dialog-title">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 id="codification-dialog-title" className="text-lg font-semibold text-slate-900">{editing ? 'Edit' : 'Add'} {sections.find((section) => section.type === form.data.type)?.title}</h2>
                            <button type="button" onClick={closeForm} className="rounded p-1 text-2xl leading-none text-slate-500 hover:bg-slate-100" aria-label="Close">&times;</button>
                        </div>
                        <label className="block text-sm font-medium text-slate-700">
                            Type
                            <select value={form.data.type} onChange={(event) => form.setData({ ...form.data, type: event.target.value, parent_id: '' })} aria-invalid={Boolean(form.errors.type)} className={`hr-form-control ${form.errors.type ? 'border-rose-500' : ''}`}>
                                {sections.map((section) => <option key={section.type} value={section.type}>{section.title}</option>)}
                            </select>
                            <FieldError message={form.errors.type} />
                        </label>
                        {form.data.type === 'designation' && (
                            <label className="mt-4 block text-sm font-medium text-slate-700">
                                Department
                                <select value={form.data.parent_id} onChange={(event) => form.setData('parent_id', event.target.value)} required aria-invalid={Boolean(form.errors.parent_id)} className={`hr-form-control ${form.errors.parent_id ? 'border-rose-500' : ''}`}>
                                    <option value="">Select department</option>
                                    {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                                </select>
                                <FieldError message={form.errors.parent_id} />
                            </label>
                        )}
                        <label className="mt-4 block text-sm font-medium text-slate-700">
                            Name
                            <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} required maxLength="120" aria-invalid={Boolean(form.errors.name)} className={`hr-form-control ${form.errors.name ? 'border-rose-500' : ''}`} />
                            <FieldError message={form.errors.name} />
                        </label>
                        {form.errors.codification && <p className="mt-3 text-sm text-rose-700">{form.errors.codification}</p>}
                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={closeForm} className="hr-secondary-button">Cancel</button>
                            <button disabled={form.processing} className="hr-primary-button">{form.processing ? 'Saving...' : editing ? 'Save Changes' : 'Add'}</button>
                        </div>
                    </form>
                </div>
            )}
        </AppLayout>
    );
}
