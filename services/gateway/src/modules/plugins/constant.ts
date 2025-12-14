export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      connectSrc: ["'self'"],
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    },
  },
};
