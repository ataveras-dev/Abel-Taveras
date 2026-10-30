// Crea "abrir.html": la app completa en UN solo archivo, para abrirlo con doble clic
// sin tener que correr "npm run dev". Primero hay que correr "npm run build".
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const dist = 'dist'
let html = readFileSync(`${dist}/index.html`, 'utf8')
const archivos = readdirSync(`${dist}/assets`)

// Meter el CSS dentro del HTML
for (const css of archivos.filter((a) => a.endsWith('.css'))) {
  const codigo = readFileSync(`${dist}/assets/${css}`, 'utf8')
  html = html.replace(/<link rel="stylesheet"[^>]*>/, () => `<style>\n${codigo}\n</style>`)
}

// Meter el JavaScript dentro del HTML (al final del body, para que ya exista #root)
for (const js of archivos.filter((a) => a.endsWith('.js'))) {
  const codigo = readFileSync(`${dist}/assets/${js}`, 'utf8').replace(/<\/script/g, '<\\/script')
  html = html.replace(/<script type="module"[^>]*><\/script>/, '')
  html = html.replace('</body>', () => `<script type="module">\n${codigo}\n</script>\n</body>`)
}

// El ícono de la pestaña también va dentro del archivo
const icono = readFileSync('public/favicon.svg', 'utf8')
html = html.replace(
  /href="[^"]*favicon\.svg"/,
  `href="data:image/svg+xml,${encodeURIComponent(icono)}"`
)

writeFileSync('abrir.html', html)
console.log('Listo: abrir.html creado (ábrelo con doble clic)')
