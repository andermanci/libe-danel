import type { APIRoute } from "astro";

import galleryInfo from '@/data/meta-gallery.json'

export const GET: APIRoute = ({ request }) => {
  const { url } = request
  const searchParams = new URL(url).searchParams
  
  const offset = Number(searchParams.get('offset') ?? '0')

  const typeInfo = galleryInfo["fotografo"]

  return new Response(JSON.stringify(typeInfo.slice(offset)))
}