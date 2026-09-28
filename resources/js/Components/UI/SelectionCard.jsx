// Kartu pilihan (radio card). Dipakai untuk pilihan kloter dan metode pembayaran.
// Memakai <div role="radio"> (bukan <button>) supaya boleh berisi input di dalamnya.
export default function SelectionCard({ selected, onSelect, disabled = false, children, className = '' }) {
    function onKeyDown(e) {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
        }
    }

    return (
        <div
            role="radio"
            aria-checked={selected}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && onSelect()}
            onKeyDown={onKeyDown}
            className={`relative w-full rounded-xl2 border-2 bg-white p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                selected ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
        >
            {selected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                    ✓
                </span>
            )}
            {children}
        </div>
    );
}
