import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import FieldError from '../../Components/FieldError';

const fields = [
    ['first_name', 'First Name', 'text', true],
    ['middle_name', 'Middle Name', 'text', false],
    ['last_name', 'Last Name', 'text', true],
    ['nationality', 'Nationality', 'text', false],
    ['country_of_residence', 'Country Of Residence', 'text', false],
    ['contact_number', 'Contact Number', 'tel', false],
    ['religion', 'Religion', 'text', false],
    ['permanent_address_country', 'Country Of Permanent Address', 'text', false],
];

const employmentFields = [
    ['employee_id', 'Employee ID', 'text', true],
    ['hr_category', 'HR Category', 'text', false],
    ['department', 'Department', 'text', true],
    ['designation', 'Designation', 'text', true],
    ['date_of_joining', 'Date Of Joining', 'date', true],
    ['official_email', 'Official Email ID', 'email', true],
];

const defaults = {
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    department: '',
    designation: '',
    official_email: '',
    date_of_joining: '',
    status: 'active',
    gender: '',
    nationality: '',
    country_of_residence: '',
    residential_address: '',
    permanent_address: '',
    permanent_address_country: '',
    religion: '',
    contact_number: '',
    marital_status: '',
    hr_category: '',
};

function Field({ field, label, type = 'text', required = false, form, options = {} }) {
    const value = form.data[field] ?? '';
    const sharedClass = 'hr-form-control';
    const props = {
        id: field,
        name: field,
        value,
        required,
        onChange: (event) => form.setData(field, event.target.value),
        className: sharedClass,
        'aria-invalid': Boolean(form.errors[field]),
        'aria-describedby': form.errors[field] ? `${field}-error` : undefined,
    };

    return (
        <label htmlFor={field} className="block text-sm font-medium text-slate-700">
            {label}{required && <span className="text-rose-600"> *</span>}
            {field === 'gender' ? (
                <select {...props}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
            ) : field === 'status' ? (
                <select {...props}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            ) : (
                <>
                    <input {...props} type={type} list={['department', 'designation', 'hr_category'].includes(field) ? `${field}-options` : undefined} />
                                {['department', 'designation', 'hr_category'].includes(field) && <datalist id={`${field}-options`}>{(field === 'department' ? options.departments : field === 'designation' ? options.designations : options.categories)?.map((value) => <option key={value} value={value} />)}</datalist>}
                </>
            )}
            <FieldError id={`${field}-error`} message={form.errors[field]} />
        </label>
    );
}

function AddressField({ field, label, form }) {
    return (
        <label htmlFor={field} className="block text-sm font-medium text-slate-700 sm:col-span-2">
            {label}
            <textarea id={field} name={field} rows="2" value={form.data[field] ?? ''} onChange={(event) => form.setData(field, event.target.value)} aria-invalid={Boolean(form.errors[field])} aria-describedby={form.errors[field] ? `${field}-error` : undefined} className={`hr-form-control ${form.errors[field] ? 'border-rose-500' : ''}`} />
            <FieldError id={`${field}-error`} message={form.errors[field]} />
        </label>
    );
}

export default function EmployeeForm({ employee, codificationOptions = {} }) {
    const [tab, setTab] = useState('profile');
    const form = useForm({ ...defaults, ...employee });
    const editing = Boolean(employee);

    useEffect(() => {
        if (Object.keys(form.errors).length > 0) setTab('profile');
    }, [form.errors]);

    function submit(event) {
        event.preventDefault();

        if (editing) {
            form.put(`/employees/${employee.id}`);
        } else {
            form.post('/employees');
        }
    }

    return (
        <AppLayout title={editing ? 'Modify Employee Details' : 'Add Human Resources'}>
            <Head title={editing ? 'Modify Employee Details' : 'Add Human Resources'} />
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-sky-700">Human Resources Module{editing ? ` / ${employee.employee_id}` : ''}</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{editing ? 'Modify Employee Details' : 'Add Human Resources'}</h1>
                </div>
                <Link href="/employees" className="text-sm font-medium text-indigo-700 hover:underline">&larr; Employee directory</Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="flex gap-2 border-b border-slate-200">
                    <button type="button" onClick={() => setTab('profile')} className={`hr-form-tab ${tab === 'profile' ? 'hr-form-tab-active' : ''}`}>Profile</button>
                    <button type="button" onClick={() => setTab('salary')} className={`hr-form-tab ${tab === 'salary' ? 'hr-form-tab-active' : ''}`}>Salary</button>
                </div>

                {tab === 'profile' ? (
                    <>
                        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                            <div className="bg-[#c3d4ed] px-5 py-3 text-sm font-semibold text-slate-800">Personal</div>
                            <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
                                {fields.slice(0, 3).map(([field, label, type, required]) => <Field key={field} field={field} label={label} type={type} required={required} form={form} options={codificationOptions} />)}
                                <Field field="gender" label="Gender" form={form} />
                                {fields.slice(3, 6).map(([field, label, type, required]) => <Field key={field} field={field} label={label} type={type} required={required} form={form} options={codificationOptions} />)}
                                <AddressField field="residential_address" label="Residential Address" form={form} />
                                <AddressField field="permanent_address" label="Permanent Address" form={form} />
                                {fields.slice(6).map(([field, label, type, required]) => <Field key={field} field={field} label={label} type={type} required={required} form={form} options={codificationOptions} />)}
                                <fieldset className="text-sm font-medium text-slate-700">
                                    <legend>Marital Status</legend>
                                    <div className="mt-3 flex gap-5">
                                        {['married', 'single'].map((status) => <label key={status} className="flex items-center gap-2 font-normal"><input type="radio" name="marital_status" value={status} checked={form.data.marital_status === status} onChange={(event) => form.setData('marital_status', event.target.value)} className="h-4 w-4 accent-[#587cb6]" />{status[0].toUpperCase() + status.slice(1)}</label>)}
                                    </div>
                                    <FieldError id="marital_status-error" message={form.errors.marital_status} />
                                </fieldset>
                            </div>
                        </section>
                        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                            <div className="bg-[#c3d4ed] px-5 py-3 text-sm font-semibold text-slate-800">Employment Details</div>
                            <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
                                {employmentFields.map(([field, label, type, required]) => <Field key={field} field={field} label={label} type={type} required={required} form={form} options={codificationOptions} />)}
                                <Field field="status" label="Status" required form={form} />
                            </div>
                        </section>
                        <div className="flex justify-end gap-3">
                            <Link href="/employees" className="hr-secondary-button">Cancel</Link>
                            <button disabled={form.processing} className="hr-primary-button"><img src="/images/Submit.svg" alt="" className="mr-2 h-5 w-5 brightness-0 invert" />{form.processing ? 'Saving...' : editing ? 'Save Changes' : 'Submit Employee'}</button>
                        </div>
                    </>
                ) : (
                    <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <p className="text-sm text-slate-500">NO DATA FOUND</p>
                    </section>
                )}
            </form>
        </AppLayout>
    );
}
