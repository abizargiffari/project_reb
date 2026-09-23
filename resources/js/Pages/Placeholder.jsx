import { Head } from '@inertiajs/react';

export default function Placeholder({ modul, method }) {
    return (
        <>
            <Head title={`${modul} — Segera Hadir`} />
            <div className="min-h-screen bg-cream flex items-center justify-center px-4">
                <div className="bg-surface rounded-xl2 shadow-sm p-8 max-w-md text-center border border-gray-100">
                    <p className="text-xs uppercase tracking-wide text-text-secondary mb-2">
                        Fase 4 — Belum Diimplementasikan
                    </p>
                    <h1 className="text-xl font-bold text-primary mb-2">{modul}</h1>
                    <p className="text-sm text-text-secondary">
                        Method <code className="bg-cream px-1.5 py-0.5 rounded">{method}</code> pada
                        controller ini masih berupa stub. Halaman akan dibangun sesuai urutan modul di roadmap.
                    </p>
                </div>
            </div>
        </>
    );
}
