import type { APIRoute } from "astro";
import galleryInfo from '@/data/meta-gallery.json';

interface GalleryType {
  height: number;
  width: number;
}

interface NestedGalleryInfo {
  [key: string]: NestedGalleryInfo | GalleryType[];
}

const galleryInfoTyped: NestedGalleryInfo = galleryInfo;

export const GET: APIRoute = ({ request }) => {
  const { url } = request;
  const searchParams = new URL(url).searchParams;

  const type = searchParams.get('type') || '';
  const subtype = searchParams.get('subtype') || '';
  const offset = Number(searchParams.get('offset') ?? '0');
  const page = Number(searchParams.get('page') ?? '1');

  const typeInfo = galleryInfoTyped[type];

  if (!typeInfo) {
    return new Response(JSON.stringify({ error: 'Tipo no encontrado' }), {
      status: 404,
    });
  }

  let result: GalleryType[] = [];

  // Si hay `subtype`, lo buscamos dentro del `type`
  if (subtype) {
    const subtypeData = (typeInfo as NestedGalleryInfo)[subtype];

    if (!subtypeData || !Array.isArray(subtypeData)) {
      return new Response(JSON.stringify({ error: 'Subtipo no encontrado o inválido' }), {
        status: 404,
      });
    }

    // Devuelve las imágenes del `subtype`
    result = subtypeData.slice(offset * page, offset * (page + 1));
  } else {
    // Si no hay `subtype`, se devuelve el `type` completo
    if (Array.isArray(typeInfo)) {
      result = typeInfo.slice(offset * page, offset * (page + 1));
    } else {
      return new Response(JSON.stringify({ error: 'No se pudo acceder a los datos del tipo' }), {
        status: 404,
      });
    }
  }

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
