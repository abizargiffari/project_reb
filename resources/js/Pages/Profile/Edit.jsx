import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <CustomerLayout>
            <Head title="Profil Saya" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <h1 className="text-2xl font-bold text-primary">Profil & Keamanan</h1>
                <p className="mb-6 text-sm text-text-secondary">Kelola biodata, password, dan akun Anda.</p>

                <div className="space-y-6">
                    <div className="rounded-xl2 bg-white p-6 shadow-sm">
                        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
                    </div>
                    <div className="rounded-xl2 bg-white p-6 shadow-sm">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                    <div className="rounded-xl2 bg-white p-6 shadow-sm">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
