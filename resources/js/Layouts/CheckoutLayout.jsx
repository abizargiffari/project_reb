import { Link } from '@inertiajs/react';

const steps = [
    { no: 1, label: 'Keranjang' },
    { no: 2, label: 'Pengiriman' },
    { no: 3, label: 'Pembayaran' },
];

export default function CheckoutLayout({ children, activeStep = 3 }) {
    return (
        <div className="flex min-h-screen flex-col bg-cream">
            <header className="border-b border-gray-100 bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
                    <Link href={route('home')} className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary" />
                        <div>
                            <p className="font-bold leading-tight text-primary">Warung Sayur Pulungan</p>
                            <p className="text-[10px] text-text-secondary">Ciganjur, Jagakarsa</p>
                        </div>
                    </Link>

                    <Link href={route('cart.index')} className="text-sm text-text-secondary hover:text-primary">
                        ← Kembali ke Keranjang
                    </Link>

                    <ol className="flex items-center gap-1.5 text-sm">
                        {steps.map((s, i) => (
                            <li key={s.no} className="flex items-center gap-1.5">
                                <span
                                    className={`rounded-full px-3 py-1 font-semibold ${
                                        s.no === activeStep ? 'bg-primary text-white' : 'text-text-secondary'
                                    }`}
                                >
                                    {s.no} {s.label}
                                </span>
                                {i < steps.length - 1 && <span className="text-gray-300">›</span>}
                            </li>
                        ))}
                    </ol>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-gray-100 bg-white py-4 text-center text-xs text-text-secondary">
                🚚 Antar Pagi 06:00–09:00 WIB • ✓ Timbangan Jujur & Amanah • © {new Date().getFullYear()} Warung Sayur Pulungan
            </footer>
        </div>
    );
}
