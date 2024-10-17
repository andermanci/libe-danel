import 'photoswipe/style.css';

import Button from '@/components/Button.tsx';
import { useGallery } from "@/hooks/useGallery"
import '@/components/styles/Galeria.css';

import { type Masory } from "@/types/gallery"

export default function Galeria({type}:{type:string}) {
  
  const {first,isExpanded,photos,LoadMore} = useGallery({type})

  return ( 
    <section class="w-11/12 md:w-5/6 pb-8">

      <masonry-layout
        gap="24"
        maxcolwidth="500"
        id="gallery"
      >
        {
          photos.map(({ height, width }, i) => (
            <a
              class="group rounded-xl hover:scale-105 hover:contrast-[110%] transition-all relative"
              href={`/images/gallery/${type}/img-${i + 1}.webp`}
              target="_blank"
              data-cropped="true"
              data-pswp-width={width}
              data-pswp-height={height}
              ref={!first.current ? first : undefined}  
            >
              <img
                class="rounded-xl object-cover w-full h-auto"
                loading="lazy"
                src={`/images/gallery/${type}/thumbnails/img-${
                  i + 1
                }.webp`}
                alt="Fotografía de la boda"
              />
              <img
                class="blur-md opacity-0 group-hover:opacity-100 absolute inset-0 transition contrast-150 -z-10 object-cover"
                loading="lazy"
                src={`/images/gallery/${type}/thumbnails/img-${
                  i + 1
                }.webp`}
                alt="Imagen con efecto blur para hacer de sombra de una fotografía de la boda"
              />
            </a>
          ))
        }
      </masonry-layout>

      <div class="text-center mx-auto">
      {
      !isExpanded && 
        <button onClick={LoadMore} id="load-more" class="bg-primary py-2 px-4 rounded-xl text-white mt-12">Cargar más fotos</button>
      }
      </div>

    </section>
  )
}
