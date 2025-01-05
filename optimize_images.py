import os
from PIL import Image

# Carpeta de origen con las imágenes
input_folder = 'public/images/gallery/fotografo'

# Carpeta de destino para las imágenes convertidas
output_folder = 'public/images/gallery/fotografo/thumbnails'

# Extensiones de imágenes que se pueden convertir
supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp')

# Función para convertir una imagen a WebP
def convert_image_to_webp(input_path, output_path):
    try:
        # Abrir la imagen
        image = Image.open(input_path)
        # Convertir y guardar la imagen en formato WebP
        image.save(output_path, 'webp', optimize=True, quality=10)
        print(f'Imagen convertida y guardada: {output_path}')
    except Exception as e:
        print(f'Error al convertir {input_path}: {e}')

# Función para recorrer las carpetas y subcarpetas
for root, _, files in os.walk(input_folder):
    # Determinar la ruta relativa de la carpeta actual
    relative_path = os.path.relpath(root, input_folder)
    # Crear la carpeta correspondiente en la carpeta de destino
    target_folder = os.path.join(output_folder, relative_path)

    if not os.path.exists(target_folder):
        os.makedirs(target_folder)

    for filename in files:
        if filename.lower().endswith(supported_formats):
            input_path = os.path.join(root, filename)
            output_path = os.path.join(target_folder, f'{os.path.splitext(filename)[0]}.webp')

            # Convertir la imagen a WebP
            convert_image_to_webp(input_path, output_path)

print('Conversión de imágenes completada.')
