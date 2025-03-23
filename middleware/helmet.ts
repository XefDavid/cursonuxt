import helmet from "helmet";
import { defineNitroPlugin } from "nitropack";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", (event) => {
    // En desarrollo, relajar las políticas
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    helmet({
      contentSecurityPolicy: isDevelopment ? false : {
        directives: {
          defaultSrc: ["'self'", "localhost"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "localhost"],
          styleSrc: ["'self'", "localhost"],
          objectSrc: ["'none'"],
        },
      },
      hsts: isDevelopment ? { maxAge: 0 } : {
        maxAge: 31536000, // 1 año
        includeSubDomains: true,
        preload: true
      },
      xssFilter: true,
      xContentTypeOptions: true,
      frameguard: { action: 'DENY' },
    })(event.node.req, event.node.res, () => {});
  });
});
