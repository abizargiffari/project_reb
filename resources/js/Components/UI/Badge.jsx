export default function Badge({ children, color = 'primary', className = '' }) {
    const colorMap = {
        primary: 'bg-primary text-white',
        orange: 'bg-accent-orange text-white',
        success: 'bg-success-light text-success',
        danger: 'bg-danger-light text-danger',
        neutral: 'bg-gray-100 text-gray-600',
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorMap[color] ?? colorMap.neutral} ${className}`}>
            {children}
        </span>
    );
}
