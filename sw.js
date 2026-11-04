const VERSION = "ds-v46";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-180.png", "css/shell.css", "css/app.css", "js/01-env.js", "js/02-util.js", "js/03-i18n.js", "js/04-format.js", "js/05-icons.js", "js/06-state.js", "js/07-storage.js", "js/08-domain.js", "js/09-stats.js", "js/10-charts.js", "js/11-sheets.js", "js/12-view-train.js", "js/13-view-logger.js", "js/14-view-home.js", "js/15-view-profile.js", "js/16-logger-core.js", "js/17-settings.js", "js/18-logger-widgets.js", "js/19-exercise-picker.js", "js/20-subscription.js", "js/21-day-sheet.js", "js/22-dated-new.js", "js/23-view-stats.js", "js/24-standards.js", "js/25-summary-image.js", "js/26-review-widgets.js", "js/27-profile-sheets.js", "js/28-plans-emom.js", "js/29-profile-chart.js", "js/30-view-exercises.js", "js/31-data-exlib.js", "js/32-data-exmeta.js", "js/33-render.js", "js/34-rest-timer.js", "js/35-workout.js", "js/36-backup.js", "js/37-auto-backup.js", "js/38-misc-sheets.js", "js/39-events-click.js", "js/40-events-input.js", "js/41-boot.js"];

// Instalacja: zapisuje wszystkie pliki aplikacji, żeby działała bez internetu.
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

// Aktywacja: usuwa kopie ze starszych wersji.
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function store(req, res) {
  if (res && (res.ok || res.type === "opaque")) {
    const copy = res.clone();
    caches.open(VERSION).then((c) => c.put(req, copy));
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // Pliki aplikacji: najpierw sieć (świeża wersja), bez sieci kopia z pamięci.
    e.respondWith(
      fetch(req).then((res) => store(req, res)).catch(() => caches.match(req).then((r) => r || caches.match("index.html")))
    );
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    // Czcionki: najpierw pamięć, potem sieć.
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => store(req, res))));
  }
});
