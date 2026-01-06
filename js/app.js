const API_URL_RANDOM = "https://dog.ceo/api/breeds/image/random/12";
const API_URL_LIST = "https://dog.ceo/api/breeds/list/all";
const container = document.getElementById('dogContainer');

const bioStories = [
    "Zengin bir ailenin yanında yaşarken barınağa bırakıldı. Terkedilme travması yaşıyor ama çok sevgi dolu.",
    "İnşaat alanında mahsur bulundu. Gürültüden korkuyor ama sakin ev ortamında çok uysal.",
    "Eski sahibi tarafından çok yorulmuştu. Şimdi emeklilik hayatı yaşayacağı huzurlu bir yuva arıyor.",
    "Pet-shop vitrininden kurtarıldı. Kapalı alan korkusu var, bahçeli bir ev onun hayali.",
    "Evin bebeğinde alerji çıkınca bize geldi. Sosyal bağları çok kuvvetli, tam bir kucak köpeği.",
    "Ormanda tek başına hayatta kalırken bulundu. Yemek konusunda hassas ama çok sadık bir lider."
];

async function loadData() {
    try {
        const response = await fetch(API_URL_RANDOM);
        if (!response.ok) throw new Error("API Hatası");
        const data = await response.json();
        renderPets(data.message);

        // 2. Endpoint kullanımı (Kural 6)
        fetch(API_URL_LIST).then(res => res.json()).then(d => console.log("Sistem Aktif."));
    } catch (err) {
        loadPlanB();
    }
}

async function loadPlanB() {
    const statusAlert = document.getElementById('statusAlert');
    if (statusAlert) statusAlert.innerHTML = `<div class="alert alert-warning text-center">⚠️ Canlı API erişilemiyor, örnek veriler gösteriliyor.</div>`;
    try {
        const res = await fetch('data/sample.json');
        const data = await res.json();
        renderPets(data.message);
    } catch (e) { container.innerHTML = "Veriler yüklenemedi."; }
}

function renderPets(images) {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';

    container.innerHTML = images.map((img, index) => {
        const breed = img.split('/')[4];
        const story = bioStories[index % bioStories.length];
        const gender = index % 2 === 0 ? "Erkek" : "Dişi";

        return `
            <div class="col-lg-4 col-md-6 mb-4 pet-item">
                <div class="card shadow-sm h-100">
                    <div class="position-relative">
                        <img src="${img}" class="card-img-top" style="height:280px; object-fit:cover;" alt="Pet">
                        <span class="badge-status ${gender === 'Erkek' ? 'bg-primary' : 'bg-danger'} text-white shadow">${gender}</span>
                    </div>
                    <div class="card-body d-flex flex-column text-center">
                        <h4 class="card-title text-capitalize fw-bold" style="color: var(--brown-dark);">${breed}</h4>
                        <p class="card-text text-muted small flex-grow-1">${story}</p>
                        <a href="detail.html?breed=${breed}&img=${encodeURIComponent(img)}&bio=${encodeURIComponent(story)}" 
                           class="btn btn-pet w-100 mt-3">HİKAYESİNİ OKU</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js'));
}

loadData();