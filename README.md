🐾 PetTime - Kurumsal Hayvan Sahiplendirme PWA Platformu
PetTime, barınaklardaki can dostlarımızı modern teknolojiyle dijital dünyaya taşıyan, sosyal sorumluluk odaklı bir Progressive Web App (PWA) projesidir. Proje, bir hayvan sahiplendirme derneğinin kurumsal web sitesi senaryosu üzerine inşa edilmiştir.

📸 Ekran Görüntüleri
Ana Sayfa (Vitrin):

Dostumuzun Hikayesi (Detay):

🚀 Canlı Demo ve Video
Canlı Demo (GitHub Pages/Netlify): [CANLI_DEMO_LINKINI_BURAYA_YAZ]

Proje Tanıtım Videosu (YouTube/Drive): [VIDEO_LINKINI_BURAYA_YAZ]

🛠 Kullanılan Teknolojiler
1. API Bilgileri
Bu projede gerçek zamanlı veri çekimi için Dog CEO API kullanılmıştır.

API Adı: Dog CEO Public API

API Linki: https://dog.ceo/dog-api/

Kullanılan Endpoint Örnekleri:

https://dog.ceo/api/breeds/image/random/12 (Rastgele dostlarımızı listelemek için)

https://dog.ceo/api/breeds/list/all (Sistemdeki tüm cinsleri kontrol etmek için)

2. CSS Çatısı (Framework)
Projenin responsive (mobil uyumlu) ve modern tasarımı için Bootstrap 5.3 kullanılmıştır.

Link: https://getbootstrap.com/

Kullanım: Grid sistemi, kart bileşenleri, modal yapısı ve form doğrulama (validation) özelliklerinden yararlanılmıştır.

📱 PWA Özellikleri
Proje, bir web sitesinden daha fazlası olup aşağıdaki PWA standartlarını %100 karşılamaktadır:

📄 Manifest (manifest.json): Uygulama ismi, ikonlar ve kurumsal renkler tanımlanarak uygulamanın cihazlara indirilebilir (installable) olması sağlanmıştır.

🔧 Service Worker (service-worker.js):

App Shell Cache: HTML, CSS ve JS dosyaları önbelleğe alınarak hızlı açılış sağlanır.

Offline Fallback: İnternet bağlantısı kesildiğinde özel offline.html sayfası gösterilir.

📲 Kurulabilirlik: Uygulama Chrome ve Safari üzerinden "Ana Ekrana Ekle" seçeneği ile bir mobil uygulama gibi kullanılabilir.

🛡️ API Çalışmazsa (Plan B)
Şartname gereği, kamuya açık API'lerde yaşanabilecek kesintilere karşı bir yedek mekanizma kurulmuştur:

API hatası durumunda uygulama otomatik olarak /data/sample.json dosyasındaki yerel verileri yükler.

Kullanıcıya: "Canlı API erişilemiyor, örnek veri gösteriliyor." uyarısı sunularak kesintisiz deneyim sağlanır.

📂 Proje Sayfa Yapısı
Ana Sayfa: İşletme tanıtımı, arama/filtreleme alanı ve öne çıkan ilanlar.

Dostlarımız: API'den gelen tüm canlı verilerin listelendiği alan.

Detay Sayfası: Her hayvanın geçmişini, travmalarını ve özgeçmişini içeren detaylı görünüm.

Hakkımızda: Kurumsal vizyon ve teknik şartname tablosu.

İletişim: Input validation destekli sahiplenme başvuru formu.
<img width="1919" height="1079" alt="Ekran görüntüsü 2026-01-06 141730" src="https://github.com/user-attachments/assets/2e922ef8-b53b-46d1-bba1-bdfdf0aa34db" />
<img width="1919" height="1079" alt="Ekran görüntüsü 2026-01-06 141920" src="https://github.com/user-attachments/assets/1fd94cbc-e6ce-4336-8af1-222e475c3cb6" />
<img width="1919" height="1079" alt="Ekran görüntüsü 2026-01-06 141920" src="https://github.com/user-attachments/assets/1fd94cbc-e6ce-4336-8af1-222e475c3cb6" />

