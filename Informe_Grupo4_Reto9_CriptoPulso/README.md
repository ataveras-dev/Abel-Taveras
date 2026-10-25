# CriptoPulso — Reto 9

Aplicación web del **Reto 9 en grupo** de Programación III: un monitor de precios de criptomonedas con alertas personalizadas.

## Funcionalidades

- Consulta precios reales de ocho criptomonedas mediante la API pública de Binance.
- Actualiza automáticamente los datos cada 15 segundos.
- Muestra precio, cambio porcentual de 24 horas y volumen.
- Permite buscar monedas por nombre o símbolo.
- Permite crear alertas para cuando una moneda suba o baje hasta un precio objetivo.
- Guarda las alertas y el tema visual en `localStorage`.
- Emite una notificación del navegador (si el usuario concede permiso) y una notificación dentro de la página.
- Incluye diseño responsivo, modo claro/oscuro y estados de error.

## Cómo ejecutar

1. Abre `index.html` en un navegador moderno.
2. Se requiere conexión a Internet para consultar los precios.
3. Para notificaciones del sistema, pulsa **Activar notificaciones del navegador** y acepta el permiso.

> Algunos navegadores limitan las notificaciones al abrir archivos directamente. Si sucede, ejecuta un servidor local en esta carpeta, por ejemplo: `python -m http.server 8000`, y visita `http://localhost:8000`.

## Estructura

```text
index.html
Guia_de_exposicion_Reto9_CriptoPulso.docx
Guia_de_exposicion_Reto9_CriptoPulso.pdf
css/
  styles.css
js/
  app.js
```

La guía de exposición contiene el material explicativo del reto, un reparto sugerido para el grupo, el recorrido pantalla-código-prueba, preguntas frecuentes y una hoja corta para presentar.

## Fuente de datos

Se utiliza el endpoint público de datos de mercado de Binance:

`https://data-api.binance.vision/api/v3/ticker/24hr`

Proyecto académico. La información mostrada no constituye asesoría financiera.
