import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Solo en desarrollo: permite abrir `npm run dev` desde una IP de red local (p. ej. el celular en el mismo wifi).
  // Sin esto, Next bloquea su JavaScript y no funciona ningún botón ni animación.
  // Cubre las redes privadas 10.x.x.x y 192.168.x.x, así no hay que editarlo cada vez que cambia la IP.
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*"],
  // Las fotos ya se entregan optimizadas en WebP (scripts/build-images.mjs).
  images: { unoptimized: true },
  // La antigua página de postulación se reemplazó por /empleos: los enlaces viejos llegan a la nueva.
  async redirects() {
    return [{ source: "/trabaja-con-nosotros", destination: "/empleos", permanent: true }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
