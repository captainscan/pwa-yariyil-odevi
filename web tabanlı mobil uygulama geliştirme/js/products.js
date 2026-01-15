let allBreeds = [];
let usingFallback = false;

function showState(html) {
    document.getElementById("stateArea").innerHTML = html;
}

function setFallbackBadge(on) {
    const badge = document.getElementById("fallbackBadge");
    if (!badge) return;
    badge.classList.toggle("d-none", !on);
}

function normalizeBreeds(apiJson) {
    // Dog CEO /breeds/list/all -> { message: { breed: [subbreeds...] }, status: "success" }
    const obj = apiJson?.message || {};
    return Object.keys(obj).map(b => ({
        id: b,
        name: b,
        subbreeds: obj[b] || []
    }));
}

// ---- Favorites helpers
function getFavs() {
    try {
        return JSON.parse(localStorage.getItem("pettime:favs") || "[]");
    } catch {
        return [];
    }
}

function isFav(id) {
    return getFavs().some(x => x.id === id);
}

function toggleFav(id) {
    const list = getFavs();
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) list.splice(idx, 1);
    else list.unshift({ id, createdAt: Date.now() });

    localStorage.setItem("pettime:favs", JSON.stringify(list));
    if (window.updateFavBadges) window.updateFavBadges();
}

function favIdFor(breed, sub) {
    return sub ? `${breed}|${sub}` : breed;
}

function badgeHTML(breed, sub) {
    const href = `detail.html?id=${encodeURIComponent(breed)}&sub=${encodeURIComponent(sub)}`;
    return `<a class="badge text-bg-light border text-decoration-none me-1 mb-1" href="${href}">${sub}</a>`;
}

// ---- Skeleton loader
function renderSkeletons(count = 12) {
    const grid = document.getElementById("listGrid");
    grid.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
        col.innerHTML = `
      <div class="card rounded-4 shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <div class="skeleton-line w-60 mb-2"></div>
            <div class="skeleton-circle"></div>
          </div>
          <div class="skeleton-line w-80 mb-2"></div>
          <div class="skeleton-line w-40 mb-3"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>
    `;
        grid.appendChild(col);
    }
}

function renderList(list) {
    const grid = document.getElementById("listGrid");
    grid.innerHTML = "";

    list.forEach((item) => {
        const subs = item.subbreeds?.length ? item.subbreeds : [];
        const subsBadges = subs.slice(0, 8).map(s => badgeHTML(item.name, s)).join("");
        const subsInfo = subs.length ? `${subs.length} alt tür` : "Alt tür yok";

        const favMainId = favIdFor(item.id, "");
        const favActive = isFav(favMainId);

        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

        col.innerHTML = `
      <div class="card rounded-4 shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex align-items-start justify-content-between gap-2">
            <div>
              <h3 class="h5 fw-bold mb-1 text-capitalize">${item.name}</h3>
              <span class="badge text-bg-light border">${subsInfo}</span>
            </div>

            <button class="btn btn-fav ${favActive ? "is-active" : ""}"
                    data-fav-toggle="${favMainId}"
                    type="button"
                    title="${favActive ? "Favoriden çıkar" : "Favoriye ekle"}">
              ${favActive ? "★" : "☆"}
            </button>
          </div>

          <p class="text-muted small mb-2 mt-2">
            Detay sayfasında bu ırka ait görselleri görüntüleyebilirsin.
          </p>

          ${subs.length ? `<div class="mb-2 small text-muted">Alt türler:</div>
                           <div class="d-flex flex-wrap">${subsBadges}</div>` : ""}

          <a class="btn btn-brown w-100 mt-2" href="detail.html?id=${encodeURIComponent(item.id)}">Detayı Gör</a>
        </div>
      </div>
    `;
        grid.appendChild(col);
    });
}

function readQueryParam(name) {
    const u = new URL(location.href);
    return u.searchParams.get(name);
}

function applyFilters() {
    const q = document.getElementById("searchInput").value.trim().toLowerCase();
    const sort = document.getElementById("sortSelect").value;

    let list = allBreeds.filter(x => {
        const main = x.name.includes(q);
        const sub = (x.subbreeds || []).some(s => s.includes(q));
        return main || sub;
    });

    list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") list.reverse();

    renderList(list);

    if (list.length === 0) {
        showState(`<div class="alert alert-warning mb-0">Sonuç bulunamadı.</div>`);
    } else {
        showState(usingFallback
            ? `<div class="alert alert-warning mb-0">Canlı API erişilemiyor, örnek veri gösteriliyor.</div>`
            : `<div class="alert alert-light mb-0">${list.length} sonuç listelendi.</div>`);
    }
}

async function loadBreeds() {
    showState(`<div class="alert alert-light mb-0">Yükleniyor...</div>`);
    renderSkeletons(12);

    // 1) Try API
    try {
        const api = await getBreedsList();
        allBreeds = normalizeBreeds(api);
        usingFallback = false;
        setFallbackBadge(false);

        // Save last successful list for offline use
        saveLastBreedsList(allBreeds);
    } catch (e) {
        // 2) Try last cached list
        const cached = readLastBreedsList();
        if (cached && Array.isArray(cached) && cached.length) {
            allBreeds = cached;
            usingFallback = true;          // still show warning (no live API now)
            setFallbackBadge(true);
        } else {
            // 3) Plan B sample.json
            const sample = await getSampleBreeds();
            allBreeds = sample?.breeds || [];
            usingFallback = true;
            setFallbackBadge(true);
        }
    }

    const q = readQueryParam("q");
    if (q) document.getElementById("searchInput").value = q;

    applyFilters();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchInput").addEventListener("input", applyFilters);
    document.getElementById("sortSelect").addEventListener("change", applyFilters);

    document.getElementById("clearBtn").addEventListener("click", () => {
        document.getElementById("searchInput").value = "";
        document.getElementById("sortSelect").value = "az";
        applyFilters();
    });

    // Fav toggle (event delegation)
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-fav-toggle]");
        if (!btn) return;

        const id = btn.getAttribute("data-fav-toggle");
        toggleFav(id);

        // update button UI immediately
        const active = isFav(id);
        btn.classList.toggle("is-active", active);
        btn.textContent = active ? "★" : "☆";
        btn.title = active ? "Favoriden çıkar" : "Favoriye ekle";
    });

    loadBreeds().catch(() => {
        showState(`<div class="alert alert-danger mb-0">Beklenmeyen bir hata oluştu.</div>`);
    });
});
