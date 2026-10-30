import { CIUDADES_URBANAS, TRANSPORTES_URBANOS } from '../data/tarifas.js'
import { calcularGastoUrbano, formatoPesos } from '../logic/calculos.js'
import { usePersistente } from '../logic/usePersistente.js'

// ¿Cuánto gastas al mes yendo a la universidad o al trabajo?
export function CalculadoraUrbana({ precioGasoil }) {
  const [ciudad, setCiudad] = usePersistente('trd-ciudad', 'sdq')
  const [elegido, setElegido] = usePersistente('trd-urbano', 'concho')
  const [viajesPorDia, setViajesPorDia] = usePersistente('trd-viajes', 2)
  const [diasPorSemana, setDiasPorSemana] = usePersistente('trd-dias', 5)

  const transportes = TRANSPORTES_URBANOS.filter((transporte) => transporte.ciudades.includes(ciudad))
  // Si cambian de ciudad y ese transporte no existe allá (el Metro en Santiago), usamos el primero
  const actual = transportes.find((transporte) => transporte.id === elegido) ?? transportes[0]

  const datos = { viajesPorDia, diasPorSemana, precioGasoil }
  const gasto = calcularGastoUrbano({ transporte: actual, ...datos })

  // Para comparar en barras cuánto sale al mes cada transporte
  const comparacion = transportes.map((transporte) => ({
    ...transporte,
    mensual: calcularGastoUrbano({ transporte, ...datos }).mensual,
  }))
  const mayor = Math.max(...comparacion.map((transporte) => transporte.mensual))

  return (
    <>
      <section className="tarjeta">
        <div className="pildoras" role="radiogroup" aria-label="Ciudad">
          {CIUDADES_URBANAS.map((opcion) => (
            <button
              key={opcion.id}
              role="radio"
              aria-checked={ciudad === opcion.id}
              className={`pildora ${ciudad === opcion.id ? 'pildora--activa' : ''}`}
              onClick={() => setCiudad(opcion.id)}
            >
              {opcion.nombre}
            </button>
          ))}
        </div>

        <p className="campo__titulo">¿En qué te mueves?</p>
        <div className="medios">
          {transportes.map((transporte) => (
            <button
              key={transporte.id}
              className={`medio ${actual.id === transporte.id ? 'medio--activo' : ''}`}
              onClick={() => setElegido(transporte.id)}
              aria-pressed={actual.id === transporte.id}
            >
              <span className="medio__icono">{transporte.icono}</span>
              <span>{transporte.nombre}</span>
            </button>
          ))}
        </div>
        {actual.detalle && <p className="texto-suave">{actual.detalle}</p>}

        <div className="deslizadores">
          <label>
            <span>
              Viajes al día: <strong>{viajesPorDia}</strong>
            </span>
            <input
              type="range"
              min="1"
              max="6"
              value={viajesPorDia}
              onChange={(evento) => setViajesPorDia(Number(evento.target.value))}
            />
          </label>
          <label>
            <span>
              Días a la semana: <strong>{diasPorSemana}</strong>
            </span>
            <input
              type="range"
              min="1"
              max="7"
              value={diasPorSemana}
              onChange={(evento) => setDiasPorSemana(Number(evento.target.value))}
            />
          </label>
        </div>
      </section>

      <section className="gastos" key={actual.id + ciudad}>
        <div className="gasto">
          <span>Por viaje</span>
          <strong>{formatoPesos(gasto.porViaje)}</strong>
        </div>
        <div className="gasto">
          <span>Al día</span>
          <strong>{formatoPesos(gasto.diario)}</strong>
        </div>
        <div className="gasto">
          <span>A la semana</span>
          <strong>{formatoPesos(gasto.semanal)}</strong>
        </div>
        <div className="gasto gasto--destacado">
          <span>Al mes</span>
          <strong>{formatoPesos(gasto.mensual)}</strong>
        </div>
      </section>

      <section className="tarjeta">
        <h2>📊 Compara cuánto gastarías al mes</h2>
        <ul className="barras">
          {comparacion.map((transporte) => (
            <li key={transporte.id} className={transporte.id === actual.id ? 'barra--actual' : ''}>
              <span className="barras__nombre">
                {transporte.icono} {transporte.nombre}
              </span>
              <span className="barras__riel">
                <span
                  className="barras__relleno"
                  style={{ width: `${(transporte.mensual / mayor) * 100}%` }}
                ></span>
              </span>
              <span className="barras__monto">{formatoPesos(transporte.mensual)}</span>
            </li>
          ))}
        </ul>
        {ciudad === 'sdq' && (
          <p className="texto-suave">
            El Metro y la tarifa integrada son subsidiados: no suben aunque suba el gasoil.
          </p>
        )}
      </section>
    </>
  )
}
