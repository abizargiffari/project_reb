import { Head } from '@inertiajs/react';

/**
 * Layout halaman auth (Login / Register / dst):
 * - Mobile  : banner hijau tua di atas, form di bawah
 * - Desktop : dua panel. Panel tagline di kiri (Login) atau kanan (Register, prop `reverse`)
 */
function Leaf({ className = '', flip = false }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 120 120"
            className={`pointer-events-none absolute text-auth-mint/35 ${className}`}
            style={flip ? { transform: 'rotate(180deg)' } : undefined}
            fill="currentColor"
        >
            <path d="M-10 -10 H92 L100 104 C62 108 22 120 -10 98 Z" />
        </svg>
    );
}

const defaultTagline = (
    <>
        Sayur <em className="text-auth-mint">segar</em> setiap hari
        <br />
        Harga bersahabat!
    </>
);

export default function AuthenticatedLayout({
    title,
    children,
    tagline = defaultTagline,
    reverse = false,
}) {
    return (
        <div
            className={`flex min-h-screen flex-col font-jakarta ${
                reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
            }`}
        >
            <Head title={title} />

            {/* Panel tagline */}
            <aside className="relative flex overflow-hidden bg-auth-deep px-8 py-12 lg:min-h-screen lg:w-[46%] lg:items-center lg:px-12 lg:py-0">
                <Leaf className="-left-1 -top-1 h-24 w-24 lg:h-28 lg:w-28" />
                <Leaf flip className="-bottom-1 -right-1 hidden h-24 w-32 lg:block" />

                <h1 className="relative font-display text-4xl leading-[1.15] text-white sm:text-5xl lg:text-[52px]">
                    {tagline}
                </h1>
            </aside>

            {/* Panel form */}
            <main className="flex flex-1 flex-col bg-auth-paper px-6 py-10 sm:px-10 lg:px-16">
                <div
                    className={`mx-auto my-auto w-full max-w-[412px] ${
                        reverse ? 'xl:ml-[10%] xl:mr-auto' : 'xl:ml-[8%] xl:mr-auto'
                    }`}
                >
                    {children}
                </div>

                <footer className="mt-12 text-center text-xs leading-6 text-gray-500 lg:mt-auto">
                    <p>PT. Warung Sayur Pulungan</p>
                    <p>Beta Ver 2.0.1</p>
                </footer>
            </main>
        </div>
    );
}
