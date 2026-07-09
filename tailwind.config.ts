import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			// Rose-gold palette — the site's feminine primary colour.
  			// Warm blush-pink deepening into a rich rose/mauve.
  			rosegold: {
  				'50':  '#fdf6f4',
  				'100': '#fae9e6',
  				'200': '#f5d3ce',
  				'300': '#eab3ac',
  				'400': '#dd8f88',
  				'500': '#cf6f6c',
  				'600': '#bd5560',
  				'700': '#a34355',
  				'800': '#853a49',
  				'900': '#6f3440',
  				'950': '#3e1a22',
  			},
  			// Emerald is aliased to the rose-gold scale so the many existing
  			// `emerald-*` utility classes across the site now render rose gold
  			// without needing to touch every component. Both names work.
  			emerald: {
  				'50':  '#fdf6f4',
  				'100': '#fae9e6',
  				'200': '#f5d3ce',
  				'300': '#eab3ac',
  				'400': '#dd8f88',
  				'500': '#cf6f6c',
  				'600': '#bd5560',
  				'700': '#a34355',
  				'800': '#853a49',
  				'900': '#6f3440',
  				'950': '#3e1a22',
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
