/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
    './themes/hugo-product-theme/layouts/**/*.html',
  ],
  // Disable Tailwind's preflight (browser reset) since we handle it with our own base styles
  // corePlugins: { preflight: false },
  theme: {
    // Custom breakpoints matching Bulma's breakpoints exactly
    screens: {
      'tablet':     '769px',   // Bulma: tablet  (min-width 769px)
      'desktop':    '1024px',  // Bulma: desktop (min-width 1024px)
      'widescreen': '1216px',  // Bulma: widescreen (min-width 1216px)
      'fullhd':     '1408px',  // Bulma: fullhd  (min-width 1408px)
    },
    extend: {},
  },
  plugins: [],
}
