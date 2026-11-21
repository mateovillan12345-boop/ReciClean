// Genera las imágenes optimizadas de la web a partir de ../Images.
// Uso: node scripts/build-images.mjs
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, "..", "Images");
const out = path.join(root, "public", "images");

// extract: recorte sobre el original (quita textos y logos sobrepuestos de las fotos reales)
const jobs = [
  // Fotos reales de ReciClean
  { name: "equipo", file: "Reciclean Personal photo 1.jpg", extract: { left: 60, top: 330, width: 1930, height: 1180 }, width: 1400 },
  { name: "fundadora", file: "Reciclean Gerente General.jpg", extract: { left: 330, top: 400, width: 1035, height: 1294 }, width: 900 },
  { name: "equipo-reconocimiento", file: "Reciclean personal celebracion.jpg", extract: { left: 720, top: 170, width: 1328, height: 1195 }, width: 1200 },
  { name: "equipo-celebracion", file: "Reciclean personal celebracion 3.jpg", extract: { left: 300, top: 205, width: 1748, height: 800 }, width: 1400 },
  // Fotos genéricas
  { name: "oficinas", file: "kate-sade-2zZp12ChxhU-unsplash.jpg", width: 1400 },
  { name: "oficina-moderna", file: "declan-sun-HYYHvBsZOfU-unsplash.jpg", width: 1200 },
  { name: "aula", file: "mouad-bouallayel-Y4pvI2pFkTY-unsplash.jpg", width: 1200 },
  { name: "piso", file: "toon-lambrechts-0FTI9ceTUOc-unsplash.jpg", width: 1400 },
  { name: "carro-limpieza", file: "pexels-caleboquendo-34516664.jpg", width: 1200 },
  { name: "post-obra", file: "the-graphic-space-kLZs4yoR0uU-unsplash.jpg", width: 1000 },
  { name: "vidrios-exterior", file: "pexels-cihat-dede-677909449-37440103.jpg", width: 1000 },
  { name: "alfombra", file: "pexels-pixabay-38325.jpg", width: 1200 },
  { name: "cocina", file: "julia-i3NR1cnwqUo-unsplash.jpg", width: 1000 },
  { name: "vidrios", file: "pexels-antonius-ferret-6223032.jpg", width: 1200 },
  { name: "alfombra-vapor", file: "california-steam-dry-carpet-cleaning-Ddzir2TCR2g-unsplash.jpg", width: 1000 },
  { name: "superficies", file: "anton-y-bjqTUUw2Q-unsplash.jpg", width: 1200 },
  { name: "hogar", file: "pexels-tima-miroshnichenko-6195123.jpg", width: 1200 },
];

await mkdir(out, { recursive: true });
const manifest = {};
for (const job of jobs) {
  let img = sharp(path.join(src, job.file)).rotate();
  if (job.extract) img = img.extract(job.extract);
  const info = await img
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: 74 })
    .toFile(path.join(out, `${job.name}.webp`));
  manifest[job.name] = { src: `/images/${job.name}.webp`, width: info.width, height: info.height };
  console.log(job.name, info.width, info.height, Math.round(info.size / 1024) + " KB");
}

// Logo: se recorta solo el margen blanco, sin alterar proporciones ni colores.
const logo = await sharp(path.join(src, "LOGO RECICLEAN.jpg")).trim({ threshold: 12 }).png().toFile(path.join(out, "logo.png"));
manifest.logo = { src: "/images/logo.png", width: logo.width, height: logo.height };
console.log("logo", logo.width, logo.height);

await writeFile(path.join(root, "src", "content", "images.json"), JSON.stringify(manifest, null, 2) + "\n");
