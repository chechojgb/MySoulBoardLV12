import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.tsx',
        './node_modules/flowbite/**/*.js',
    ],

    theme: {
        extend: {
            colors: {
                DarkPrimary: "#1C1C1B",
                primary: "#51B0CB",
                secondary: "#F6F4F0",
                input: "#D9D9D9",
            },
            fontFamily: {
                sans: ['Poppins', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [
        forms,
        tailwindcss(),
    ],
};
