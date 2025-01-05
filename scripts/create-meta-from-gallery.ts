// import { Glob } from 'bun';
// import { imageMeta } from 'image-meta';
// import { join } from 'node:path';

// // Buscar todos los archivos en cualquier nivel dentro de gallery (pero omitiendo la carpeta thumbnails)
// const galleryGlob = new Glob('public/images/gallery/**/*.{webp}');

// const metaEditions = {};

// // Función para asegurar la estructura jerárquica
// function ensureNestedStructure(base, pathSegments) {
//   let current = base;
//   for (const segment of pathSegments) {
//     if (!current[segment]) {
//       current[segment] = {};
//     }
//     current = current[segment];
//   }
//   return current;
// }

// const files = [];

// // Recolectar todos los archivos en un array, pero ignorar los que están dentro de 'thumbnails'
// for await (const file of galleryGlob.scan('.')) {
//   if (file.includes('/thumbnails/')) {
//     continue; // Ignorar archivos dentro de la carpeta 'thumbnails'
//   }
//   files.push(file);
// }

// // Función para extraer el número de imagen desde el nombre del archivo
// function extractImageNumber(fileName) {
//   const match = fileName.match(/img-(\d+)\.webp/);
//   return match ? parseInt(match[1], 10) : -1; // Retorna el número de la imagen o -1 si no hay número
// }

// // Ordenar los archivos por el número extraído del nombre de la imagen
// files.sort((a, b) => {
//   const aNumber = extractImageNumber(a);
//   const bNumber = extractImageNumber(b);
//   return aNumber - bNumber;
// });

// // Procesar los archivos ordenados
// for (const file of files) {
//   const data = await Bun.file(file).arrayBuffer();
//   const { height = 0, width = 0 } = imageMeta(Buffer.from(data));

//   // Extraer el path relativo a public/images/gallery
//   const relativePath = file.replace('public/images/gallery/', '');

//   // Dividir el path en segmentos (carpetas y archivo)
//   const pathSegments = relativePath.split('/');
//   const fileName = pathSegments.pop(); // Extraer el nombre del archivo

//   // Obtener la referencia del último nivel donde se almacenarán las imágenes
//   const lastLevel = pathSegments.pop();
//   const parent = ensureNestedStructure(metaEditions, pathSegments);

//   // Si el último nivel no existe como array, inicialízalo
//   if (!parent[lastLevel]) {
//     parent[lastLevel] = [];
//   }

//   // Agregar la metadata de la imagen al array correspondiente
//   parent[lastLevel].push({ height, width });
// }

// const outputPath = join(process.cwd(), 'src/data/meta-gallery.json');
// await Bun.write(outputPath, JSON.stringify(metaEditions, null, 2));
