import AdminLayout from '@/Layouts/AdminLayout';
import { rupiah } from '@/Utils/format';
import { Head, useForm } from '@inertiajs/react';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

function Field({ label, error, children }) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5">{label}</label>
            {children}
            {error && <p className="text-xs text-danger mt-1">{error}</p>}
        </div>
    );
}

export default function Form({ package: pkg, produkTersedia }) {
    const isEdit = !!pkg;

    const { data, setData, post, processing, errors } = useForm({
        nama: pkg?.nama ?? '',
        deskripsi: pkg?.deskripsi ?? '',
        harga_diskon: pkg?.harga_diskon ?? '',
        harga_coret: pkg?.harga_coret ?? '',
        badge: pkg?.badge ?? '',
        aktif: pkg?.status !== 'nonaktif',
        gambar: null,
        items: pkg?.items?.map((i) => ({ product_id: i.product_id, qty: i.qty })) ?? [{ product_id: '', qty: 1 }],
        _method: isEdit ? 'put' : 'post',
    });

    function tambahBaris() {
        setData('items', [...data.items, { product_id: '', qty: 1 }]);
    }

    function hapusBaris(idx) {
        setData('items', data.items.filter((_, i) => i !== idx));
    }

    function ubahBaris(idx, field, value) {
        const baru = [...data.items];
        baru[idx] = { ...baru[idx], [field]: value };
        setData('items', baru);
    }

    function hargaProduk(id) {
        return produkTersedia.find((p) => p.id === Number(id))?.harga_jual ?? 0;
    }

    const totalHargaSatuan = data.items.reduce((sum, i) => sum + hargaProduk(i.product_id) * (Number(i.qty) || 0), 0);

    function submit(e) {
        e.preventDefault();
        const url = isEdit ? route('admin.paket.update', pkg.id) : route('admin.paket.store');
        post(url, { forceFormData: true });
    }

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Paket' : 'Buat Paket'} />
            <h1 className="text-2xl font-bold text-primary mb-6">{isEdit ? 'Edit Paket' : 'Buat Paket Baru'}</h1>

            <form onSubmit={submit} className="bg-white rounded-xl2 shadow-sm p-6 max-w-2xl">
                <Field label="Nama Paket" error={errors.nama}>
                    <input className={inputClass} value={data.nama} onChange={(e) => setData('nama', e.target.value)} />
                </Field>
                <Field label="Deskripsi" error={errors.deskripsi}>
                    <textarea rows={2} className={inputClass} value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                    <Field label="Harga Diskon Paket (Rp)" error={errors.harga_diskon}>
                        <input type="number" className={inputClass} value={data.harga_diskon} onChange={(e) => setData('harga_diskon', e.target.value)} />
                    </Field>
                    <Field label="Harga Coret (Rp, opsional)" error={errors.harga_coret}>
                        <input type="number" className={inputClass} value={data.harga_coret} onChange={(e) => setData('harga_coret', e.target.value)} />
                    </Field>
                </div>

                <Field label="Badge (opsional)" error={errors.badge}>
                    <input className={inputClass} placeholder="Paling Favorit" value={data.badge} onChange={(e) => setData('badge', e.target.value)} />
                </Field>

                <div className="bg-cream rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-primary">Isi Paket</p>
                        <button type="button" onClick={tambahBaris} className="text-xs font-semibold text-primary">+ Tambah Produk</button>
                    </div>

                    {data.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 mb-2 items-start">
                            <select className={inputClass} value={item.product_id} onChange={(e) => ubahBaris(idx, 'product_id', e.target.value)}>
                                <option value="">Pilih produk</option>
                                {produkTersedia.map((p) => <option key={p.id} value={p.id}>{p.nama} ({rupiah(p.harga_jual)}/{p.satuan})</option>)}
                            </select>
                            <input type="number" min="1" className={inputClass + ' w-20'} value={item.qty} onChange={(e) => ubahBaris(idx, 'qty', e.target.value)} />
                            {data.items.length > 1 && (
                                <button type="button" onClick={() => hapusBaris(idx)} className="text-danger text-sm px-2">✕</button>
                            )}
                        </div>
                    ))}
                    {errors.items && <p className="text-xs text-danger mt-1">{errors.items}</p>}

                    {totalHargaSatuan > 0 && (
                        <p className="text-xs text-text-secondary mt-2">
                            Total harga satuan kalau dibeli eceran: <strong>{rupiah(totalHargaSatuan)}</strong>
                            {data.harga_diskon > 0 && totalHargaSatuan > data.harga_diskon && (
                                <span className="text-success"> (hemat {rupiah(totalHargaSatuan - data.harga_diskon)})</span>
                            )}
                        </p>
                    )}
                </div>

                <Field label={`Gambar Paket ${isEdit ? '(kosongkan jika tidak diganti)' : ''}`} error={errors.gambar}>
                    <input type="file" accept="image/*" onChange={(e) => setData('gambar', e.target.files[0])} />
                    {isEdit && pkg.gambar && <img src={`/storage/${pkg.gambar}`} alt="" className="w-32 h-20 object-cover rounded-lg mt-2" />}
                </Field>

                <label className="flex items-center gap-2 text-sm mb-5">
                    <input type="checkbox" checked={data.aktif} onChange={(e) => setData('aktif', e.target.checked)} />
                    Paket aktif (tampil di beranda & katalog)
                </label>

                <button type="submit" disabled={processing} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                    {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Paket'}
                </button>
            </form>
        </AdminLayout>
    );
}
