import sharp from 'sharp'
import { readdirSync, mkdirSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'

const INPUT  = './assets/images'
const OUTPUT = './public/images'

if (!existsSync(OUTPUT)) mkdirSync(OUTPUT, { recursive: true })

const files = readdirSync(INPUT).filter(f =>
  ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase())
)

console.log(`Optimising ${files.length} images...`)

for (const file of files) {
  const input  = join(INPUT, file)
  const name   = basename(file, extname(file))
  const output = join(OUTPUT, `${name}.webp`)

  await sharp(input)
    .resize(2400, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality: 82, effort: 4 })
    .toFile(output)

  console.log(`  ✓ ${file} → ${name}.webp`)
}

console.log('Done.')