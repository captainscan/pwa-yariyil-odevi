const DOG_API_BASE = "https://dog.ceo/api";

async function fetchJSON(url, { timeoutMs = 9000 } = {}) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } finally {
        clearTimeout(t);
    }
}

// Endpoint 1: featured images
async function getFeaturedImages(count = 12) {
    return fetchJSON(`${DOG_API_BASE}/breeds/image/random/${count}`);
}

// Endpoint 2: list breeds
async function getBreedsList() {
    return fetchJSON(`${DOG_API_BASE}/breeds/list/all`);
}

// Endpoint 3: breed images
async function getBreedImages(breed, count = 8) {
    return fetchJSON(`${DOG_API_BASE}/breed/${encodeURIComponent(breed)}/images/random/${count}`);
}

// Endpoint 4: subbreed images
async function getSubBreedImages(breed, sub, count = 8) {
    return fetchJSON(`${DOG_API_BASE}/breed/${encodeURIComponent(breed)}/${encodeURIComponent(sub)}/images/random/${count}`);
}

// Plan B sample.json
async function getSampleBreeds() {
    const res = await fetch("data/sample.json");
    if (!res.ok) throw new Error("sample.json okunamadı");
    return await res.json();
}

/**
 * Local persistence helpers:
 * - last successful breeds list caching (offline-friendly)
 */
function saveLastBreedsList(list) {
    try {
        localStorage.setItem("pettime:lastBreeds", JSON.stringify({ t: Date.now(), list }));
    } catch { }
}

function readLastBreedsList() {
    try {
        const raw = JSON.parse(localStorage.getItem("pettime:lastBreeds") || "null");
        return raw?.list || null;
    } catch {
        return null;
    }
}
