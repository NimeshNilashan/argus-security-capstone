/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: "#000000",
                    secondary: "#050505",
                    surface: "#0A0A0A",
                    elevated: "#0F0F0F",
                },
                accent: {
                    DEFAULT: "#22D3EE",
                    hover: "#67E8F9",
                    muted: "rgba(34, 211, 238, 0.12)",
                    border: "rgba(34, 211, 238, 0.30)",
                },
                border: {
                    DEFAULT: "rgba(255, 255, 255, 0.10)",
                    subtle: "rgba(255, 255, 255, 0.05)",
                    strong: "rgba(255, 255, 255, 0.16)",
                },
                status: {
                    success: "#34D399",
                    warning: "#FBBF24",
                    danger: "#F87171",
                    info: "#22D3EE",
                },
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                mono: ["IBM Plex Mono", "monospace"],
            },
            borderRadius: {
                DEFAULT: "4px",
            },
        },
    },
    plugins: [],
};