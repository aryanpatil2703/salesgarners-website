/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border, 240 3.7% 15.9%))',
        input: 'hsl(var(--input, 240 3.7% 15.9%))',
        ring: 'hsl(var(--ring, 240 4.9% 83.9%))',
        background: 'hsl(var(--background, 240 10% 3.9%))',
        foreground: 'hsl(var(--foreground, 0 0% 98%))',
        primary: {
          DEFAULT: 'hsl(var(--primary, 0 0% 98%))',
          foreground: 'hsl(var(--primary-foreground, 240 5.9% 10%))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary, 240 3.7% 15.9%))',
          foreground: 'hsl(var(--secondary-foreground, 0 0% 98%))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted, 240 3.7% 15.9%))',
          foreground: 'hsl(var(--muted-foreground, 240 5% 64.9%))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent, 240 3.7% 15.9%))',
          foreground: 'hsl(var(--accent-foreground, 0 0% 98%))',
        },
      },
      borderRadius: {
        lg: 'var(--radius, 0.5rem)',
        md: 'calc(var(--radius, 0.5rem) - 2px)',
        sm: 'calc(var(--radius, 0.5rem) - 4px)',
      },
    },
  },
  plugins: [],
};

