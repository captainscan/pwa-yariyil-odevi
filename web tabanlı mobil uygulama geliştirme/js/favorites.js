function alertHTML(type, msg) {
    return `<div class="alert alert-${type} mb-0">${msg}</div>`;
}

function titleCase(s) {
    return (s || "").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getFavs() {
    try {
        return JSON.parse(localStorage.getItem("pettime:favs") || "[]");
    } catch {
        return [];
    }
}

function setFavs(list) {
    localStorage.setItem("pettime:favs", JSON.stringify(list));
}

function setCount(n) {
    document.getElementById("favCount").textContent = String(n);
}

function parseFavId(id) {
    // id could be "bulldog" or "bulldog|french"
    const [breed, sub] = id.split("|");
    return { breed, sub: sub || "" };
}

function buildDetailHref(id) {
    const { breed, sub } = parseFavId(id);
    const base = `detail.html?id=${encodeURIComponent(breed)}`;
    return sub ? `${base}&sub=${encodeURIComponent(sub)}` : base;
}

async function getThumbFor(id) {
    // thumbnail = 1 random image from breed/subbreed
    const { breed, sub } = parseFavId(id);
    try {
        const data = sub
            ? await getSubBreedImages(breed, sub, 1)
            : await getBreedImages(breed, 1);

        const url = Array.isArray(data?.message) ? data.message[0] : data?.message;
        return url || "";
    } catch {
        return "";
    }
}

function renderSkeletons(count = 8) {
    const grid = document.getElementById("favGrid");
    grid.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
        col.innerHTML = `
      <div class="card rounded-4 shadow-sm h-100 overflow-hidden">
        <div class="skeleton-img"></div>
        <div class="card-body">
          <div class="skeleton-line w-60 mb-2"></div>
          <div class="skeleton-line w-80 mb-3"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>
    `;
        grid.appendChild(col);
    }
}

function renderFavCards(items, thumbsMap) {
    const grid = document.getElementById("favGrid");
    grid.innerHTML = "";

    items.forEach((fav) => {
        const { id, createdAt } = fav;
        const { breed, sub } = parseFavId(id);
        const title = sub ? `${breed} / ${sub}` : breed;

        const thumb = thumbsMap.get(id) || "";
        const imgBlock = thumb
            ? `<img src="${thumb}" class="w-100 object-fit-cover" style="height: 160px" alt="Pet">`
            : `<div class="d-flex align-items-center justify-content-center bg-cream" style="height:160px">
           <span class="text-muted small">Görsel yok</span>
         </div>`;

        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
        col.innerHTML = `
      <div class="card rounded-4 shadow-sm h-100 overflow-hidden">
        ${imgBlock}
        <div class="card-body">
          <div class="d-flex justify-content-between gap-2 align-items-start">
            <h3 class="h5 fw-bold mb-1 text-capitalize">${title}</h3>
            <button class="btn btn-fav is-active" data-fav-id="${id}" type="button" title="Favoriden çıkar">
              ★
            </button>
          </div>
          <div class="small text-muted mb-3">Kaydedildi: ${new Date(createdAt).toLocaleString("tr-TR")}</div>
          <a class="btn btn-brown w-100" href="${buildDetailHref(id)}">Detayı Gör</a>
        </div>
      </div>
    `;
        grid.appendChild(col);
    });
}

function applyFavFilterSort(all) {
    const q = document.getElementById("favSearch").value.trim().toLowerCase();
    const sort = document.getElementById("favSort").value;

    let list = all.filter((x) => {
        const { breed, sub } = parseFavId(x.id);
        return `${breed} ${sub}`.toLowerCase().includes(q);
    });

    if (sort === "az" || sort === "za") {
        list.sort((a, b) => {
            const A = a.id.toLowerCase();
            const B = b.id.toLowerCase();
            return A.localeCompare(B);
        });
        if (sort === "za") list.reverse();
    } else if (sort === "new") {
        list.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sort === "old") {
        list.sort((a, b) => a.createdAt - b.createdAt);
    }

    return list;
}

async function loadFavorites() {
    const state = document.getElementById("favState");
    const all = getFavs();
    setCount(all.length);

    if (all.length === 0) {
        state.innerHTML = alertHTML("light", "Henüz favori eklemedin. Dostlarımız sayfasından ★ ile ekleyebilirsin.");
        document.getElementById("favGrid").innerHTML = "";
        return;
    }

    state.innerHTML = alertHTML("light", "Yükleniyor...");
    renderSkeletons(8);

    const filtered = applyFavFilterSort(all);
    setCount(filtered.length);

    if (filtered.length === 0) {
        state.innerHTML = alertHTML("warning", "Aramana uygun favori bulunamadı.");
        document.getElementById("favGrid").innerHTML = "";
        return;
    }

    // thumbnails: parallel fetch (limit-friendly)
    const thumbsMap = new Map();
    await Promise.all(
        filtered.slice(0, 24).map(async (fav) => {
            const url = await getThumbFor(fav.id);
            thumbsMap.set(fav.id, url);
        })
    );

    state.innerHTML = alertHTML("light", `${filtered.length} favori listelendi.`);
    renderFavCards(filtered, thumbsMap);
}

function removeFavById(id) {
    const all = getFavs();
    const next = all.filter((x) => x.id !== id);
    setFavs(next);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("favSearch").addEventListener("input", loadFavorites);
    document.getElementById("favSort").addEventListener("change", loadFavorites);

    document.getElementById("clearFavs").addEventListener("click", () => {
        if (!confirm("Tüm favorileri silmek istiyor musun?")) return;
        setFavs([]);
        loadFavorites();
    });

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-fav-id]");
        if (!btn) return;

        const id = btn.getAttribute("data-fav-id");
        removeFavById(id);
        loadFavorites();
    });

    loadFavorites();
});
