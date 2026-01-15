function setAlert(el, type, msg) {
    el.innerHTML = `<div class="alert alert-${type} mb-0">${msg}</div>`;
}

function renderFeatured(images) {
    const grid = document.getElementById("featuredGrid");
    grid.innerHTML = "";

    images.forEach((src) => {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3";
        col.innerHTML = `
      <div class="card rounded-4 overflow-hidden shadow-sm h-100">
        <img src="${src}" class="w-100 object-fit-cover" style="height: 170px" alt="Dog">
      </div>
    `;
        grid.appendChild(col);
    });
}

async function loadFeatured() {
    const alert = document.getElementById("homeAlert");
    const grid = document.getElementById("featuredGrid");
    alert.innerHTML = "";
    grid.innerHTML = "";

    setAlert(alert, "light", "Yükleniyor...");

    try {
        const data = await getFeaturedImages(12);
        if (!data?.message?.length) {
            setAlert(alert, "warning", "Veri bulunamadı.");
            return;
        }
        alert.innerHTML = "";
        renderFeatured(data.message);
    } catch (e) {
        setAlert(alert, "danger", "Şu an veriler alınamadı. İnternetinizi kontrol edin.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // quick search -> products.html?q=...
    const quickSearch = document.getElementById("quickSearch");
    const quickGo = document.getElementById("quickGo");
    if (quickSearch && quickGo) {
        quickSearch.addEventListener("input", () => {
            const q = quickSearch.value.trim();
            quickGo.href = q ? `products.html?q=${encodeURIComponent(q)}` : "products.html";
        });
    }

    document.getElementById("refreshFeatured")?.addEventListener("click", loadFeatured);
    loadFeatured();
});
