const API_URL = "https://dog.ceo/api/breeds/image/random/12";
const container = document.getElementById('dogContainer');

async function getPets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error();
        const data = await response.json();
        render(data.message);
    } catch (err) {
        console.error("API Hatası, Plan B yükleniyor...");
        loadPlanB();
    }
}

async function loadPlanB() {
    const alertBox = document.getElementById('statusAlert');
    if (alertBox) alertBox.innerHTML = `<div class="alert alert-info">İnternet/API sorunu: Örnek veriler gösteriliyor.</div>`;
    try {
        const res = await fetch('data/sample.json');
        const data = await res.json();
        render(data.message);
    } catch (e) { container.innerHTML = "Veri bulunamadı."; }
}

function render(images) {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';

    container.innerHTML = images.map(img => {
        const breed = img.split('/')[4];
        return `
            <div class="col-md-4 mb-4 pet-item">
                <div class="card shadow-sm h-100">
                    <img src="${img}" class="card-img-top" style="height:250px; object-fit:cover;">
                    <div class="card-body text-center">
                        <h5 class="card-title text-capitalize" style="color:#5D4037;">${breed}</h5>
                        <p class="small text-muted">Aşıları tam • Ücretsiz</p>
                        <a href="detail.html?breed=${breed}&img=${encodeURIComponent(img)}" class="btn btn-custom w-100">Tanışalım</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Arama Filtresi
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    document.querySelectorAll('.pet-item').forEach(item => {
        const title = item.querySelector('.card-title').innerText.toLowerCase();
        item.style.display = title.includes(val) ? 'block' : 'none';
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js'));
}

getPets();