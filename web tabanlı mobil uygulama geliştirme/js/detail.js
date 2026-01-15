function setDetailState(type, msg) {
    document.getElementById("detailState").innerHTML = `<div class="alert alert-${type} mb-0">${msg}</div>`;
}

function getParams() {
    const u = new URL(location.href);
    return {
        breed: u.searchParams.get("id"),
        sub: u.searchParams.get("sub") || ""
    };
}

// Favorites
function getFavs() {
    try { return JSON.parse(localStorage.getItem("pettime:favs") || "[]"); }
    catch { return []; }
}
function setFavs(list) {
    localStorage.setItem("pettime:favs", JSON.stringify(list));
    if (window.updateFavBadges) window.updateFavBadges();
}
function favIdFor(breed, sub) { return sub ? `${breed}|${sub}` : breed; }
function isFav(id) { return getFavs().some(x => x.id === id); }
function toggleFav(id) {
    const list = getFavs();
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) list.splice(idx, 1);
    else list.unshift({ id, createdAt: Date.now() });
    setFavs(list);
}

// Skeleton images
function renderImageSkeletons(count = 8) {
    const grid = document.getElementById("imagesGrid");
    grid.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3";
        col.innerHTML = `
      <div class="card rounded-4 overflow-hidden shadow-sm h-100">
        <div class="skeleton-img" style="height:190px"></div>
      </div>
    `;
        grid.appendChild(col);
    }
}

function renderImages(urls) {
    const grid = document.getElementById("imagesGrid");
    grid.innerHTML = "";

    urls.forEach((src) => {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3";
        col.innerHTML = `
      <div class="card rounded-4 overflow-hidden shadow-sm h-100">
        <img src="${src}" class="w-100 object-fit-cover" style="height: 190px" alt="Pet">
      </div>
    `;
        grid.appendChild(col);
    });
}

function updateFavBtn(id) {
    const btn = document.getElementById("favBtn");
    const active = isFav(id);
    btn.textContent = active ? "★ Favoride" : "☆ Favori";
    btn.classList.toggle("btn-outline-brown", !active);
    btn.classList.toggle("btn-brown", active);
}

async function loadDetail() {
    const { breed, sub } = getParams();
    const title = document.getElementById("breedTitle");
    const subtitle = document.getElementById("breedSubtitle");
    const applyBtn = document.getElementById("applyBtn");
    const favBtn = document.getElementById("favBtn");

    if (!breed) {
        title.textContent = "Detay";
        subtitle.textContent = "Geçersiz bağlantı.";
        setDetailState("warning", "Geçersiz bağlantı. Lütfen listeden seçim yapın.");
        return;
    }

    const fullName = sub ? `${breed} / ${sub}` : breed;
    title.textContent = `Irk: ${fullName}`;
    subtitle.textContent = sub ? "Alt ırka ait görseller gösteriliyor." : "Irka ait görseller gösteriliyor.";

    applyBtn.href = `contact.html?breed=${encodeURIComponent(fullName)}`;

    const favId = favIdFor(breed, sub);
    updateFavBtn(favId);

    favBtn.addEventListener("click", () => {
        toggleFav(favId);
        updateFavBtn(favId);
    });

    setDetailState("light", "Yükleniyor...");
    renderImageSkeletons(8);

    try {
        const data = sub
            ? await getSubBreedImages(breed, sub, 8)
            : await getBreedImages(breed, 8);

        const urls = Array.isArray(data?.message) ? data.message : [];
        if (urls.length === 0) {
            setDetailState("warning", "Bu seçim için görsel bulunamadı.");
            document.getElementById("imagesGrid").innerHTML = "";
            return;
        }

        document.getElementById("detailState").innerHTML = "";
        renderImages(urls);
    } catch (e) {
        setDetailState("danger", "Detay verileri alınamadı. İnternetinizi kontrol edin.");
        document.getElementById("imagesGrid").innerHTML = "";
    }
}

document.addEventListener("DOMContentLoaded", loadDetail);
