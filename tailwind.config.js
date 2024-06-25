/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
        colors: {
            black: '#000000',
            white: '#ffffff',
            transparent: 'transparent',
            primary: {
                300: '#4BB4DE',
                400: '#235DF4',
                500: '#3B8AC4',
                800: '#1479FD',
                900: '#345DA7',
            },
            text: {
                500: '#CCCCCC',
                600: '#F2F2F2',
                700: '#999999',
                800: '#666666',
                900: '#333333',
            },
            error: '#FF0000',
            success: '#00FF00',
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
            inter: ['Inter', 'sans-serif'],
            interMd: ['InterMd', 'sans-serif'],
            interSemi: ['InterSemi', 'sans-serif'],
            poppinsSemi: ['PoppinsSemi', 'sans-serif'],
        },
    },
    plugins: [],
};
