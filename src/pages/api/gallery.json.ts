import type { APIRoute } from "astro";
import galleryInfo from '@/data/meta-gallery.json';

interface GalleryType {
  height: number;
  width: number;
}

interface GalleryInfo {
  [key: string]: GalleryType[];
}

const galleryInfoTyped: GalleryInfo = galleryInfo;

export const GET: APIRoute = ({ request }) => {
  console.log({request});
  const { url } = request;
  const searchParams = new URL(url).searchParams;

  const type = searchParams.get('type') || '';
  const offset = Number(searchParams.get('offset') ?? '0');
  const page = Number(searchParams.get('page') ?? '1');

  const typeInfo = galleryInfoTyped[type];

  if (!typeInfo) {
    return new Response(JSON.stringify({ error: 'Tipo no encontrado' }), {
      status: 404,
    });
  }

  const result = typeInfo.slice(offset * page, offset * (page + 1));

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
