import { Link, usePage } from '@inertiajs/react';

export default function CustomerLayout({ children }) {
    const { auth, flash } = usePage().props;

    return (
        <div className="min-h-screen bg-cream flex flex-col">
            {/* Top utility bar */}
            <div className="bg-primary text-white text-xs py-1.5 px-4 text-center">
                Jadwal Subuh: Pengiriman kloter 1 jam 06.00 WIB • Area Ciganjur, Jagakarsa & Sekitarnya
            </div>

            {/* Navbar */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <Link href={route('home')} className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-primary" />
                        <div>
                            <p className="font-bold text-primary leading-tight">Sayur Pulungan</p>
                            <p className="text-[10px] text-text-secondary">SEGAR SETIAP PAGI • AREA</p>
                        </div>
                    </Link>

                    <input
                        type="text"
                        placeholder="Cari bayam, kangkung"
                        className="flex-1 max-w-md rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    />

                    <nav className="flex items-center gap-4 text-sm">
                        <Link href={route('wishlist.index')} className="text-gray-600 hover:text-primary">Wishlist</Link>
                        <Link href={route('cart.index')} className="text-gray-600 hover:text-primary">Keranjang</Link>
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="font-semibold text-primary">{auth.user.name}</Link>
                        ) : (
                            <Link href={route('login')} className="font-semibold text-primary">Masuk</Link>
                        )}
                    </nav>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
                    <Link href={route('catalog.index')} className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium whitespace-nowrap">
                        Semua Sayur
                    </Link>
                </div>
            </header>

            {flash?.success && (
                <div className="max-w-7xl mx-auto w-full px-4 pt-4">
                    <div className="bg-success-light text-success px-4 py-3 rounded-xl text-sm font-medium">{flash.success}</div>
                </div>
            )}

            <main className="flex-1">{children}</main>

            <footer className="bg-primary text-white mt-12">
                <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                    <div>
                        <p className="font-bold">Sayur Pulungan</p>
                        <p className="text-white/70 mt-2">Segar Setiap Pagi dari Petani Lokal ke Dapur Warga</p>
                    </div>
                    <div>
                        <p className="font-bold mb-2">Layanan & Informasi</p>
                        <Link href={route('about')} className="block text-white/70 hover:text-white">Tentang Kami</Link>
                        <Link href={route('faq')} className="block text-white/70 hover:text-white">FAQ</Link>
                        <Link href={route('contact')} className="block text-white/70 hover:text-white">Kontak</Link>
                    </div>
                    <div>
                        <p className="font-bold mb-2">Kebijakan</p>
                        <Link href={route('terms')} className="block text-white/70 hover:text-white">Syarat & Ketentuan</Link>
                        <Link href={route('privacy')} className="block text-white/70 hover:text-white">Kebijakan Privasi</Link>
                    </div>
                    <div>
                        <p className="font-bold mb-2">Blog</p>
                        <Link href={route('blog.index')} className="block text-white/70 hover:text-white">Artikel & Promo</Link>
                    </div>
                </div>
                <div className="text-center text-xs text-white/60 py-4 border-t border-white/10">
                    © {new Date().getFullYear()} Warung Sayur Pulungan
                </div>
            </footer>
        </div>
    );
}
