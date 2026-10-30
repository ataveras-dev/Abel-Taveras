import { GASOIL_REFERENCIA, PESO_COMBUSTIBLE, TRANSPORTES_INTERURBANOS } from '../data/tarifas.js'

// Las carreteras no van en línea recta: multiplicamos la distancia "en el mapa" por este número
const FACTOR_CARRETERA = 1.22
const RADIO_TIERRA_KM = 6371

const aRadianes = (grados) => (grados * Math.PI) / 180

// Distancia aproximada por carretera entre dos ciudades (fórmula de Haversine)
export function distanciaKm(origen, destino) {
  const dLat = aRadianes(destino.lat - origen.lat)
  const dLon = aRadianes(destino.lon - origen.lon)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(origen.lat)) * Math.cos(aRadianes(destino.lat)) * Math.sin(dLon / 2) ** 2
  const enLineaRecta = 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(a))
  return Math.round(enLineaRecta * FACTOR_CARRETERA)
}

// Si el gasoil sube, el pasaje sube (pero solo la parte que depende del combustible)
export function factorCombustible(precioGasoil) {
  return 1 - PESO_COMBUSTIBLE + PESO_COMBUSTIBLE * (precioGasoil / GASOIL_REFERENCIA)
}

// Los pasajes se cobran redondeados a 10 pesos
const redondear10 = (monto) => Math.round(monto / 10) * 10

export function calcularPasajes({ km, pasajeros, idaYVuelta, precioGasoil }) {
  const factor = factorCombustible(precioGasoil)
  const viajes = idaYVuelta ? 2 : 1

  return TRANSPORTES_INTERURBANOS.map((transporte) => {
    const disponible = !transporte.maxKm || km <= transporte.maxKm
    const porPersona = redondear10((transporte.base + transporte.porKm * km) * factor)
    const minutos = Math.round((km / transporte.velocidad) * 60 + transporte.minutosExtra)
    return {
      ...transporte,
      disponible,
      porPersona,
      total: porPersona * pasajeros * viajes,
      minutos,
    }
  })
}

export function calcularGastoUrbano({ transporte, viajesPorDia, diasPorSemana, precioGasoil }) {
  const porViaje = transporte.fijo
    ? transporte.precio
    : redondear10(transporte.precio * factorCombustible(precioGasoil))
  const diario = porViaje * viajesPorDia
  const semanal = diario * diasPorSemana
  return {
    porViaje,
    diario,
    semanal,
    mensual: Math.round(semanal * 4.33), // un mes tiene 4.33 semanas en promedio
  }
}

export function formatoPesos(monto, decimales = 0) {
  return (
    'RD$' +
    monto.toLocaleString('es-DO', {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    })
  )
}

export function formatoTiempo(minutos) {
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  if (horas === 0) return `${resto} min`
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`
}
