import { useEffect, useState } from 'react'
import { guardar, leer } from './storage.js'

// Hook propio: funciona igual que useState, pero el valor se queda guardado
// en el navegador aunque se cierre la página.
export function usePersistente(clave, valorInicial) {
  const [valor, setValor] = useState(() => leer(clave, valorInicial))

  useEffect(() => {
    guardar(clave, valor)
  }, [clave, valor])

  return [valor, setValor]
}
