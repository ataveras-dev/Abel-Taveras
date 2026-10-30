import { buscarCiudad } from '../data/ciudades.js'
import { calcularPasajes, distanciaKm, formatoPesos } from '../logic/calculos.js'

// El pasaje más barato de una ruta, con el precio del gasoil de ahora
function precioDesde(ruta, precioGasoil) {
  const km = distanciaKm(buscarCiudad(ruta.origen), buscarCiudad(ruta.destino))
  return calcularPasajes({ km, pasajeros: 1, idaYVuelta: false, precioGasoil })
    .filter((opcion) => opcion.disponible)
    .reduce((menor, opcion) => Math.min(menor, opcion.porPersona), Infinity)
}

// Las últimas rutas consultadas. Al hacer clic en una, se vuelve a cargar.
export function Historial({ rutas, precioGasoil, alElegir, alBorrar }) {
  if (rutas.length === 0) return null

  return (
    <section className="tarjeta historial">
      <div className="historial__titulo">
        <h2>🕘 Tus últimas rutas</h2>
        <button className="enlace" onClick={alBorrar}>
          Borrar
        </button>
      </div>
      <ul>
        {rutas.map((ruta) => (
          <li key={`${ruta.origen}-${ruta.destino}`}>
            <button className="historial__ruta" onClick={() => alElegir(ruta)}>
              <span>
                {buscarCiudad(ruta.origen).nombre} → {buscarCiudad(ruta.destino).nombre}
              </span>
              <span className="texto-suave">desde {formatoPesos(precioDesde(ruta, precioGasoil))}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
