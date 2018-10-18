module.exports = {
  directives: {
    defaultSrc: ["'self'", 'https://www.google-analytics.com'],
    styleSrc: [
      "'self'",
      // This is used by Materialish. For example, SVG inline styles.
      "'unsafe-inline'",
      // Normalize
      'cdnjs.cloudflare.com',
      // Material Design Icon font
      'cdn.materialdesignicons.com',
      // Google fonts
      'fonts.googleapis.com',
    ],
    fontSrc: [
      "'self'",
      // Material Design Icon font
      'cdn.materialdesignicons.com',
      // Google fonts
      'fonts.gstatic.com',
    ],
  },
};
