// Ciudades de República Dominicana con su ubicación (latitud y longitud).
// Con la ubicación calculamos la distancia entre dos ciudades.
export const CIUDADES = [
  { id: 'sdq', nombre: 'Santo Domingo', region: 'Ozama', lat: 18.4861, lon: -69.9312 },
  { id: 'stgo', nombre: 'Santiago', region: 'Cibao', lat: 19.4517, lon: -70.697 },
  { id: 'vega', nombre: 'La Vega', region: 'Cibao', lat: 19.2221, lon: -70.5296 },
  { id: 'moca', nombre: 'Moca', region: 'Cibao', lat: 19.3941, lon: -70.5256 },
  { id: 'sfm', nombre: 'San Francisco de Macorís', region: 'Cibao', lat: 19.3008, lon: -70.2526 },
  { id: 'bonao', nombre: 'Bonao', region: 'Cibao', lat: 18.9424, lon: -70.4092 },
  { id: 'cotui', nombre: 'Cotuí', region: 'Cibao', lat: 19.0527, lon: -70.1492 },
  { id: 'jarabacoa', nombre: 'Jarabacoa', region: 'Cibao', lat: 19.1167, lon: -70.6333 },
  { id: 'constanza', nombre: 'Constanza', region: 'Cibao', lat: 18.9092, lon: -70.7469 },
  { id: 'pop', nombre: 'Puerto Plata', region: 'Norte', lat: 19.7934, lon: -70.6884 },
  { id: 'mao', nombre: 'Mao', region: 'Noroeste', lat: 19.5517, lon: -71.0781 },
  { id: 'montecristi', nombre: 'Montecristi', region: 'Noroeste', lat: 19.8486, lon: -71.645 },
  { id: 'dajabon', nombre: 'Dajabón', region: 'Noroeste', lat: 19.5486, lon: -71.7083 },
  { id: 'nagua', nombre: 'Nagua', region: 'Nordeste', lat: 19.3833, lon: -69.85 },
  { id: 'samana', nombre: 'Samaná', region: 'Nordeste', lat: 19.2056, lon: -69.3361 },
  { id: 'montePlata', nombre: 'Monte Plata', region: 'Ozama', lat: 18.807, lon: -69.7845 },
  { id: 'spm', nombre: 'San Pedro de Macorís', region: 'Este', lat: 18.4539, lon: -69.3086 },
  { id: 'romana', nombre: 'La Romana', region: 'Este', lat: 18.4273, lon: -68.9728 },
  { id: 'hatoMayor', nombre: 'Hato Mayor', region: 'Este', lat: 18.7628, lon: -69.2568 },
  { id: 'seibo', nombre: 'El Seibo', region: 'Este', lat: 18.765, lon: -69.0389 },
  { id: 'higuey', nombre: 'Higüey', region: 'Este', lat: 18.615, lon: -68.7076 },
  { id: 'puj', nombre: 'Punta Cana', region: 'Este', lat: 18.5601, lon: -68.3725 },
  { id: 'sc', nombre: 'San Cristóbal', region: 'Sur', lat: 18.4167, lon: -70.1 },
  { id: 'bani', nombre: 'Baní', region: 'Sur', lat: 18.2796, lon: -70.3319 },
  { id: 'azua', nombre: 'Azua', region: 'Sur', lat: 18.4532, lon: -70.7349 },
  { id: 'sjm', nombre: 'San Juan de la Maguana', region: 'Sur', lat: 18.8056, lon: -71.2297 },
  { id: 'barahona', nombre: 'Barahona', region: 'Sur', lat: 18.2085, lon: -71.1008 },
  { id: 'pedernales', nombre: 'Pedernales', region: 'Sur', lat: 18.0383, lon: -71.7444 },
]

export function buscarCiudad(id) {
  return CIUDADES.find((ciudad) => ciudad.id === id)
}
