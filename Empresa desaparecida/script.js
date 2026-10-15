const recoveryScreen = document.querySelector("#recovery-screen");
const restoreButton = document.querySelector("#restore-button");

if (!recoveryScreen) document.body.classList.add("recovery-seen");

if (recoveryScreen && !sessionStorage.getItem("mangle-signal-restored")) {
    restoreButton.addEventListener("click", () => {
        recoveryScreen.classList.add("recovered");
        document.body.classList.add("recovery-seen");
        sessionStorage.setItem("mangle-signal-restored", "true");
    });
} else if (recoveryScreen) {
    recoveryScreen.remove();
    document.body.classList.add("recovery-seen");
}

const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");
menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

document.querySelector(".theme-toggle")?.addEventListener("click", (event) => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    event.currentTarget.setAttribute("aria-label", isLight ? "Activar modo oscuro" : "Activar modo claro");
    event.currentTarget.querySelector("span").textContent = isLight ? "Modo claro" : "Modo noche";
    localStorage.setItem("mangle-theme", isLight ? "light" : "dark");
});

if (localStorage.getItem("mangle-theme") === "light") {
    document.body.classList.add("light-mode");
    const themeButton = document.querySelector(".theme-toggle");
    if (themeButton) {
        themeButton.setAttribute("aria-label", "Activar modo oscuro");
        themeButton.querySelector("span").textContent = "Modo claro";
    }
}

const chatLauncher = document.querySelector("#chat-launcher");
const chatPanel = document.querySelector("#chat-panel");
const chatClose = document.querySelector("#chat-close");

function setChatOpen(isOpen) {
    chatPanel.hidden = !isOpen;
    chatLauncher.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) document.querySelector("#chat-input").focus();
}

chatLauncher.addEventListener("click", () => setChatOpen(chatPanel.hidden));
chatClose.addEventListener("click", () => setChatOpen(false));

const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector("#chat-messages");
const chatInput = document.querySelector("#chat-input");

function guideReply(message) {
    const text = message.toLowerCase();
    if (text.includes("servicio") || text.includes("precio") || text.includes("web")) {
        return "Creamos estrategias de presencia resiliente, identidades visuales y webs accesibles. Mira «Nueva era» o escríbenos a hola@aandctecnology.do.";
    }
    if (text.includes("historia") || text.includes("misterio") || text.includes("usb") || text.includes("prueba")) {
        return "La señal se perdió a las 8:17 a. m. y reapareció un USB con una instrucción: reinventarnos. Tienes la cronología completa en «El misterio» y las pruebas en «Contacto / pruebas».";
    }
    if (text.includes("contact") || text.includes("correo") || text.includes("email") || text.includes("hola")) {
        return "¡Aquí estamos! Escríbenos a hola@aandctecnology.do. Somos un estudio ficticio para esta práctica, con raíces en Santo Domingo.";
    }
    return "¡Gracias por escribir! Puedo orientarte sobre nuestra historia, servicios o contacto. También puedes escribir a hola@aandctecnology.do.";
}

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    const userBubble = document.createElement("p");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = message;
    chatMessages.append(userBubble);

    const reply = document.createElement("p");
    reply.className = "chat-bubble";
    reply.textContent = guideReply(message);
    chatMessages.append(reply);
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.focus();
});

let secretKeys = "";
let toastTimer;
document.addEventListener("keydown", (event) => {
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        secretKeys = (secretKeys + event.key.toLowerCase()).slice(-4);
        if (secretKeys === "mang") {
            const easterEgg = document.querySelector("#easter-egg");
            easterEgg.classList.add("visible");
            window.clearTimeout(toastTimer);
            toastTimer = window.setTimeout(() => easterEgg.classList.remove("visible"), 4000);
            secretKeys = "";
        }
    }
});
