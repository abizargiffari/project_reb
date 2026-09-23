import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ categories, product }) {
    const isEdit = !!product;

    const { data, setData, post, processing, errors } = useForm({
        category_id: product?.category_id ?? '',
        nama: product?.nama ?? '',
        deskripsi: product?.deskripsi ?? '',
        satuan: product?.satuan ?? 'ikat',
        harga_jual: product?.harga_jual ?? '',
        harga_modal: product?.harga_modal ?? '',
        harga_coret: product?.harga_coret ?? '',
        stok: product?.stok ?? 0,
        stok_minimum: product?.stok_minimum ?? 5,
        badge: product?.badge ?? '',
        catatan_stok: product?.catatan_stok ?? '',
        status: product?.status ?? 'aktif',
        gambar: null,
        _method: isEdit ? 'put' : 'post',
    });

    function submit(e) {
        e.preventDefault();
        const url = isEdit ? route('admin.produk.update', product.id) : route('admin.produk.store');
        post(url, { forceFormData: true });
    }

    function Field({ label, error, required, children }) {
        return (
            <div className="mb-4">
                <label className="block text-xs font-semibold mb-1.5">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
                {children}
                {error && <p className="text-xs text-danger mt-1">{error}</p>}
            </div>
        );
    }

    const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Produk' : 'Tambah Produk'} />

            <h1 className="text-2xl font-bold text-primary mb-1">{isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h1>
            <p className="text-sm text-text-secondary mb-6">Isi detail produk sesuai kondisi pasokan subuh hari ini.</p>

            <form onSubmit={submit} className="bg-white rounded-xl2 shadow-sm p-6 max-w-2xl">
                <Field label="Nama Produk" required error={errors.nama}>
                    <input className={inputClass} value={data.nama} onChange={(e) => setData('nama', e.target.value)} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Kategori" required error={errors.category_id}>
                        <select className={inputClass} value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}>
                            <option value="">Pilih kategori</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
                        </select>
                    </Field>
                    <Field label="Satuan" required error={errors.satuan}>
                        <select className={inputClass} value={data.satuan} onChange={(e) => setData('satuan', e.target.value)}>
                            {['ikat', 'kg', 'gram', 'bungkus', 'paket', 'papan'].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </Field>
                </div>

                <Field label="Deskripsi" error={errors.deskripsi}>
                    <textarea className={inputClass} rows={3} value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} />
                </Field>

                <div className="grid grid-cols-3 gap-4">
                    <Field label="Harga Modal (Rp)" required error={errors.harga_modal}>
                        <input type="number" className={inputClass} value={data.harga_modal} onChange={(e) => setData('harga_modal', e.target.value)} />
                    </Field>
                    <Field label="Harga Jual (Rp)" required error={errors.harga_jual}>
                        <input type="number" className={inputClass} value={data.harga_jual} onChange={(e) => setData('harga_jual', e.target.value)} />
                    </Field>
                    <Field label="Harga Coret (Rp)" error={errors.harga_coret}>
                        <input type="number" className={inputClass} value={data.harga_coret} onChange={(e) => setData('harga_coret', e.target.value)} />
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Stok Saat Ini" required error={errors.stok}>
                        <input type="number" className={inputClass} value={data.stok} onChange={(e) => setData('stok', e.target.value)} />
                    </Field>
                    <Field label="Ambang Batas Stok Kritis" required error={errors.stok_minimum}>
                        <input type="number" className={inputClass} value={data.stok_minimum} onChange={(e) => setData('stok_minimum', e.target.value)} />
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Badge (opsional)" error={errors.badge}>
                        <input className={inputClass} placeholder="Dipetik Subuh, Diskon Pagi, dll" value={data.badge} onChange={(e) => setData('badge', e.target.value)} />
                    </Field>
                    <Field label="Catatan Stok (opsional)" error={errors.catatan_stok}>
                        <input className={inputClass} placeholder="Stok Segar Melimpah" value={data.catatan_stok} onChange={(e) => setData('catatan_stok', e.target.value)} />
                    </Field>
                </div>

                <Field label="Status" required error={errors.status}>
                    <select className={inputClass} value={data.status} onChange={(e) => setData('status', e.target.value)}>
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                    </select>
                </Field>

                <Field label={`Gambar Produk ${isEdit ? '(kosongkan jika tidak diganti)' : ''}`} error={errors.gambar}>
                    <input type="file" accept="image/*" onChange={(e) => setData('gambar', e.target.files[0])} />
                    {isEdit && product.gambar && (
                        <img src={`/storage/${product.gambar}`} alt={product.nama} className="w-24 h-24 object-cover rounded-lg mt-2" />
                    )}
                </Field>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark disabled:opacity-50"
                >
                    {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
            </form>
        </AdminLayout>
    );
}
