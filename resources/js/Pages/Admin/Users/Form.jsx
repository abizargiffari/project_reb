import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

function Field({ label, required, error, children }) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5">{label} {required && <span className="text-danger">*</span>}</label>
            {children}
            {error && <p className="text-xs text-danger mt-1">{error}</p>}
        </div>
    );
}

export default function Form({ user }) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        role: user?.role ?? 'staff',
        password: '',
        plat_motor: user?.courier_profile?.plat_motor ?? '',
        kapasitas_muat: user?.courier_profile?.kapasitas_muat ?? '',
        status_aktif: user?.courier_profile?.status_aktif ?? true,
    });

    function submit(e) {
        e.preventDefault();
        if (isEdit) put(route('admin.pengguna.update', user.id));
        else post(route('admin.pengguna.store'));
    }

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'} />
            <h1 className="text-2xl font-bold text-primary mb-6">{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h1>

            <form onSubmit={submit} className="bg-white rounded-xl2 shadow-sm p-6 max-w-xl">
                <Field label="Nama Lengkap" required error={errors.name}>
                    <input className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Email" required error={errors.email}>
                        <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    </Field>
                    <Field label="Telepon" error={errors.phone}>
                        <input className={inputClass} value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    </Field>
                </div>

                <Field label="Role" required error={errors.role}>
                    <select className={inputClass} value={data.role} onChange={(e) => setData('role', e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="kurir">Kurir</option>
                    </select>
                </Field>

                {data.role === 'kurir' && (
                    <div className="bg-cream rounded-xl p-4 mb-4">
                        <p className="text-xs font-semibold text-primary mb-3">Detail Profil Kurir</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Plat Motor" error={errors.plat_motor}>
                                <input className={inputClass} value={data.plat_motor} onChange={(e) => setData('plat_motor', e.target.value)} />
                            </Field>
                            <Field label="Kapasitas Muat" error={errors.kapasitas_muat}>
                                <input type="number" className={inputClass} value={data.kapasitas_muat} onChange={(e) => setData('kapasitas_muat', e.target.value)} />
                            </Field>
                        </div>
                        {isEdit && (
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={data.status_aktif} onChange={(e) => setData('status_aktif', e.target.checked)} />
                                Kurir aktif bertugas
                            </label>
                        )}
                    </div>
                )}

                <Field label={isEdit ? 'Password Baru (kosongkan jika tidak diganti)' : 'Password'} required={!isEdit} error={errors.password}>
                    <input type="password" className={inputClass} value={data.password} onChange={(e) => setData('password', e.target.value)} />
                </Field>

                <button type="submit" disabled={processing} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                    {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </button>
            </form>
        </AdminLayout>
    );
}
