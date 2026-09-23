import { Link, usePage } from '@inertiajs/react';

const menu = [
    { label: 'Overview', href: route('admin.dashboard'), name: 'admin.dashboard' },
    { label: 'Pesanan & Rute', href: route('admin.orders.index'), name: 'admin.orders.*' },
    { label: 'Stok & Sayuran', href: route('admin.stock.index'), name: 'admin.stock.*' },
    { label: 'Keuangan & Kas', href: route('admin.finance.index'), name: 'admin.finance.*' },
    { label: 'Cetak Invoice', href: route('admin.print.index'), name: 'admin.print.*' },
    { label: 'Pengaturan Lapak', href: route('admin.settings.index'), name: 'admin.settings.*' },
];

export default function AdminLayout({ children }) {
    const { auth, flash } = usePage().props;
    const currentRoute = route().current();

    return (
        <div className="min-h-screen bg-cream flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-screen">
                <div className="p-5 border-b border-gray-100">
                    <p className="font-bold text-primary leading-tight">Warung Sayur</p>
                    <p className="text-xs text-text-secondary">PULUNGAN • CIGANJUR</p>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {menu.map((item) => {
                        const isActive = currentRoute?.startsWith(item.name.replace('*', ''));
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                                    isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-cream'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3">
                    <div className="bg-cream rounded-xl p-3">
                        <p className="text-xs font-semibold text-primary">KURIR MAS YAHYA</p>
                        <p className="text-xs text-text-secondary mt-1">● WA Gateway Lapak — ONLINE</p>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 ml-64">
                <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-primary">Lapak Sayur Pulungan</p>
                        <p className="text-xs text-text-secondary">Jagakarsa, Jakarta Selatan</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold">{auth?.user?.name}</p>
                        <p className="text-xs text-text-secondary">Owner/Admin Utama</p>
                    </div>
                </header>

                <main className="p-6">
                    {flash?.success && (
                        <div className="mb-4 bg-success-light text-success px-4 py-3 rounded-xl text-sm font-medium">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 bg-danger-light text-danger px-4 py-3 rounded-xl text-sm font-medium">
                            {flash.error}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
