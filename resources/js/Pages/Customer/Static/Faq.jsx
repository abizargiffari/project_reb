import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

function ItemFaq({ faq }) {
    const [buka, setBuka] = useState(false);
    return (
        <div className="border-b border-gray-100 py-3">
            <button onClick={() => setBuka(!buka)} className="w-full flex items-center justify-between text-left">
                <span className="font-semibold text-sm">{faq.pertanyaan}</span>
                <span className="text-primary">{buka ? '−' : '+'}</span>
            </button>
            {buka && <p className="text-sm text-text-secondary mt-2">{faq.jawaban}</p>}
        </div>
    );
}

export default function Faq({ faqsByKategori }) {
    return (
        <CustomerLayout>
            <Head title="FAQ — Pertanyaan Umum" />
            <div className="mx-auto max-w-2xl px-4 py-8">
                <h1 className="text-2xl font-bold text-primary mb-6">Pertanyaan yang Sering Ditanyakan</h1>

                {Object.keys(faqsByKategori).length === 0 && <p className="text-text-secondary">Belum ada FAQ.</p>}

                {Object.entries(faqsByKategori).map(([kategori, faqs]) => (
                    <div key={kategori} className="bg-white rounded-xl2 shadow-sm p-5 mb-4">
                        <p className="font-bold text-primary mb-2">{kategori}</p>
                        {faqs.map((f) => <ItemFaq key={f.id} faq={f} />)}
                    </div>
                ))}
            </div>
        </CustomerLayout>
    );
}
