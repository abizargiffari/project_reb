export const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');
export const jam = (t) => (t ? String(t).slice(0, 5) : '');

// "0812-3456-7890" / "+62 812..." -> "https://wa.me/628123456789"
export const waUrl = (nomor) => {
    let digit = String(nomor ?? '').replace(/\D/g, '');
    if (!digit) return null;
    if (digit.startsWith('0')) digit = '62' + digit.slice(1);
    return `https://wa.me/${digit}`;
};

// Admin boleh mengisi "@warungsayur" ATAU URL penuh; keduanya diubah jadi URL yang benar.
export const sosmedUrl = (platform, nilai) => {
    const v = String(nilai ?? '').trim();
    if (!v) return null;
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${platform}.com/${v.replace(/^@/, '')}`;
};

export const mapsEmbedUrl = (alamat) => `https://www.google.com/maps?q=${encodeURIComponent(alamat)}&output=embed`;
export const mapsOpenUrl = (alamat) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamat)}`;
