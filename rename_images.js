const fs = require('fs');
const path = require('path');

// Ruta principal de la carpeta donde están las imágenes
const baseDir = path.join(__dirname, 'public/images/gallery/fotografo');

// Función recursiva para recorrer las carpetas
const renameImages = (dir, index = 1) => {
  // Leer los archivos de la carpeta
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // Si es una carpeta, se llama recursivamente
    if (stat.isDirectory()) {
      renameImages(fullPath, index);
    } else if (stat.isFile() && file.endsWith('.webp')) {
      // Si es un archivo de imagen .webp, lo renombramos
      const newName = `img-${index}.webp`;
      const newFilePath = path.join(dir, newName);

      // Renombrar el archivo
      fs.renameSync(fullPath, newFilePath);
      console.log(`Renombrado ${fullPath} a ${newFilePath}`);

      // Incrementar el índice para la siguiente imagen
      index++;
    }
  });
};

// Llamamos a la función principal
renameImages(baseDir);
