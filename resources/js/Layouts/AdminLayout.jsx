import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function buatMenu() {
    return [
        {
            judul: 'Operasional',
            items: [
                { label: 'Overview', href: route('admin.dashboard'), name: 'admin.dashboard' },
                { label: 'Analitik', href: route('admin.analytics.index'), name: 'admin.analytics.' },
                { label: 'Pesanan & Rute', href: route('admin.orders.index'), name: 'admin.orders.' },
                { label: 'Stok & Sayuran', href: route('admin.stock.index'), name: 'admin.stock.' },
                { label: 'Keuangan & Kas', href: route('admin.finance.index'), name: 'admin.finance.' },
                { label: 'Cetak Invoice', href: route('admin.print.index'), name: 'admin.print.' },
            ],
        },
        {
            judul: 'Katalog',
            items: [
                { label: 'Manajemen Produk', href: route('admin.produk.index'), name: 'admin.produk.' },
                { label: 'Voucher', href: route('admin.vouchers.index'), name: 'admin.vouchers.' },
            ],
        },
        {
            judul: 'Pelanggan',
            items: [
                { label: 'Customer', href: route('admin.customers.index'), name: 'admin.customers.' },
                { label: 'Retur & Komplain', href: route('admin.returns.index'), name: 'admin.returns.' },
                { label: 'Pesan Masuk', href: route('admin.messages.index'), name: 'admin.messages.', badge: 'unreadMessages' },
            ],
        },
        {
            judul: 'Konten',
            items: [
                { label: 'Blog & Artikel', href: route('admin.blog.index'), name: 'admin.blog.' },
                { label: 'FAQ', href: route('admin.faq.index'), name: 'admin.faq.' },
                { label: 'Testimoni', href: route('admin.testimonials.index'), name: 'admin.testimonials.' },
                { label: 'Banner Promosi', href: route('admin.banners.index'), name: 'admin.banners.' },
            ],
        },
        {
            judul: 'Sistem',
            items: [
                { label: 'Pengaturan Lapak', href: route('admin.settings.index'), name: 'admin.settings.' },
                { label: 'Manajemen Pengguna', href: route('admin.pengguna.index'), name: 'admin.pengguna.' },
            ],
        },
    ];
}

export default function AdminLayout({ children }) {
    const { auth, flash, toko = {}, unreadMessages = 0 } = usePage().props;
    const currentRoute = route().current() ?? '';
    const [drawerOpen, setDrawerOpen] = useState(false);
    const menu = buatMenu();
    const counts = { unreadMessages };

    return (
        <div className="min-h-screen bg-cream">
            {}
            {drawerOpen && (
                <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
            )}

            {}
            <aside
                className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-100 bg-white transition-transform duration-200 lg:translate-x-0 ${
                    drawerOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-start justify-between border-b border-gray-100 p-5">
                    <div>
                        <p className="font-bold leading-tight text-primary">{toko.nama || 'Warung Sayur'}</p>
                        <p className="text-xs text-text-secondary">PANEL ADMIN</p>
                    </div>
                    <button onClick={() => setDrawerOpen(false)} className="text-gray-400 lg:hidden" aria-label="Tutup menu">✕</button>
                </div>

                <nav className="flex-1 overflow-y-auto p-3">
                    {menu.map((grup) => (
                        <div key={grup.judul} className="mb-3">
                            <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">{grup.judul}</p>
                            <div className="space-y-0.5">
                                {grup.items.map((item) => {
                                    const isActive = currentRoute.startsWith(item.name);
                                    const jumlah = item.badge ? counts[item.badge] : 0;
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setDrawerOpen(false)}
                                            className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                                                isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-cream'
                                            }`}
                                        >
                                            {item.label}
                                            {jumlah > 0 && (
                                                <span className="rounded-full bg-accent-orange px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{jumlah}</span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Konten utama */}
            <div className="lg:ml-64">
                <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-gray-600 lg:hidden"
                            aria-label="Buka menu"
                        >
                            ☰
                        </button>
                        <div className="min-w-0">
                            <p className="truncate font-bold text-primary">{toko.nama || 'Warung Sayur Pulungan'}</p>
                            <p className="hidden truncate text-xs text-text-secondary sm:block">{toko.area_layanan || 'Jakarta Selatan'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-bold">{auth?.user?.name}</p>
                            <p className="text-xs text-text-secondary">Administrator</p>
                        </div>
                        <Link
                            href={route('logout')} method="post" as="button"
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-danger hover:text-danger"
                        >
                            Keluar
                        </Link>
                    </div>
                </header>

                <main className="p-4 sm:p-6">
                    {flash?.success && (
                        <div role="status" className="mb-4 rounded-xl bg-success-light px-4 py-3 text-sm font-medium text-success">{flash.success}</div>
                    )}
                    {flash?.error && (
                        <div role="alert" className="mb-4 rounded-xl bg-danger-light px-4 py-3 text-sm font-medium text-danger">{flash.error}</div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
