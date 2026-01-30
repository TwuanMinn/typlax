import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Primary palette (Landing/UI)
                primary: {
                    bg: '#0f0f1e',
                    text: '#e8e8f0',
                    glow: '#6b5fff',
                },
                accent: {
                    success: '#4ade80',
                    error: '#f87171',
                    warning: '#fbbf24',
                },
                // Mode-specific palettes
                tree: {
                    dark: '#2d5016',
                    mid: '#4a7c2c',
                    light: '#87a96b',
                    pale: '#d4e7c5',
                },
                sunrise: {
                    night: '#0c1445',
                    dawn: '#1e3a5f',
                    orange: '#ff6b35',
                    sun: '#ffd93d',
                },
                static: {
                    dark: '#121212',
                    gray: '#808080',
                    light: '#e0e0e0',
                    signal: '#00ff00',
                },
            },
            fontFamily: {
                display: ['Space Grotesk', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            fontSize: {
                'display': '48px',
                'heading': '32px',
                'body': '16px',
                'typing': '24px',
                'caption': '14px',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(107, 95, 255, 0.5)' },
                    '50%': { boxShadow: '0 0 40px rgba(107, 95, 255, 0.8)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}

export default config
