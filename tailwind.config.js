/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
    "./renderer/app/**/*.{js,ts,jsx,tsx}",
    "./renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
