import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ courier, rutesHariIni }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-cream">
            <Head title="Dashboard Kurir" />
            <header className="bg-primary text-white px-5 py-4">
                <p className="text-xs text-white/70">Dashboard Kurir</p>
                <p className="font-bold text-lg">{courier?.nama ?? auth?.user?.name}</p>
            </header>

            <main className="p-5">
                <h2 className="font-bold text-primary mb-3">Rute Hari Ini</h2>
                {rutesHariIni.length === 0 && (
                    <div className="bg-white rounded-xl2 shadow-sm p-5 text-sm text-text-secondary">
                        Belum ada rute yang dijadwalkan untuk hari ini.
                    </div>
                )}
                {rutesHariIni.map((rute) => (
                    <div key={rute.id} className="bg-white rounded-xl2 shadow-sm p-4 mb-3">
                        <p className="font-semibold text-sm">Kloter #{rute.delivery_batch_id} — {rute.status}</p>
                        <p className="text-xs text-text-secondary mt-1">{rute.stops?.length ?? 0} titik antar</p>
                    </div>
                ))}
            </main>
        </div>
    );
}
