import { useState, useEffect, useRef } from 'preact/hooks';
import typeInfo from "@/data/meta-gallery.json";

interface GalleryType {
  height: number;
  width: number;
}

interface GalleryInfo {
  [key: string]: GalleryType[];
}

const galleryInfoTyped: GalleryInfo = typeInfo;

export const useGallery = ({type}: {type: string}) => {
    const [page, setPage] = useState(1);
    const offset = 30;
    const first = useRef<HTMLAnchorElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const photos = galleryInfoTyped[type]?.slice(0, offset) ?? [];

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
        const res = await fetch(`/api/gallery.json?type=${type}&offset=${offset}&page=${page}`)
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
              `/images/gallery/${type}/img-${imgIndex}.webp`
            )
            clone.classList.add("animate-fade-up")
            clone.classList.add("animate-delay-300")
            clone.classList.add("opacity-0")
            clone
            .querySelector("img:first-child")
            ?.setAttribute(
                "src",
                `/images/gallery/${type}/thumbnails/img-${imgIndex}.webp`
              )
            clone
              .querySelector("img:last-child")
              ?.setAttribute(
                "src",
                `/images/gallery/${type}/thumbnails/img-${imgIndex}.webp`
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