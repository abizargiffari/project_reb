import { rupiah, sosmedUrl, waUrl } from '@/Utils/format';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Didefinisikan di luar komponen utama supaya input tidak kehilangan fokus tiap render.
function SearchForm({ className = '' }) {
    const [q, setQ] = useState(() =>
        typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') ?? '' : ''
    );

    function submit(e) {
        e.preventDefault();
        const kata = q.trim();
        router.get(route('catalog.index'), kata ? { q: kata } : {});
    }

    return (
        <form onSubmit={submit} role="search" className={className}>
            <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari bayam, kangkung"
                aria-label="Cari produk"
                className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
        </form>
    );
}

function Badge({ n }) {
    if (!n) return null;
    return (
        <span className="ml-1 rounded-full bg-accent-orange px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{n}</span>
    );
}

export default function CustomerLayout({ children }) {
    const { auth, flash, cartCount = 0, wishlistIds = [], toko = {}, pesananMenungguBayar } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    const wa = waUrl(toko.whatsapp || toko.telepon);
    const ig = sosmedUrl('instagram', toko.instagram);
    const fb = sosmedUrl('facebook', toko.facebook);
    const area = toko.area_layanan || 'Ciganjur, Jagakarsa & Sekitarnya';

    const linkAkun = [
        { label: 'Profil & Password', href: route('profile.edit') },
        { label: 'Riwayat Pesanan', href: route('account.orders') },
        { label: 'Alamat Pengiriman', href: route('account.addresses') },
        { label: 'Ulasan Saya', href: route('account.testimonials.index') },
    ];

    return (
        <div className="min-h-screen bg-cream flex flex-col">
            {/* Top utility bar */}
            <div className="bg-primary text-white text-xs py-1.5 px-4 text-center">
                Jadwal Subuh: Pengiriman kloter 1 jam 06.00 WIB • Area {area}
            </div>

            {/* Navbar */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <Link href={route('home')} className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-primary" />
                        <div>
                            <p className="font-bold text-primary leading-tight">Sayur Pulungan</p>
                            <p className="text-[10px] text-text-secondary">SEGAR SETIAP PAGI • AREA</p>
                        </div>
                    </Link>

                    <SearchForm className="hidden md:block flex-1 max-w-md" />

                    <nav className="flex items-center gap-3 text-sm">
                        <Link href={route('wishlist.index')} className="flex items-center text-gray-600 hover:text-primary" aria-label="Wishlist">
                            <span aria-hidden="true" className="text-xl leading-none md:text-base">♡</span>
                            <span className="ml-1 hidden md:inline">Wishlist</span>
                            <Badge n={wishlistIds.length} />
                        </Link>
                        <Link href={route('cart.index')} className="flex items-center text-gray-600 hover:text-primary" aria-label="Keranjang">
                            🛒<Badge n={cartCount} />
                        </Link>

                        {auth?.user ? (
                            <Menu as="div" className="relative hidden md:block">
                                <MenuButton className="flex items-center gap-1 font-semibold text-primary">
                                    {auth.user.name} <span aria-hidden="true" className="text-xs">▾</span>
                                </MenuButton>
                                <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                    {linkAkun.map((l) => (
                                        <MenuItem key={l.label}>
                                            {({ focus }) => (
                                                <Link href={l.href} className={`block px-4 py-2 text-sm ${focus ? 'bg-cream' : ''}`}>{l.label}</Link>
                                            )}
                                        </MenuItem>
                                    ))}
                                    {auth.user.role === 'admin' && (
                                        <MenuItem>
                                            {({ focus }) => <Link href={route('admin.dashboard')} className={`block px-4 py-2 text-sm font-semibold text-primary ${focus ? 'bg-cream' : ''}`}>Panel Admin</Link>}
                                        </MenuItem>
                                    )}
                                    {auth.user.role === 'kurir' && (
                                        <MenuItem>
                                            {({ focus }) => <Link href={route('kurir.route.index')} className={`block px-4 py-2 text-sm font-semibold text-primary ${focus ? 'bg-cream' : ''}`}>Panel Kurir</Link>}
                                        </MenuItem>
                                    )}
                                    <div className="my-1 border-t border-gray-100" />
                                    <MenuItem>
                                        {({ focus }) => (
                                            <Link href={route('logout')} method="post" as="button" className={`block w-full px-4 py-2 text-left text-sm text-danger ${focus ? 'bg-cream' : ''}`}>
                                                Keluar
                                            </Link>
                                        )}
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        ) : (
                            <Link href={route('login')} className="hidden md:block font-semibold text-primary">Masuk</Link>
                        )}

                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden rounded-lg border border-gray-200 px-2.5 py-1.5 text-gray-600"
                            aria-label="Buka menu"
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? '✕' : '☰'}
                        </button>
                    </nav>
                </div>

                {/* Menu mobile */}
                {menuOpen && (
                    <div className="md:hidden border-t border-gray-100 px-4 py-3 space-y-3">
                        <SearchForm />
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <Link href={route('catalog.index')} className="rounded-lg bg-cream px-3 py-2 font-medium">Semua Sayur</Link>
                            <Link href={route('promo.index')} className="rounded-lg bg-cream px-3 py-2 font-medium">Promo & Diskon</Link>
                            <Link href={route('blog.index')} className="rounded-lg bg-cream px-3 py-2 font-medium">Blog</Link>
                            <Link href={route('how-to-order')} className="rounded-lg bg-cream px-3 py-2 font-medium">Cara Pemesanan</Link>
                        </div>
                        {auth?.user ? (
                            <div className="space-y-1 border-t border-gray-100 pt-3 text-sm">
                                <p className="font-bold text-primary">{auth.user.name}</p>
                                {linkAkun.map((l) => (
                                    <Link key={l.label} href={l.href} className="block py-1.5">{l.label}</Link>
                                ))}
                                {auth.user.role === 'admin' && <Link href={route('admin.dashboard')} className="block py-1.5 font-semibold text-primary">Panel Admin</Link>}
                                {auth.user.role === 'kurir' && <Link href={route('kurir.route.index')} className="block py-1.5 font-semibold text-primary">Panel Kurir</Link>}
                                <Link href={route('logout')} method="post" as="button" className="block py-1.5 text-danger">Keluar</Link>
                            </div>
                        ) : (
                            <Link href={route('login')} className="block rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-white">Masuk / Daftar</Link>
                        )}
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 pb-3 hidden md:flex gap-2 overflow-x-auto">
                    <Link href={route('catalog.index')} className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium whitespace-nowrap">
                        Semua Sayur
                    </Link>
                    <Link href={route('promo.index')} className="px-4 py-1.5 rounded-full bg-accent-orange text-white text-sm font-medium whitespace-nowrap">
                        Promo & Diskon
                    </Link>
                    <Link href={route('blog.index')} className="px-4 py-1.5 rounded-full bg-cream text-gray-700 text-sm font-medium whitespace-nowrap">
                        Blog
                    </Link>
                    <Link href={route('how-to-order')} className="px-4 py-1.5 rounded-full bg-cream text-gray-700 text-sm font-medium whitespace-nowrap">
                        Cara Pemesanan
                    </Link>
                </div>
            </header>

            {pesananMenungguBayar && !route().current('checkout.success') && (
                <div className="border-b border-orange-100 bg-orange-50">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 text-sm">
                        <p className="min-w-0 text-orange-900">
                            <strong>Menunggu pembayaran:</strong>{' '}
                            {pesananMenungguBayar.jumlah > 1
                                ? `${pesananMenungguBayar.jumlah} pesanan belum dibayar`
                                : `pesanan ${pesananMenungguBayar.order_number} • ${rupiah(pesananMenungguBayar.total)}`}
                        </p>
                        <Link
                            href={pesananMenungguBayar.jumlah > 1 ? route('account.orders') : route('checkout.success', pesananMenungguBayar.id)}
                            className="whitespace-nowrap rounded-lg bg-accent-orange px-3 py-1.5 text-xs font-bold text-white"
                        >
                            {pesananMenungguBayar.jumlah > 1 ? 'Lihat Pesanan' : 'Bayar Sekarang'}
                        </Link>
                    </div>
                </div>
            )}

            {flash?.success && (
                <div className="max-w-7xl mx-auto w-full px-4 pt-4">
                    <div role="status" className="bg-success-light text-success px-4 py-3 rounded-xl text-sm font-medium">{flash.success}</div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto w-full px-4 pt-4">
                    <div role="alert" className="bg-danger-light text-danger px-4 py-3 rounded-xl text-sm font-medium">{flash.error}</div>
                </div>
            )}

            <main className="flex-1">{children}</main>

            <footer className="bg-primary text-white mt-12">
                <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                    <div className="col-span-2 md:col-span-1">
                        <p className="font-bold">{toko.nama || 'Sayur Pulungan'}</p>
                        <p className="text-white/70 mt-2">{toko.tagline || 'Segar Setiap Pagi dari Petani Lokal ke Dapur Warga'}</p>
                    </div>
                    <div>
                        <p className="font-bold mb-2">Layanan & Informasi</p>
                        <Link href={route('about')} className="block text-white/70 hover:text-white">Tentang Kami</Link>
                        <Link href={route('how-to-order')} className="block text-white/70 hover:text-white">Cara Pemesanan</Link>
                        <Link href={route('faq')} className="block text-white/70 hover:text-white">FAQ</Link>
                        <Link href={route('contact')} className="block text-white/70 hover:text-white">Kontak</Link>
                        <Link href={route('blog.index')} className="block text-white/70 hover:text-white">Blog & Artikel</Link>
                    </div>
                    <div>
                        <p className="font-bold mb-2">Kebijakan</p>
                        <Link href={route('terms')} className="block text-white/70 hover:text-white">Syarat & Ketentuan</Link>
                        <Link href={route('privacy')} className="block text-white/70 hover:text-white">Kebijakan Privasi</Link>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <p className="font-bold mb-2">Hubungi Kami</p>
                        {toko.alamat && <p className="text-white/70">{toko.alamat}</p>}
                        {toko.telepon && <a href={`tel:${toko.telepon}`} className="mt-1 block text-white/70 hover:text-white">{toko.telepon}</a>}
                        {toko.email && <a href={`mailto:${toko.email}`} className="block text-white/70 hover:text-white">{toko.email}</a>}
                        {toko.jam_operasional && <p className="mt-1 text-white/70">Buka {toko.jam_operasional}</p>}
                        {(wa || ig || fb) && (
                            <div className="mt-2 flex gap-3">
                                {wa && <a href={wa} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white">WhatsApp</a>}
                                {ig && <a href={ig} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white">Instagram</a>}
                                {fb && <a href={fb} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white">Facebook</a>}
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center text-xs text-white/60 py-4 border-t border-white/10">
                    © {new Date().getFullYear()} {toko.nama || 'Warung Sayur Pulungan'}
                </div>
            </footer>
        </div>
    );
}
