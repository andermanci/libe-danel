import { Glob } from 'bun';
import { imageMeta } from 'image-meta'
import { join } from 'node:path';

const fotografoGlob = new Glob(
  'public/images/gallery/fotografo/*.{webp}'
);

const fotomatonGlob = new Glob(
    'public/images/gallery/fotomaton/*.{webp}'
  );

const metaEditions: {
    "fotografo": { height: number, width: number }[],
    "fotomaton": { height: number, width: number }[]
} = {
    "fotografo": [],
    "fotomaton": []
}

for await (const file of fotografoGlob.scan('.')) {
    const data = await Bun.file(file).arrayBuffer();
    const {
      height = 0,
      width = 0,
    } = imageMeta(Buffer.from(data));
  
    const imageNumber = Number(file.match(/img-(\d+)/)?.[1] || '');
  
    const type = file.match(/\/(\d+)\//)?.[1] || '';
  
    if (imageNumber) {
      metaEditions["fotografo"][imageNumber - 1] = { height, width };
    }
  }

for await (const file of fotomatonGlob.scan('.')) {
    const data = await Bun.file(file).arrayBuffer()
    const {
      height = 0,
      width = 0
    } = imageMeta(Buffer.from(data))
  
    const imageNumber = Number(file.match(/img-(\d+)/)?.[1] || '')
    const type = file.match(/\/(\d+)\//)?.[1] || ''
  
    metaEditions["fotomaton"][imageNumber - 1] = { height, width }
}

const outputPath = join(process.cwd(), 'src/data/meta-gallery.json')
await Bun.write(outputPath, JSON.stringify(metaEditions))
