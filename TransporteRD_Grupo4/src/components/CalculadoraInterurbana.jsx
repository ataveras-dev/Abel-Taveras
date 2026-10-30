import { useEffect, useState } from 'react'
import { CIUDADES, buscarCiudad } from '../data/ciudades.js'
import { calcularPasajes, distanciaKm, formatoPesos } from '../logic/calculos.js'
import { usePersistente } from '../logic/usePersistente.js'
import { TarjetaTransporte } from './TarjetaTransporte.jsx'
import { Historial } from './Historial.jsx'

const MAX_HISTORIAL = 5

export function CalculadoraInterurbana({ precioGasoil }) {
  const [origen, setOrigen] = usePersistente('trd-origen', 'stgo')
  const [destino, setDestino] = usePersistente('trd-destino', 'sdq')
  const [pasajeros, setPasajeros] = useState(1)
  const [idaYVuelta, setIdaYVuelta] = useState(false)
  const [historial, setHistorial] = usePersistente('trd-historial', [])
  const [girando, setGirando] = useState(false)

  const ciudadOrigen = buscarCiudad(origen)
  const ciudadDestino = buscarCiudad(destino)
  const mismaCiudad = origen === destino

  const km = mismaCiudad ? 0 : distanciaKm(ciudadOrigen, ciudadDestino)
  const opciones = calcularPasajes({ km, pasajeros, idaYVuelta, precioGasoil })
  const disponibles = opciones.filter((opcion) => opcion.disponible)
  const masBarato = Math.min(...disponibles.map((opcion) => opcion.porPersona))
  const masRapido = Math.min(...disponibles.map((opcion) => opcion.minutos))

  // Cada vez que cambia la ruta, la guardamos de primera en el historial
  useEffect(() => {
    if (origen === destino) return
    setHistorial((antes) => {
      const sinRepetir = antes.filter((ruta) => !(ruta.origen === origen && ruta.destino === destino))
      return [{ origen, destino }, ...sinRepetir].slice(0, MAX_HISTORIAL)
    })
  }, [origen, destino, setHistorial])

  function intercambiar() {
    setOrigen(destino)
    setDestino(origen)
    setGirando(true)
    setTimeout(() => setGirando(false), 400)
  }

  function elegirRuta(ruta) {
    setOrigen(ruta.origen)
    setDestino(ruta.destino)
  }

  return (
    <>
      <section className="tarjeta">
        <div className="ruta">
          <label className="campo">
            <span>📍 Salgo de</span>
            <select value={origen} onChange={(evento) => setOrigen(evento.target.value)}>
              {CIUDADES.map((ciudad) => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
          </label>

          <button
            className={`boton-intercambiar ${girando ? 'girando' : ''}`}
            onClick={intercambiar}
            aria-label="Intercambiar origen y destino"
            title="Intercambiar"
          >
            ⇅
          </button>

          <label className="campo">
            <span>🏁 Voy para</span>
            <select value={destino} onChange={(evento) => setDestino(evento.target.value)}>
              {CIUDADES.map((ciudad) => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="extras">
          <div className="contador">
            <span>👥 Pasajeros</span>
            <div className="contador__botones">
              <button
                onClick={() => setPasajeros(pasajeros - 1)}
                disabled={pasajeros === 1}
                aria-label="Quitar pasajero"
              >
                −
              </button>
              <strong>{pasajeros}</strong>
              <button
                onClick={() => setPasajeros(pasajeros + 1)}
                disabled={pasajeros === 10}
                aria-label="Agregar pasajero"
              >
                +
              </button>
            </div>
          </div>

          <label className="interruptor">
            <input
              type="checkbox"
              checked={idaYVuelta}
              onChange={(evento) => setIdaYVuelta(evento.target.checked)}
            />
            <span className="interruptor__riel" aria-hidden="true"></span>
            Ida y vuelta
          </label>
        </div>
      </section>

      {mismaCiudad ? (
        <p className="aviso">
          🤔 Elegiste la misma ciudad de salida y llegada. Para moverte dentro de la ciudad usa la
          pestaña <strong>En la ciudad</strong>.
        </p>
      ) : (
        <section className="resultados" key={`${origen}-${destino}`}>
          <div className="resumen">
            <p>
              De <strong>{ciudadOrigen.nombre}</strong> a <strong>{ciudadDestino.nombre}</strong>
            </p>
            <p className="resumen__precio">
              desde <span>{formatoPesos(masBarato)}</span>
            </p>
            <p className="texto-suave">≈ {km} km por carretera</p>
          </div>

          {opciones.map((opcion, indice) => (
            <TarjetaTransporte
              key={opcion.id}
              opcion={opcion}
              esMasBarato={opcion.disponible && opcion.porPersona === masBarato}
              esMasRapido={opcion.disponible && opcion.minutos === masRapido}
              pasajeros={pasajeros}
              idaYVuelta={idaYVuelta}
              retraso={indice * 90}
            />
          ))}
        </section>
      )}

      <Historial
        rutas={historial}
        precioGasoil={precioGasoil}
        alElegir={elegirRuta}
        alBorrar={() => setHistorial([])}
      />
    </>
  )
}
