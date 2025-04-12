import helmet from "helmet";
import { defineNitroPlugin } from "nitropack";

const isDevelopment = process.env.NODE_ENV === "development";

// 👮 Configuración de Helmet
const helmetMiddleware = helmet({
  contentSecurityPolicy: isDevelopment
    ? false
    : {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'"],
          objectSrc: ["'none'"],
        },
      },
  hsts: isDevelopment
    ? { maxAge: 0 }
    : {
        maxAge: 31536000, // 1 año
        includeSubDomains: true,
        preload: true,
      },
  xssFilter: true,
  xContentTypeOptions: true,
  frameguard: { action: "DENY" },
  referrerPolicy: { policy: "no-referrer" },
  dnsPrefetchControl: { allow: false },
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
});

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", (event) => {
    const req = event.node.req;

    // 🧼 Limpieza de cabeceras para evitar ataques de cache poisoning
    delete req.headers["x-forwarded-host"];
    delete req.headers["x-original-url"];
    delete req.headers["host"]; 

    // 🛡️ Aplica Helmet
    helmetMiddleware(req, event.node.res, () => {});
  });
});
