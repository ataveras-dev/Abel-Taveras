import { GASOIL_REFERENCIA } from '../data/tarifas.js'
import { factorCombustible, formatoPesos } from '../logic/calculos.js'

// Barra para simular "¿y si sube el gasoil?". Todos los pasajes se recalculan solos.
export function PanelCombustible({ precioGasoil, alCambiar }) {
  const cambio = Math.round((factorCombustible(precioGasoil) - 1) * 100)

  let mensaje = 'Precio de esta semana'
  if (cambio > 0) mensaje = `Los pasajes subirían ${cambio}% 😬`
  if (cambio < 0) mensaje = `Los pasajes bajarían ${Math.abs(cambio)}% 🙌`

  return (
    <section className="tarjeta combustible">
      <div className="combustible__fila">
        <label htmlFor="gasoil">
          <strong>⛽ Galón de gasoil</strong>
          <span className="texto-suave"> — ¿y si sube?</span>
        </label>
        <span className="combustible__precio">{formatoPesos(precioGasoil, 2)}</span>
      </div>

      <input
        id="gasoil"
        type="range"
        min="200"
        max="400"
        step="5"
        value={precioGasoil}
        onChange={(evento) => alCambiar(Number(evento.target.value))}
      />

      <div className="combustible__fila texto-suave">
        <span className={cambio > 0 ? 'sube' : cambio < 0 ? 'baja' : ''}>{mensaje}</span>
        {precioGasoil !== GASOIL_REFERENCIA && (
          <button className="enlace" onClick={() => alCambiar(GASOIL_REFERENCIA)}>
            Volver a {formatoPesos(GASOIL_REFERENCIA, 2)}
          </button>
        )}
      </div>
    </section>
  )
}
