// Precios de referencia (octubre 2026).
// Gasoil regular: RD$270.80 por galón (MICM, semana del 24 al 30 de octubre de 2026).
// Metro y Teleférico de Santo Domingo: RD$20 por viaje; tarifa integrada RD$35.
// Los demás pasajes son estimados y se ajustan con el precio del gasoil.
export const GASOIL_REFERENCIA = 270.8

// Qué parte del pasaje depende del combustible (el resto es chofer, vehículo, peajes...)
export const PESO_COMBUSTIBLE = 0.4

// Transporte entre ciudades: precio = base + (precio por km × kilómetros)
export const TRANSPORTES_INTERURBANOS = [
  {
    id: 'expreso',
    nombre: 'Guagua expreso',
    icono: '🚌',
    detalle: 'Autobús con aire acondicionado, sale de terminal y casi no para.',
    base: 40,
    porKm: 2.5,
    velocidad: 70, // km por hora en promedio
    minutosExtra: 15,
  },
  {
    id: 'ruta',
    nombre: 'Guagua de ruta',
    icono: '🚐',
    detalle: 'Minibús que va recogiendo y dejando gente en el camino.',
    base: 30,
    porKm: 2.1,
    velocidad: 50,
    minutosExtra: 25,
  },
  {
    id: 'carro',
    nombre: 'Carro público',
    icono: '🚗',
    detalle: 'Concho entre pueblos cercanos. Solo para viajes cortos.',
    base: 30,
    porKm: 3.5,
    velocidad: 55,
    minutosExtra: 10,
    maxKm: 70, // más lejos de esto no hay carro público
  },
]

// Transporte dentro de la ciudad: precio fijo por viaje
export const TRANSPORTES_URBANOS = [
  {
    id: 'metro',
    nombre: 'Metro o Teleférico',
    icono: '🚇',
    precio: 20,
    fijo: true, // precio subsidiado: no sube con el gasoil
    ciudades: ['sdq'],
  },
  {
    id: 'integrada',
    nombre: 'Tarifa integrada',
    icono: '🔁',
    detalle: 'Metro + Teleférico + autobús en un mismo viaje',
    precio: 35,
    fijo: true,
    ciudades: ['sdq'],
  },
  {
    id: 'guaguaUrbana',
    nombre: 'Guagua urbana',
    icono: '🚌',
    precio: 50,
    ciudades: ['sdq', 'stgo'],
  },
  {
    id: 'concho',
    nombre: 'Carro público (concho)',
    icono: '🚗',
    precio: 60,
    ciudades: ['sdq', 'stgo'],
  },
  {
    id: 'motoconcho',
    nombre: 'Motoconcho',
    icono: '🛵',
    precio: 100,
    ciudades: ['sdq', 'stgo'],
  },
]

export const CIUDADES_URBANAS = [
  { id: 'sdq', nombre: 'Santo Domingo' },
  { id: 'stgo', nombre: 'Santiago' },
]
