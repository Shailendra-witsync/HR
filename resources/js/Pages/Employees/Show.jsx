import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function Show({ employee }) {
    const { auth } = usePage().props;
    const canModify = auth?.permissions?.modify_employees?.view;
    const sections = {
        Personal: [
            ['First Name', employee.first_name],
            ['Middle Name', employee.middle_name],
            ['Last Name', employee.last_name],
            ['Gender', employee.gender?.replaceAll('_', ' ')],
            ['Nationality', employee.nationality],
            ['Country Of Residence', employee.country_of_residence],
            ['Residential Address', employee.residential_address],
            ['Permanent Address', employee.permanent_address],
            ['Country Of Permanent Address', employee.permanent_address_country],
            ['Religion', employee.religion],
            ['Contact Number', employee.contact_number],
            ['Marital Status', employee.marital_status],
        ],
        'Employment Details': [
            ['Employee ID', employee.employee_id],
            ['HR Category', employee.hr_category],
            ['Department', employee.department],
            ['Designation', employee.designation],
            ['Date Of Joining', employee.date_of_joining],
            ['Official Email ID', employee.official_email],
            ['Status', employee.status],
        ],
    };

    return (
        <AppLayout title={employee.full_name}>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-sky-700">Human Resources Module / {employee.employee_id}</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{employee.full_name}</h1>
                </div>
                <div className="flex gap-2">
                    <Link href="/employees" className="hr-secondary-button">Back to list</Link>
                    {canModify && <Link href={`/employees/${employee.id}/edit`} className="hr-primary-button">Modify Details</Link>}
                </div>
            </div>
            {Object.entries(sections).map(([section, values]) => (
                <section key={section} className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="bg-[#c3d4ed] px-5 py-3 text-sm font-semibold text-[#587cb6]">{section}</h2>
                    <dl className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-3">
                        {values.map(([label, value]) => <div key={label} className="min-h-20 bg-white px-5 py-4"><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 whitespace-pre-line font-medium text-slate-800">{value || '—'}</dd></div>)}
                    </dl>
                </section>
            ))}
        </AppLayout>
    );
}
