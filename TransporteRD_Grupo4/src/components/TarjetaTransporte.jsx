import { formatoPesos, formatoTiempo } from '../logic/calculos.js'

// Muestra el precio y el tiempo de un tipo de transporte
export function TarjetaTransporte({ opcion, esMasBarato, esMasRapido, pasajeros, idaYVuelta, retraso }) {
  if (!opcion.disponible) {
    return (
      <article className="opcion opcion--no-disponible" style={{ animationDelay: `${retraso}ms` }}>
        <span className="opcion__icono">{opcion.icono}</span>
        <div className="opcion__info">
          <h3>{opcion.nombre}</h3>
          <p className="texto-suave">No hay carro público para un viaje tan largo.</p>
        </div>
      </article>
    )
  }

  const varios = pasajeros > 1 || idaYVuelta

  return (
    <article className="opcion" style={{ animationDelay: `${retraso}ms` }}>
      <span className="opcion__icono">{opcion.icono}</span>
      <div className="opcion__info">
        <h3>
          {opcion.nombre}
          {esMasBarato && <span className="etiqueta etiqueta--verde">Más barato</span>}
          {esMasRapido && <span className="etiqueta etiqueta--azul">Más rápido</span>}
        </h3>
        <p className="texto-suave">{opcion.detalle}</p>
        <p className="opcion__tiempo">⏱ {formatoTiempo(opcion.minutos)} aprox.</p>
      </div>
      <div className="opcion__precio">
        <strong>{formatoPesos(varios ? opcion.total : opcion.porPersona)}</strong>
        {varios && <span className="texto-suave">{formatoPesos(opcion.porPersona)} c/u</span>}
      </div>
    </article>
  )
}
