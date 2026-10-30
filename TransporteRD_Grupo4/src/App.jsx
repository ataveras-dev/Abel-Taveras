import { useEffect, useState } from 'react'
import { Encabezado } from './components/Encabezado.jsx'
import { PanelCombustible } from './components/PanelCombustible.jsx'
import { CalculadoraInterurbana } from './components/CalculadoraInterurbana.jsx'
import { CalculadoraUrbana } from './components/CalculadoraUrbana.jsx'
import { GASOIL_REFERENCIA } from './data/tarifas.js'
import { usePersistente } from './logic/usePersistente.js'

const PESTANAS = [
  { id: 'interurbano', nombre: '🛣️ Entre ciudades' },
  { id: 'urbano', nombre: '🏙️ En la ciudad' },
]

function temaDelSistema() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

function App() {
  const [tema, setTema] = usePersistente('trd-tema', temaDelSistema())
  const [pestana, setPestana] = usePersistente('trd-pestana', 'interurbano')

  // Con el enlace .../#ciudad o .../#viajes se abre directo esa pestaña
  useEffect(() => {
    if (window.location.hash === '#ciudad') setPestana('urbano')
    if (window.location.hash === '#viajes') setPestana('interurbano')
  }, [setPestana])
  // El precio del gasoil no se guarda: cada vez que abres la app empieza en el de esta semana
  const [precioGasoil, setPrecioGasoil] = useState(GASOIL_REFERENCIA)

  // El modo oscuro se aplica poniendo un atributo en <html> que el CSS lee
  useEffect(() => {
    document.documentElement.dataset.tema = tema
  }, [tema])

  return (
    <div className="app">
      <Encabezado
        tema={tema}
        alCambiarTema={() => setTema(tema === 'oscuro' ? 'claro' : 'oscuro')}
      />

      <main className="contenido">
        <nav className="pestanas" role="tablist">
          {PESTANAS.map((opcion) => (
            <button
              key={opcion.id}
              role="tab"
              aria-selected={pestana === opcion.id}
              className={`pestana ${pestana === opcion.id ? 'pestana--activa' : ''}`}
              onClick={() => setPestana(opcion.id)}
            >
              {opcion.nombre}
            </button>
          ))}
        </nav>

        <PanelCombustible precioGasoil={precioGasoil} alCambiar={setPrecioGasoil} />

        <div className="vista" key={pestana}>
          {pestana === 'interurbano' ? (
            <CalculadoraInterurbana precioGasoil={precioGasoil} />
          ) : (
            <CalculadoraUrbana precioGasoil={precioGasoil} />
          )}
        </div>
      </main>

      <footer className="pie">
        <p>
          Precios de referencia de octubre 2026: gasoil regular RD$270.80 (MICM), Metro RD$20 y
          tarifa integrada RD$35. Los demás pasajes son estimados; confirma en la terminal antes de
          viajar.
        </p>
        <p>TransporteRD · Grupo 4 · Lenguaje de Programación III · UASD</p>
      </footer>
    </div>
  )
}

export default App
