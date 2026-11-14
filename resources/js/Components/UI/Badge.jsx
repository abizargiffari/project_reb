export default function Badge({ children, color = 'primary', className = '' }) {
    const colorMap = {
        primary: 'bg-primary text-white',
        orange: 'bg-accent-orange text-white',
        success: 'bg-success-light text-success',
        danger: 'bg-danger-light text-danger',
        neutral: 'bg-gray-100 text-gray-600',
    };
    return (
        <span
            className={`inline-flex max-w-full items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold leading-tight sm:px-3 sm:py-1 sm:text-xs ${colorMap[color] ?? colorMap.neutral} ${className}`}
        >
            <span className="truncate">{children}</span>
        </span>
    );
}
