export const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');
export const jam = (t) => (t ? String(t).slice(0, 5) : '');
