import { useState, useEffect, useRef } from 'preact/hooks';
import typeInfo from "@/data/meta-gallery.json";

interface GalleryType {
  height: number;
  width: number;
}

interface NestedGalleryInfo {
  [key: string]: NestedGalleryInfo | GalleryType[];
}

const galleryInfoTyped: NestedGalleryInfo = typeInfo;

export const useGallery = ({ type, subtype }: { type: string; subtype?: string }) => {
  const [page, setPage] = useState(1);
  const offset = 30;
  const first = useRef<HTMLAnchorElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Función que obtiene las fotos de acuerdo al `type` y `subtype`
  const getPhotos = (): GalleryType[] => {
    const typeData = galleryInfoTyped[type];

    if (!typeData) {
      return []; // Si el `type` no existe, retorna un array vacío
    }

    // Si hay un `subtype` especificado
    if (subtype) {
      // Asegúrate de que `typeData` sea un objeto de tipo `NestedGalleryInfo`
      const subtypeData = (typeData as NestedGalleryInfo)[subtype];

      if (!subtypeData || !Array.isArray(subtypeData)) {
        return []; // Si el `subtype` no existe o no es un array, retorna vacío
      }

      return subtypeData.slice(0, offset); // Devuelve las imágenes del `subtype`
    }

    // Si no hay `subtype`, se asume que `typeData` es un array
    if (Array.isArray(typeData) && type != 'fotografo') {
      return typeData.slice(0, offset); // Devuelve las fotos del `type`
    }

    return []; // Si no se cumple ninguna condición, retorna un array vacío
  };

  const photos = getPhotos();


    useEffect(() => {
        const init = async () => {
            await import('@appnest/masonry-layout')
            const module = await import("photoswipe/lightbox")
            const PhotoSwipeLightbox = module.default
            const lightbox = new PhotoSwipeLightbox({
              gallery: "#gallery",
              children: "a",
              loop: false,
              pswpModule: () => import("photoswipe"),
            })
            lightbox.init()
        }
        init()
      }, [])

      const LoadMore = async () => {
        const res = await fetch(`/api/gallery.json?type=${type}${subtype ? '&subtype=' + subtype : ''}&offset=${offset}&page=${page}`)
        const images = await res.json()
    
        const html = images
          .map((img:any, index:number) => {
            const imgIndex = (index + 1) + offset * page
            if (!first.current) return
    
            const clone = first.current.cloneNode(true) as HTMLElement
            if (!clone) return
            clone.setAttribute("data-pswp-width", img.width)
            clone.setAttribute("data-pswp-height", img.height)
            clone.setAttribute(
              "href",
              `/images/gallery/${type}${subtype ? `/${subtype}` : ''}/img-${imgIndex}.webp`
            )
            clone.classList.add("animate-fade-up")
            clone.classList.add("animate-delay-300")
            clone.classList.add("opacity-0")
            clone
            .querySelector("img:first-child")
            ?.setAttribute(
                "src",
                `/images/gallery/${type}/thumbnails${subtype ? `/${subtype}` : ''}/img-${imgIndex}.webp`
              )
            clone
              .querySelector("img:last-child")
              ?.setAttribute(
                "src",
                `/images/gallery/${type}/thumbnails${subtype ? `/${subtype}` : ''}/img-${imgIndex}.webp`
              )
    
            return clone?.outerHTML
          })
          .join("")
    
        document.querySelector("#gallery")?.insertAdjacentHTML("beforeend", html)
        document.querySelector("masonry-layout")?.scheduleLayout()
        
        setPage(page + 1)
        if (images.length < offset) {
          setIsExpanded(true)
        }
    }

    return {
        photos,
        first,
        isExpanded,
        LoadMore
    }
}