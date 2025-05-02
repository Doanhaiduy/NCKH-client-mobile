/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            animation: {
                bounce: 'bounce 0.6s infinite alternate',
            },
            keyframes: {
                bounce: {
                    '0%': {
                        transform: 'translateY(0)',
                        opacity: '0.6',
                    },
                    '100%': {
                        transform: 'translateY(-4px)',
                        opacity: '1',
                    },
                },
            },
        },
        colors: {
            black: '#000000',
            white: '#ffffff',
            transparent: 'transparent',
            primary: {
                100: '#EDEDFA',
                200: '#235DF4',
                300: '#1479FD',
                400: '#030099',
                500: '#030099',
            },
            text: {
                100: '#F2F2F2',
                200: '#CCCCCC',
                300: '#ACACAC',
                400: '#666666',
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
