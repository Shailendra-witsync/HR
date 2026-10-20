import React from 'react';

export default function FieldError({ id, message }) {
    if (!message) return null;

    return <p id={id} className="mt-1 text-xs font-medium text-rose-700" role="alert">{message}</p>;
}
