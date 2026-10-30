// Guardar y leer datos en el navegador (localStorage).
// Si el navegador no deja guardar (modo privado), la app sigue funcionando igual.
export function leer(clave, valorPorDefecto) {
  try {
    const texto = window.localStorage.getItem(clave)
    return texto ? JSON.parse(texto) : valorPorDefecto
  } catch {
    return valorPorDefecto
  }
}

export function guardar(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // no se pudo guardar; no pasa nada
  }
}
