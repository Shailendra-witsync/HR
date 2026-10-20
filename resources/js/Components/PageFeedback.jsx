import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function PageFeedback() {
    const { flash = {} } = usePage().props;
    const [toast, setToast] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const message = flash.error || flash.errorMessage;
        const type = message ? 'error' : (flash.success || flash.successMessage || flash.status) ? 'success' : null;
        const text = message || flash.success || flash.successMessage || flash.status;

        if (!type || !text) return undefined;

        setToast({ type, text });
        const timeout = window.setTimeout(() => setToast(null), type === 'error' ? 8000 : 5000);

        return () => window.clearTimeout(timeout);
    }, [flash.error, flash.errorMessage, flash.status, flash.success, flash.successMessage]);

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit?.method !== 'get') setProcessing(true);
        });
        const removeFinish = router.on('finish', () => setProcessing(false));
        const removeCancel = router.on('cancel', () => setProcessing(false));
        return () => {
            removeStart();
            removeFinish();
            removeCancel();
        };
    }, []);

    return (
        <>
            {toast && (
                <div className={`hr-toast hr-toast-${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
                    <span className="hr-toast-icon" aria-hidden="true">{toast.type === 'error' ? '!' : '✓'}</span>
                    <p className="min-w-0 flex-1">{toast.text}</p>
                    <button type="button" onClick={() => setToast(null)} className="hr-toast-close" aria-label="Dismiss notification">&times;</button>
                </div>
            )}
            {processing && (
                <div className="hr-processing-overlay" role="status" aria-live="polite">
                    <div className="hr-processing-card">
                        <span className="hr-spinner" aria-hidden="true" />
                        <p className="font-semibold text-slate-800">Processing your request</p>
                        <p className="mt-1 text-sm text-slate-500">Please wait while we save your changes.</p>
                    </div>
                </div>
            )}
        </>
    );
}
