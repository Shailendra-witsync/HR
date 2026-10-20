import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import FieldError from '../../Components/FieldError';

function RoleMatrix({ modules, roles, canManage, errors }) {
    function toggle(role, module, action, checked) {
        const permissions = Object.fromEntries(Object.entries(modules).map(([key]) => {
            const current = role.permissions[key] ?? { view: false, manage: false };
            const next = { ...current, [action]: checked };
            if (action === 'manage' && checked) next.view = true;
            if (action === 'view' && !checked) next.manage = false;
            return [key, next];
        }));

        router.put(`/manage-access/roles/${role.id}/permissions`, { permissions }, { preserveScroll: true });
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Module</th>
                        {roles.map((role) => <th key={role.id} colSpan="2" className="px-3 py-3 text-center font-semibold">{role.name}{role.is_system && <span className="ml-1 text-[10px] normal-case text-sky-700">(system)</span>}</th>)}
                    </tr>
                    <tr>
                        <th className="px-4 py-2" />
                        {roles.flatMap((role) => ['View', 'Manage'].map((label) => <th key={`${role.id}-${label}`} className="px-3 py-2 text-center font-medium">{label}</th>))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {Object.entries(modules).map(([module, label]) => (
                        <tr key={module}>
                            <th className="px-4 py-3 font-medium text-slate-700">{label}</th>
                            {roles.flatMap((role) => ['view', 'manage'].map((action) => (
                                <td key={`${role.id}-${module}-${action}`} className="px-3 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        aria-label={`${role.name}: ${action} ${label}`}
                                        checked={Boolean(role.permissions[module]?.[action])}
                                        disabled={!canManage || role.is_system}
                                        onChange={(event) => toggle(role, module, action, event.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 accent-[#587cb6] disabled:opacity-60"
                                    />
                                    {errors[`permissions.${module}.${action}`] && <FieldError message={errors[`permissions.${module}.${action}`]} />}
                                </td>
                            )))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function UserAccessRow({ user, roles, canManage, isCurrent }) {
    const form = useForm({ role_id: user.role_id ?? '', is_active: user.is_active });

    function update(changes) {
        const data = { ...form.data, ...changes };
        form.setData(data);
        form.clearErrors();
        router.put(`/manage-access/users/${user.id}`, {
            role_id: Number(data.role_id),
            is_active: data.is_active,
        }, {
            preserveScroll: true,
            onError: (errors) => form.setError(errors),
            onSuccess: () => form.clearErrors(),
        });
    }

    return (
        <tr>
            <td className="px-5 py-3 font-medium text-slate-800">{user.name}{isCurrent && <span className="ml-2 text-xs text-slate-500">(you)</span>}</td>
            <td className="px-5 py-3 text-slate-600">{user.email}</td>
            <td className="px-5 py-3">
                <select disabled={!canManage || isCurrent || form.processing} value={form.data.role_id} onChange={(event) => update({ role_id: event.target.value })} className={`hr-filter-input max-w-52 disabled:opacity-60 ${form.errors.role_id ? 'border-rose-500' : ''}`} aria-label={`Role for ${user.name}`} aria-invalid={Boolean(form.errors.role_id)}>
                    {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                </select>
                <FieldError message={form.errors.role_id} />
            </td>
            <td className="px-5 py-3">
                <select disabled={!canManage || isCurrent || form.processing} value={form.data.is_active ? 'active' : 'inactive'} onChange={(event) => update({ is_active: event.target.value === 'active' })} className={`hr-filter-input max-w-36 disabled:opacity-60 ${form.errors.is_active ? 'border-rose-500' : ''}`} aria-label={`Status for ${user.name}`} aria-invalid={Boolean(form.errors.is_active)}>
                    <option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
                <FieldError message={form.errors.is_active || form.errors.user} />
            </td>
        </tr>
    );
}

export default function ManageAccessIndex({ modules, roles, users, canManage }) {
    const { auth, errors = {} } = usePage().props;
    const [modal, setModal] = useState(null);
    const roleForm = useForm({ name: '' });
    const userForm = useForm({ name: '', email: '', password: '', password_confirmation: '', role_id: roles[0]?.id ?? '' });

    function createRole(event) {
        event.preventDefault();
        roleForm.post('/manage-access/roles', {
            onSuccess: () => {
                setModal(null);
                roleForm.reset();
            },
        });
    }

    function createUser(event) {
        event.preventDefault();
        userForm.post('/manage-access/users', {
            onSuccess: () => {
                setModal(null);
                userForm.reset('name', 'email', 'password', 'password_confirmation');
            },
        });
    }

    return (
        <AppLayout title="Manage Access">
            <Head title="Manage Access" />
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-sky-700">Human Resources Module</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Manage Access</h1>
                </div>
            </div>

            <section className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="font-semibold text-slate-900">Define Roles &amp; User</h2>
                        <p className="mt-1 text-sm text-slate-500">Grant module access with separate view and manage permissions.</p>
                    </div>
                    {canManage && <button type="button" onClick={() => { roleForm.reset(); roleForm.clearErrors(); setModal('role'); }} className="hr-primary-button">+ Add Role</button>}
                </div>
                <div className="p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-slate-800">Role permissions</h3>
                        {canManage && <button type="button" onClick={() => { userForm.reset(); userForm.setData('role_id', roles[0]?.id ?? ''); userForm.clearErrors(); setModal('user'); }} className="hr-outline-button">+ Add User</button>}
                    </div>
                    {(errors.role || errors.permissions) && <div className="mb-3"><FieldError message={errors.role || errors.permissions} /></div>}
                    <RoleMatrix modules={modules} roles={roles} canManage={canManage} errors={errors} />
                    {roles.filter((role) => !role.is_system).length > 0 && canManage && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {roles.filter((role) => !role.is_system).map((role) => (
                                <button key={role.id} type="button" disabled={role.users_count > 0} title={role.users_count > 0 ? 'Reassign users before deleting this role.' : undefined} onClick={() => window.confirm(`Delete the ${role.name} role?`) && router.delete(`/manage-access/roles/${role.id}`)} className="rounded border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">Delete {role.name}</button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="font-semibold text-slate-900">User accounts</h2>
                    <p className="mt-1 text-sm text-slate-500">Create accounts and assign a role. Inactive users cannot sign in.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr><th className="px-5 py-3 font-semibold">Name</th><th className="px-5 py-3 font-semibold">Email</th><th className="px-5 py-3 font-semibold">Role</th><th className="px-5 py-3 font-semibold">Status</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => <UserAccessRow key={user.id} user={user} roles={roles} canManage={canManage} isCurrent={user.id === auth.user.id} />)}
                        </tbody>
                    </table>
                </div>
            </section>

            <details className="mt-6 rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
                <summary className="cursor-pointer font-semibold text-slate-800">Audit &amp; access documentation</summary>
                <p className="mt-3 leading-6">Access is checked on the server for every protected page and action. Role permission changes and account status changes take effect on the next request; disabling an account prevents future logins.</p>
            </details>

            {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}>
                {modal === 'role' ? (
                    <form onSubmit={createRole} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="role-dialog-title">
                        <div className="mb-5 flex items-center justify-between"><h2 id="role-dialog-title" className="text-lg font-semibold text-slate-900">Add Role</h2><button type="button" onClick={() => setModal(null)} aria-label="Close" className="text-2xl leading-none text-slate-500">&times;</button></div>
                        <label className="block text-sm font-medium text-slate-700">Role name<input value={roleForm.data.name} onChange={(event) => roleForm.setData('name', event.target.value)} required maxLength="100" aria-invalid={Boolean(roleForm.errors.name)} className={`hr-form-control ${roleForm.errors.name ? 'border-rose-500' : ''}`} /></label>
                        <FieldError message={roleForm.errors.name} />
                        <p className="mt-3 text-sm text-slate-500">New roles start with no permissions. Grant access in the matrix after creating the role.</p>
                        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setModal(null)} className="hr-secondary-button">Cancel</button><button disabled={roleForm.processing} className="hr-primary-button">{roleForm.processing ? 'Saving...' : 'Create Role'}</button></div>
                    </form>
                ) : (
                    <form onSubmit={createUser} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="user-dialog-title">
                        <div className="mb-5 flex items-center justify-between"><h2 id="user-dialog-title" className="text-lg font-semibold text-slate-900">Add User</h2><button type="button" onClick={() => setModal(null)} aria-label="Close" className="text-2xl leading-none text-slate-500">&times;</button></div>
                        <div className="space-y-4">
                            {[['name', 'Full name', 'text'], ['email', 'Email address', 'text'], ['password', 'Password', 'password'], ['password_confirmation', 'Confirm password', 'password']].map(([field, label, type]) => <label key={field} className="block text-sm font-medium text-slate-700">{label}<input type={type} inputMode={field === 'email' ? 'email' : undefined} value={userForm.data[field]} onChange={(event) => userForm.setData(field, event.target.value)} required autoComplete={field.startsWith('password') ? 'new-password' : undefined} aria-invalid={Boolean(userForm.errors[field])} className={`hr-form-control ${userForm.errors[field] ? 'border-rose-500' : ''}`} /><FieldError message={userForm.errors[field]} /></label>)}
                            <label className="block text-sm font-medium text-slate-700">Role<select value={userForm.data.role_id} onChange={(event) => userForm.setData('role_id', event.target.value)} required aria-invalid={Boolean(userForm.errors.role_id)} className={`hr-form-control ${userForm.errors.role_id ? 'border-rose-500' : ''}`}>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select><FieldError message={userForm.errors.role_id} /></label>
                        </div>
                        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setModal(null)} className="hr-secondary-button">Cancel</button><button disabled={userForm.processing} className="hr-primary-button">{userForm.processing ? 'Creating...' : 'Create User'}</button></div>
                    </form>
                )}
            </div>}
        </AppLayout>
    );
}
