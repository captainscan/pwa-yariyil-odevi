// Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            await navigator.serviceWorker.register("service-worker.js");
        } catch {
            // ignore
        }
    });
}

// Install prompt
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const btn = document.getElementById("installBtn");
    if (btn) btn.classList.remove("d-none");
});

window.addEventListener("appinstalled", () => {
    const hint = document.getElementById("installHint");
    if (hint) hint.textContent = "Uygulama kuruldu ✅";
});

document.addEventListener("click", async (e) => {
    if (e.target?.id !== "installBtn") return;
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;

    const btn = document.getElementById("installBtn");
    if (btn) btn.classList.add("d-none");
});

// Favorites count badge (optional if you add span elements)
function getFavsCount() {
    try {
        const arr = JSON.parse(localStorage.getItem("pettime:favs") || "[]");
        return Array.isArray(arr) ? arr.length : 0;
    } catch {
        return 0;
    }
}

function updateFavBadges() {
    const n = getFavsCount();
    document.querySelectorAll("[data-fav-count]").forEach((el) => {
        el.textContent = String(n);
        el.classList.toggle("d-none", n === 0);
    });
}

window.addEventListener("storage", (e) => {
    if (e.key === "pettime:favs") updateFavBadges();
});

document.addEventListener("DOMContentLoaded", updateFavBadges);
window.updateFavBadges = updateFavBadges; // allow other scripts to call
