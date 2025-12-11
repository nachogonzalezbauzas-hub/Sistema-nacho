/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./views/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./store/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
        "./dungeons/**/*.{js,ts,jsx,tsx}",
        "./data/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                'system-dark': '#030712',
                'system-blue': '#2563eb',
                'system-cyan': '#06b6d4',
                'neon-purple': '#a855f7',
                'neon-yellow': '#eab308',
                'neon-green': '#22c55e',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
            },
            animation: {
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glitch': 'glitch 1s linear infinite',
                'float': 'float 3s ease-in-out infinite',
                'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
                'level-up': 'level-up 0.5s ease-out forwards',
                'text-shimmer': 'text-shimmer 2s ease-out infinite alternate',
                'lightning': 'lightning 2s infinite',
                'fire-pulse': 'fire-pulse 3s ease-in-out infinite',
                'speed-vibrate': 'speed-vibrate 0.2s linear infinite',
                'arcane-float': 'arcane-float 4s ease-in-out infinite',
                'shimmer-green': 'shimmer-green 2s linear infinite',
                'plasma-morph': 'plasma-morph 4s ease-in-out infinite',
                'bg-float': 'bg-float 20s ease-in-out infinite',
                'aura-breathe': 'aura-breathe 4s ease-in-out infinite',
                'slide-in-up': 'slide-in-up 0.3s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
            },
            keyframes: {
                glitch: {
                    '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
                    '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
                    '62%': { transform: 'translate(0,0) skew(5deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
                },
                'level-up': {
                    '0%': { opacity: '0', transform: 'scale(0.5)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                'text-shimmer': {
                    '0%': { opacity: '0.8', textShadow: '0 0 5px rgba(59,130,246,0.5)' },
                    '100%': { opacity: '1', textShadow: '0 0 10px rgba(59,130,246,0.8)' }
                },
                lightning: {
                    '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 1px cyan)' },
                    '50%': { filter: 'brightness(1.5) drop-shadow(0 0 4px cyan)' },
                    '52%': { filter: 'brightness(2) drop-shadow(0 0 5px white)' },
                    '54%': { filter: 'brightness(1.5) drop-shadow(0 0 4px cyan)' }
                },
                'fire-pulse': {
                    '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 1px red)' },
                    '50%': { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 4px orange)' }
                },
                'speed-vibrate': {
                    '0%': { transform: 'translate(0, 0)' },
                    '25%': { transform: 'translate(-1px, 0.5px)' },
                    '50%': { transform: 'translate(1px, -0.5px)' },
                    '75%': { transform: 'translate(-0.5px, -0.5px)' },
                    '100%': { transform: 'translate(0, 0)' }
                },
                'arcane-float': {
                    '0%, 100%': { transform: 'translateY(0) scale(1)', filter: 'hue-rotate(0deg) drop-shadow(0 0 1px purple)' },
                    '50%': { transform: 'translateY(-2px) scale(1.02)', filter: 'hue-rotate(10deg) drop-shadow(0 0 3px purple)' }
                },
                'shimmer-green': {
                    '0%': { opacity: '0.9', filter: 'brightness(1)' },
                    '50%': { opacity: '1', filter: 'brightness(1.2) drop-shadow(0 0 3px green)' },
                    '100%': { opacity: '0.9', filter: 'brightness(1)' }
                },
                'plasma-morph': {
                    '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1) drop-shadow(0 0 1px blue)' },
                    '50%': { transform: 'scale(1.02)', filter: 'brightness(1.2) drop-shadow(0 0 4px blue)' }
                },
                'bg-float': {
                    '0%, 100%': { transform: 'translateY(0) scale(1)' },
                    '50%': { transform: 'translateY(-10px) scale(1.02)' }
                },
                'aura-breathe': {
                    '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
                    '50%': { opacity: '0.5', transform: 'scale(1.1)' }
                },
                'slide-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                }
            },
        },
    },
    plugins: [],
}
