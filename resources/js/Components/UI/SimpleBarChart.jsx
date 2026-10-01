import { rupiah } from '@/Utils/format';

/**
 * Grafik batang minimal pakai CSS murni (flexbox + tinggi persentase) — sengaja TIDAK memakai
 * library chart (recharts/chart.js dkk) supaya tidak menambah dependency npm baru hanya untuk
 * satu grafik tren omzet sederhana. Kalau nanti butuh chart yang jauh lebih kompleks
 * (multi-series, zoom, dsb), baru pertimbangkan pasang library sungguhan.
 */
export default function SimpleBarChart({ data, labelKey, valueKey, formatValue = rupiah, height = 160 }) {
    const max = Math.max(...data.map((d) => d[valueKey]), 1);

    return (
        <div>
            <div className="flex items-end gap-1.5" style={{ height }}>
                {data.map((d, i) => {
                    const tinggiPersen = Math.max((d[valueKey] / max) * 100, 2);
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition text-[10px] font-semibold bg-primary text-white rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                                {formatValue(d[valueKey])}
                            </div>
                            <div
                                className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all"
                                style={{ height: `${tinggiPersen}%` }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex gap-1.5 mt-1.5">
                {data.map((d, i) => (
                    <div key={i} className="flex-1 text-center text-[10px] text-text-secondary truncate">
                        {d[labelKey]}
                    </div>
                ))}
            </div>
        </div>
    );
}
