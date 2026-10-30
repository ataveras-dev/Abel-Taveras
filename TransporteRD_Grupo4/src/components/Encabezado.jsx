export function Encabezado({ tema, alCambiarTema }) {
  const esOscuro = tema === 'oscuro'

  return (
    <header className="encabezado">
      <div className="encabezado__marca">
        <span className="encabezado__logo" aria-hidden="true">
          🚌
        </span>
        <div>
          <h1>
            Transporte<span className="acento">RD</span>
          </h1>
          <p className="encabezado__lema">Calcula tu pasaje antes de salir de casa</p>
        </div>
      </div>

      <button
        className="boton-tema"
        onClick={alCambiarTema}
        aria-label={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={esOscuro ? 'Modo claro' : 'Modo oscuro'}
      >
        {esOscuro ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
