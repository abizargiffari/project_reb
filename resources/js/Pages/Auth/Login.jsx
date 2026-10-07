import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm } from '@inertiajs/react';

const inputClass =
    'block h-[54px] w-full rounded-2xl border border-[#ECECE4] bg-white px-7 text-sm text-gray-900 ' +
    'placeholder:text-gray-300 focus:border-auth-action focus:outline-none focus:ring-1 focus:ring-auth-action';

export default function Login({ status, canResetPassword }) {
    // Catatan: tabel users hanya punya kolom `email`, jadi kolom "Username"
    // di desain dikirim sebagai field `email` ke backend.
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthenticatedLayout title="Login">
            <h2 className="text-2xl font-semibold text-gray-950">Login</h2>

            {status && (
                <div className="mt-4 rounded-xl bg-success-light px-4 py-3 text-sm font-medium text-success">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="mt-8" noValidate>
                <div>
                    <label htmlFor="email" className="block text-sm text-gray-900">
                        Username
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Masukkan username anda"
                        autoComplete="username"
                        autoFocus
                        className={`${inputClass} mt-2`}
                        aria-invalid={errors.email ? 'true' : undefined}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-danger">{errors.email}</p>
                    )}
                </div>

                <div className="mt-6">
                    <label htmlFor="password" className="block text-sm text-gray-900">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Masukkan password anda"
                        autoComplete="current-password"
                        className={`${inputClass} mt-2`}
                        aria-invalid={errors.password ? 'true' : undefined}
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-danger">{errors.password}</p>
                    )}
                </div>

                {canResetPassword && (
                    <div className="mt-3 text-right">
                        <Link
                            href={route('password.request')}
                            className="text-xs text-gray-400 hover:text-auth-action"
                        >
                            Lupa Password?
                        </Link>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-6 h-[49px] w-full rounded-xl bg-auth-action text-base font-medium text-white transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-auth-action focus:ring-offset-2 focus:ring-offset-auth-paper disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? 'Memproses...' : 'Masuk'}
                </button>

                <p className="mt-6 text-right text-xs text-gray-400">
                    Belum punya akun?{' '}
                    <Link
                        href={route('register')}
                        className="font-medium text-auth-action hover:underline"
                    >
                        Daftar Sekarang!
                    </Link>
                </p>
            </form>
        </AuthenticatedLayout>
    );
}
