import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm } from '@inertiajs/react';

const inputClass =
    'mt-2 block h-[54px] w-full rounded-2xl border border-[#ECECE4] bg-white px-7 text-sm text-gray-900 ' +
    'placeholder:text-gray-300 focus:border-auth-action focus:outline-none focus:ring-1 focus:ring-auth-action';

function Field({ id, label, error, className = '', ...props }) {
    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm text-gray-900">
                {label}
            </label>
            <input
                id={id}
                name={id}
                className={inputClass}
                aria-invalid={error ? 'true' : undefined}
                {...props}
            />
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </div>
    );
}

export default function Register() {
    // "Username" di desain disimpan ke kolom `name` (satu-satunya kolom nama di tabel users).
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthenticatedLayout
            title="Daftar"
            reverse
                
        >
            <h2 className="text-2xl font-semibold text-gray-950">Daftar Sekarang</h2>
            <p className="mt-4 text-sm text-gray-900">
                Sudah punya akun?{' '}
                <Link href={route('login')} className="text-auth-action hover:underline">
                    Masuk
                </Link>
            </p>

            <form onSubmit={submit} className="mt-8" noValidate>
                <Field
                    id="name"
                    label="Username"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Masukkan username anda"
                    autoComplete="username"
                    autoFocus
                    error={errors.name}
                />

                <Field
                    id="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Masukkan email anda"
                    autoComplete="email"
                    error={errors.email}
                    className="mt-6"
                />

                <Field
                    id="password"
                    label="Password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Buatkan password anda"
                    autoComplete="new-password"
                    error={errors.password}
                    className="mt-6"
                />

                <Field
                    id="password_confirmation"
                    label="Konfirmasi Password"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder="Ulangi password anda"
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                    className="mt-6"
                />

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-8 h-[49px] w-full rounded-xl bg-auth-action text-base font-medium text-white transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-auth-action focus:ring-offset-2 focus:ring-offset-auth-paper disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? 'Memproses...' : 'Daftar'}
                </button>
            </form>
        </AuthenticatedLayout>
    );
}
