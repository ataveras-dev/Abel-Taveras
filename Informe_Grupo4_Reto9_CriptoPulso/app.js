"use strict";

const API_URL = "https://data-api.binance.vision/api/v3/ticker/24hr";
const REFRESH_INTERVAL = 15000;
const ALERT_STORAGE_KEY = "criptopulso-alertas-v1";
const THEME_STORAGE_KEY = "criptopulso-tema-v1";

const coins = [
  { symbol: "BTC", pair: "BTCUSDT", name: "Bitcoin", color: "#f7931a" },
  { symbol: "ETH", pair: "ETHUSDT", name: "Ethereum", color: "#8c8c8c" },
  { symbol: "BNB", pair: "BNBUSDT", name: "BNB", color: "#f3ba2f" },
  { symbol: "SOL", pair: "SOLUSDT", name: "Solana", color: "#72e7c4" },
  { symbol: "XRP", pair: "XRPUSDT", name: "XRP", color: "#ccd6dd" },
  { symbol: "ADA", pair: "ADAUSDT", name: "Cardano", color: "#2a71d0" },
  { symbol: "DOGE", pair: "DOGEUSDT", name: "Dogecoin", color: "#c2a633" },
  { symbol: "AVAX", pair: "AVAXUSDT", name: "Avalanche", color: "#e84142" }
];

const state = {
  prices: new Map(),
  alerts: loadAlerts(),
  search: "",
  loading: false
};

const elements = {
  priceGrid: document.querySelector("#priceGrid"),
  marketMessage: document.querySelector("#marketMessage"),
  connectionText: document.querySelector("#connectionText"),
  lastUpdate: document.querySelector("#lastUpdate"),
  refreshButton: document.querySelector("#refreshButton"),
  searchInput: document.querySelector("#searchInput"),
  alertForm: document.querySelector("#alertForm"),
  coinSelect: document.querySelector("#coinSelect"),
  conditionSelect: document.querySelector("#conditionSelect"),
  targetInput: document.querySelector("#targetInput"),
  formMessage: document.querySelector("#formMessage"),
  alertList: document.querySelector("#alertList"),
  emptyAlerts: document.querySelector("#emptyAlerts"),
  alertCount: document.querySelector("#alertCount"),
  notificationButton: document.querySelector("#notificationButton"),
  themeButton: document.querySelector("#themeButton"),
  toastContainer: document.querySelector("#toastContainer")
};

function loadAlerts() {
  try {
    const saved = JSON.parse(localStorage.getItem(ALERT_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveAlerts() {
  localStorage.setItem(ALERT_STORAGE_KEY, JSON.stringify(state.alerts));
}

function formatPrice(value) {
  if (!Number.isFinite(value)) return "—";
  const decimals = value >= 1000 ? 2 : value >= 1 ? 2 : value >= .01 ? 4 : 6;
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

function formatCompact(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("es-DO", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

async function fetchPrices() {
  if (state.loading) return;
  state.loading = true;
  elements.refreshButton.disabled = true;
  elements.marketMessage.textContent = "Actualizando datos del mercado…";

  try {
    const symbols = JSON.stringify(coins.map((coin) => coin.pair));
    const response = await fetch(`${API_URL}?symbols=${encodeURIComponent(symbols)}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const rows = await response.json();
    rows.forEach((row) => {
      state.prices.set(row.symbol, {
        price: Number(row.lastPrice),
        change: Number(row.priceChangePercent),
        high: Number(row.highPrice),
        low: Number(row.lowPrice),
        volume: Number(row.quoteVolume)
      });
    });

    elements.connectionText.textContent = "Datos en línea";
    elements.lastUpdate.textContent = `Actualizado ${new Intl.DateTimeFormat("es-DO", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date())}`;
    elements.marketMessage.textContent = "Los precios se actualizan automáticamente cada 15 segundos.";
    renderPrices();
    checkAlerts();
  } catch (error) {
    console.error("No se pudieron consultar los precios:", error);
    elements.connectionText.textContent = "Sin conexión con la API";
    elements.lastUpdate.textContent = "Reintentaremos automáticamente";
    elements.marketMessage.textContent = "No fue posible obtener precios nuevos. Verifica tu conexión a Internet.";
    if (!state.prices.size) renderPrices();
  } finally {
    state.loading = false;
    elements.refreshButton.disabled = false;
    elements.priceGrid.setAttribute("aria-busy", "false");
  }
}

function renderPrices() {
  const query = state.search.trim().toLowerCase();
  const filtered = coins.filter((coin) => `${coin.name} ${coin.symbol}`.toLowerCase().includes(query));

  if (!filtered.length) {
    elements.priceGrid.innerHTML = '<p class="empty-state">No encontramos una moneda con ese nombre.</p>';
    return;
  }

  elements.priceGrid.innerHTML = filtered.map((coin) => {
    const data = state.prices.get(coin.pair);
    const change = data?.change ?? NaN;
    const changeClass = change >= 0 ? "positive" : "negative";
    const arrow = change >= 0 ? "↗" : "↘";
    return `
      <article class="coin-card" style="--coin-color:${coin.color}">
        <div class="coin-heading">
          <span class="coin-icon" aria-hidden="true">${coin.symbol.slice(0, 2)}</span>
          <div><strong>${coin.name}</strong><span>${coin.symbol} / USD</span></div>
        </div>
        <p class="coin-price">${formatPrice(data?.price)}</p>
        <div class="coin-meta">
          <span class="change ${Number.isFinite(change) ? changeClass : ""}">${Number.isFinite(change) ? `${arrow} ${Math.abs(change).toFixed(2)}%` : "Sin datos"}</span>
          <span>Vol. ${formatCompact(data?.volume)}</span>
        </div>
      </article>`;
  }).join("");
}

function populateCoinSelect() {
  elements.coinSelect.innerHTML = coins.map((coin) => `<option value="${coin.pair}">${coin.name} (${coin.symbol})</option>`).join("");
}

function renderAlerts() {
  const activeCount = state.alerts.filter((alert) => !alert.triggered).length;
  elements.alertCount.textContent = `${activeCount} ${activeCount === 1 ? "activa" : "activas"}`;
  elements.emptyAlerts.hidden = state.alerts.length > 0;

  elements.alertList.innerHTML = state.alerts.map((alert) => {
    const coin = coins.find((item) => item.pair === alert.pair);
    const current = state.prices.get(alert.pair)?.price;
    return `
      <article class="alert-item">
        <span class="alert-symbol">${coin?.symbol || alert.pair.replace("USDT", "")}</span>
        <div>
          <strong>${alert.condition === "above" ? "Sube hasta" : "Baja hasta"} ${formatPrice(alert.target)}</strong>
          <p>${alert.triggered ? "Alerta alcanzada" : `Precio actual: ${formatPrice(current)}`}</p>
        </div>
        <button class="delete-button" type="button" data-delete-alert="${alert.id}" aria-label="Eliminar alerta">×</button>
      </article>`;
  }).join("");
}

function createAlert(event) {
  event.preventDefault();
  const target = Number(elements.targetInput.value);
  if (!Number.isFinite(target) || target <= 0) {
    elements.formMessage.textContent = "Escribe un precio válido mayor que cero.";
    return;
  }

  state.alerts.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    pair: elements.coinSelect.value,
    condition: elements.conditionSelect.value,
    target,
    triggered: false,
    createdAt: new Date().toISOString()
  });
  saveAlerts();
  renderAlerts();
  elements.targetInput.value = "";
  elements.formMessage.textContent = "Alerta creada y guardada en este navegador.";
  window.setTimeout(() => { elements.formMessage.textContent = ""; }, 3500);
  checkAlerts();
}

function deleteAlert(id) {
  state.alerts = state.alerts.filter((alert) => alert.id !== id);
  saveAlerts();
  renderAlerts();
}

function checkAlerts() {
  let changed = false;
  state.alerts.forEach((alert) => {
    if (alert.triggered) return;
    const price = state.prices.get(alert.pair)?.price;
    if (!Number.isFinite(price)) return;
    const reached = alert.condition === "above" ? price >= alert.target : price <= alert.target;
    if (!reached) return;

    alert.triggered = true;
    changed = true;
    const coin = coins.find((item) => item.pair === alert.pair);
    const title = `Alerta de ${coin?.name || alert.pair}`;
    const message = `El precio llegó a ${formatPrice(price)} (objetivo: ${formatPrice(alert.target)}).`;
    showToast(title, message);
    sendBrowserNotification(title, message);
  });

  if (changed) {
    saveAlerts();
    renderAlerts();
  } else {
    renderAlerts();
  }
}

function showToast(title, message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  elements.toastContainer.append(toast);
  window.setTimeout(() => toast.remove(), 7000);
}

function sendBrowserNotification(title, message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body: message, tag: "criptopulso-alerta" });
  }
}

async function requestNotifications() {
  if (!("Notification" in window)) {
    elements.formMessage.textContent = "Este navegador no admite notificaciones del sistema.";
    return;
  }
  const permission = await Notification.requestPermission();
  elements.formMessage.textContent = permission === "granted"
    ? "Notificaciones activadas. Mantén la página abierta para recibirlas."
    : "Permiso no concedido; las alertas aparecerán dentro de la página.";
  updateNotificationButton();
}

function updateNotificationButton() {
  if (!("Notification" in window)) {
    elements.notificationButton.textContent = "Notificaciones no disponibles";
    elements.notificationButton.disabled = true;
  } else if (Notification.permission === "granted") {
    elements.notificationButton.textContent = "✓ Notificaciones del navegador activadas";
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light") document.documentElement.dataset.theme = "light";
  elements.themeButton.textContent = document.documentElement.dataset.theme === "light" ? "☾" : "☼";
}

function toggleTheme() {
  const light = document.documentElement.dataset.theme === "light";
  if (light) delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = "light";
  localStorage.setItem(THEME_STORAGE_KEY, light ? "dark" : "light");
  elements.themeButton.textContent = light ? "☼" : "☾";
}

elements.refreshButton.addEventListener("click", fetchPrices);
elements.searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderPrices();
});
elements.alertForm.addEventListener("submit", createAlert);
elements.alertList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-alert]");
  if (button) deleteAlert(button.dataset.deleteAlert);
});
elements.notificationButton.addEventListener("click", requestNotifications);
elements.themeButton.addEventListener("click", toggleTheme);

initializeTheme();
populateCoinSelect();
renderAlerts();
updateNotificationButton();
fetchPrices();
window.setInterval(fetchPrices, REFRESH_INTERVAL);
