import type { ColorValue, ColorStyleValue } from '@/core/color.ts';

const defaultColor: ColorValue = '000000';

export const DEFAULT_ICON_COLOR: ColorValue = defaultColor;
export const DEFAULT_ACCOUNT_COLOR: ColorValue = defaultColor;
export const DEFAULT_CATEGORY_COLOR: ColorValue = defaultColor;

export const DEFAULT_COLOR_STYLE_VARIABLE: ColorStyleValue = 'var(--default-icon-color)';

const allAvailableColors: ColorValue[] = [
    // Grayscale
    '000000', // black
    '374151', // gray-700 (tailwind)
    '6b7280', // gray-500 (tailwind)
    '9ca3af', // gray-400 (tailwind)
    'd1d5db', // gray-300 (tailwind)
    
    // Red shades
    'dc2626', // red-600 (tailwind)
    'ef4444', // red-500 (tailwind)
    'f87171', // red-400 (tailwind)
    
    // Orange shades
    'ea580c', // orange-600 (tailwind)
    'f97316', // orange-500 (tailwind)
    'fb923c', // orange-400 (tailwind)
    
    // Amber/Yellow shades
    'd97706', // amber-600 (tailwind)
    'f59e0b', // amber-500 (tailwind)
    'fbbf24', // amber-400 (tailwind)
    'fde047', // yellow-300 (tailwind)
    
    // Lime shades
    '65a30d', // lime-600 (tailwind)
    '84cc16', // lime-500 (tailwind)
    'a3e635', // lime-400 (tailwind)
    
    // Green shades
    '16a34a', // green-600 (tailwind)
    '22c55e', // green-500 (tailwind)
    '4ade80', // green-400 (tailwind)
    '86efac', // green-300 (tailwind)
    
    // Emerald shades
    '059669', // emerald-600 (tailwind)
    '10b981', // emerald-500 (tailwind)
    '34d399', // emerald-400 (tailwind)
    
    // Teal shades
    '0d9488', // teal-600 (tailwind)
    '14b8a6', // teal-500 (tailwind)
    '2dd4bf', // teal-400 (tailwind)
    
    // Cyan shades
    '0891b2', // cyan-600 (tailwind)
    '06b6d4', // cyan-500 (tailwind)
    '22d3ee', // cyan-400 (tailwind)
    
    // Sky shades
    '0284c7', // sky-600 (tailwind)
    '0ea5e9', // sky-500 (tailwind)
    '38bdf8', // sky-400 (tailwind)
    
    // Blue shades
    '2563eb', // blue-600 (tailwind)
    '3b82f6', // blue-500 (tailwind)
    '60a5fa', // blue-400 (tailwind)
    
    // Indigo shades
    '4f46e5', // indigo-600 (tailwind)
    '6366f1', // indigo-500 (tailwind)
    '818cf8', // indigo-400 (tailwind)
    
    // Violet shades
    '7c3aed', // violet-600 (tailwind)
    '8b5cf6', // violet-500 (tailwind)
    'a78bfa', // violet-400 (tailwind)
    
    // Purple shades
    '9333ea', // purple-600 (tailwind)
    'a855f7', // purple-500 (tailwind)
    'c084fc', // purple-400 (tailwind)
    
    // Fuchsia shades
    'c026d3', // fuchsia-600 (tailwind)
    'd946ef', // fuchsia-500 (tailwind)
    'e879f9', // fuchsia-400 (tailwind)
    
    // Pink shades
    'db2777', // pink-600 (tailwind)
    'ec4899', // pink-500 (tailwind)
    'f472b6', // pink-400 (tailwind)
    
    // Rose shades
    'e11d48', // rose-600 (tailwind)
    'f43f5e', // rose-500 (tailwind)
    'fb7185', // rose-400 (tailwind)
];

export const ALL_ACCOUNT_COLORS: ColorValue[] = allAvailableColors;
export const ALL_CATEGORY_COLORS: ColorValue[] = allAvailableColors;

export const DEFAULT_CHART_COLORS: ColorValue[] = [
    'cc4a66',
    'e3564a',
    'fc892c',
    'ffc349',
    '4dd291',
    '24ceb3',
    '2ab4d0',
    '065786',
    '713670',
    '8e1d51'
];
