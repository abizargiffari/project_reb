import { router, usePage } from '@inertiajs/react';

/**
 * Tombol hati untuk menyimpan produk ke wishlist.
 * - variant "icon"  : lingkaran kecil di pojok kanan atas kartu produk (kartu induk harus `relative`).
 * - variant "label" : tombol bergaris dengan teks, dipakai di halaman detail produk.
 * Status (sudah disimpan atau belum) dibaca dari prop bersama `wishlistIds`
 * yang dikirim HandleInertiaRequests, jadi tidak ada query per kartu.
 */
export default function WishlistButton({ productId, variant = 'icon', className = '' }) {
    const { wishlistIds = [], auth } = usePage().props;
    const aktif = wishlistIds.includes(productId);

    function toggle(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            router.visit(route('login'));
            return;
        }

        if (aktif) {
            router.delete(route('wishlist.destroy', productId), { preserveScroll: true });
        } else {
            router.post(route('wishlist.store', productId), {}, { preserveScroll: true });
        }
    }

    const heart = (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill={aktif ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.35-9.33-8.5C.8 9.2 2.4 5.5 6 5.5c2 0 3.2 1.1 4 2.2.8-1.1 2-2.2 4-2.2 3.6 0 5.2 3.7 3.33 7C19 16.65 12 21 12 21z" />
        </svg>
    );

    if (variant === 'label') {
        return (
            <button
                type="button"
                onClick={toggle}
                aria-pressed={aktif}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    aktif ? 'border-danger bg-danger-light text-danger' : 'border-gray-200 text-gray-600 hover:border-danger hover:text-danger'
                } ${className}`}
            >
                {heart}
                {aktif ? 'Tersimpan di Wishlist' : 'Simpan ke Wishlist'}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={aktif}
            aria-label={aktif ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
            className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition ${
                aktif ? 'text-danger' : 'text-gray-400 hover:text-danger'
            } ${className}`}
        >
            {heart}
        </button>
    );
}
