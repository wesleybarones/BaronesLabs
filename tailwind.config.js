/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#07080D',
        panel: '#0C0E16',
        line: '#1A2030',
        cyan: { DEFAULT: '#00F0FF', 2: '#02AFBB' },
        sky: '#8AB6F7',
        magenta: '#E040D8',
        muted: '#8A9BB0',
        lime: '#D4FF24',
        err: '#FF4D6D',
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        neon: ['"Tilt Neon"', '"Chakra Petch"', 'sans-serif'],
      },
      borderRadius: { none: '0', DEFAULT: '2px', sm: '1px' },
      maxWidth: { site: '1240px' },
    },
  },
  plugins: [],
};
