# PetTime (PWA)

Kurumsal senaryo: Barınak/sahiplendirme platformu. Public API ile güncel veri çekerek çok sayfalı bir PWA uygulaması.

## Kullanılan Teknolojiler
- CSS Framework: Bootstrap 5.3 (CDN) — https://getbootstrap.com/
- API: Dog CEO Public API — https://dog.ceo/dog-api/
- PWA: Manifest + Service Worker + Cache API

## Sayfalar (Multi-Page)
- index.html: Kurumsal giriş + vitrinde öne çıkan görseller + hızlı arama
- products.html: API verisinin ana listelendiği sayfa (arama + sıralama) ve her kart detail sayfasına gider
- detail.html: detail.html?id=... parametresiyle seçilen öğe detayı
- about.html: kurumsal tanıtım + amaç + kullanılan API/CSS + offline mantığı
- contact.html: form validasyon + başarı/hata mesajları (UI odaklı)

## PWA / Offline Mantığı
- App shell dosyaları (HTML/CSS/JS/icons) service-worker.js ile cache’lenir.
- İnternet yoksa offline.html gösterilir.
- API erişilemezse /data/sample.json devreye girer ve ekranda:
  “Canlı API erişilemiyor, örnek veri gösteriliyor.” uyarısı görünür.

## API Kullanımı
- Reminder:
  - Featured: /breeds/image/random/{n}
  - Breed list: /breeds/list/all
  - Breed detail images: /breed/{breed}/images/random/{n}

## Hata Durumları
- Loading: Yükleniyor… alert’i
- Boş veri: “Veri bulunamadı”
- Network/API error: kullanıcıya uyarı
