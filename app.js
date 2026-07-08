import { getApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const app = getApp();               // usa el app inicializado en index.html o fiesta.html
const db  = getFirestore(app);
const EVENTO = "15-Ada";

const form           = document.querySelector("form");
const inputNombre    = document.querySelector('form input[type="text"]');
const inputInvitados = document.querySelector('form input[type="number"]');

// Detectamos de qué HTML viene la vista
let tipoDeInvitacion = "primaria";
if (window.location.pathname.includes("fiesta.html")) {
    tipoDeInvitacion = "secundaria";
}

async function guardarAsistencia({ nombre, invitados, tipo }) {
    return addDoc(collection(db, "eventos", EVENTO, "confirmaciones"), {
        nombre,
        invitados,
        tipoInvitacion: tipo,
        createdAt: serverTimestamp()
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre    = (inputNombre.value    || "").trim();
    const invitados = Number(inputInvitados.value || "1");

    if (!nombre) {
        alert("Ingresá tu nombre y apellido.");
        return;
    }
    if (!Number.isFinite(invitados) || invitados < 1 || invitados > 20) {
        alert("Ingresá una cantidad válida de invitados (1–20).");
        return;
    }

    const btn     = form.querySelector('button[type="submit"]');
    const prevTxt = btn.textContent;
    btn.disabled     = true;
    btn.textContent  = "Enviando...";

    try {
        await guardarAsistencia({ nombre, invitados, tipo: tipoDeInvitacion });
        btn.textContent = "¡Confirmado! ✓";
        form.reset();

        // Restaura el texto original tras 3 segundos
        setTimeout(() => {
            btn.textContent = prevTxt;
            btn.disabled    = false;
        }, 3000);

    } catch (err) {
        console.error(err);
        alert("No se pudo guardar la confirmación. Intentá de nuevo.");
        btn.textContent = prevTxt;
        btn.disabled    = false;
    }
});
