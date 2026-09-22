import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E4D3B', // hijau tua utama
          dark:    '#173C2E',
          light:   '#2C5F4A',
        },
        accent: {
          orange: '#E8873A', // aksen oranye (CTA, badge favorit)
        },
        success: {
          light: '#DFF3E7', // latar badge hijau muda (Terverifikasi, Lunas)
            DEFAULT: '#2C5F4A',
        },
        danger: {
          DEFAULT: '#D9432E', // stok habis, kas keluar
            light: '#FBE4E0',
        },
        cream: '#F6F1E7', // background utama
        surface: '#FFFFFF', // kartu/putih
        'text-secondary': '#6B7A72', // abu-abu kehijauan untuk deskripsi
      },
      borderRadius: {
        xl2: '1.25rem', // sudut membulat khas kartu produk
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], // atau font pilihanmu
      },
    },
  },
  plugins: [],
}