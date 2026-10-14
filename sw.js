/* Safari Field Guide service worker — offline app shell + photos */
const CACHE = 'sfg-v4';
const CORE = [
  'css/style.css',
  'js/app.js',
  'manifest.json',
  'favicon.ico',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];
const IMAGES = [
  'img/aardvark.jpg',
  'img/aardwolf.jpg',
  'img/african-bush-elephant.jpg',
  'img/african-civet.jpg',
  'img/african-darter.jpg',
  'img/african-fish-eagle.jpg',
  'img/african-hawk-eagle.jpg',
  'img/african-hoopoe.jpg',
  'img/african-jacana.jpg',
  'img/african-rock-python.jpg',
  'img/african-skimmer.jpg',
  'img/african-spoonbill.jpg',
  'img/african-wild-dog.jpg',
  'img/african-wildcat.jpg',
  'img/banded-mongoose.jpg',
  'img/baobab.jpg',
  'img/bat-eared-fox.jpg',
  'img/bateleur.jpg',
  'img/black-backed-jackal.jpg',
  'img/black-heron.jpg',
  'img/black-mamba.jpg',
  'img/black-rhinoceros.jpg',
  'img/black-wildebeest.jpg',
  'img/black-winged-stilt.jpg',
  'img/blacksmith-lapwing.jpg',
  'img/blue-duiker.jpg',
  'img/blue-wildebeest.jpg',
  'img/bontebok-blesbok.jpg',
  'img/brown-snake-eagle.jpg',
  'img/bush-duiker.jpg',
  'img/bushbuck.jpg',
  'img/camelthorn.jpg',
  'img/cape-buffalo.jpg',
  'img/cape-clawless-otter.jpg',
  'img/cape-porcupine.jpg',
  'img/caracal.jpg',
  'img/cattle-egret.jpg',
  'img/chacma-baboon.jpg',
  'img/cheetah.jpg',
  'img/common-dwarf-mongoose.jpg',
  'img/common-eland.jpg',
  'img/common-moorhen.jpg',
  'img/common-ostrich.jpg',
  'img/common-reedbuck.jpg',
  'img/cormorant.jpg',
  'img/eastern-chimpanzee.jpg',
  'img/egyptian-goose.jpg',
  'img/epauletted-fruit-bat.jpg',
  'img/fever-tree.jpg',
  'img/flap-necked-chameleon.jpg',
  'img/fork-tailed-drongo.jpg',
  'img/gemsbok.jpg',
  'img/genet.jpg',
  'img/gerenuk.jpg',
  'img/golden-monkey.jpg',
  'img/goliath-heron.jpg',
  'img/grant-s-gazelle.jpg',
  'img/great-white-pelican.jpg',
  'img/greater-flamingo.jpg',
  'img/greater-kudu.jpg',
  'img/grey-cheeked-mangabey.jpg',
  'img/grey-go-away-bird.jpg',
  'img/grey-heron.jpg',
  'img/grey-rhebok.jpg',
  'img/hadada-ibis.jpg',
  'img/hamerkop.jpg',
  'img/hartebeest.jpg',
  'img/helmeted-guineafowl.jpg',
  'img/hippopotamus.jpg',
  'img/hirola.jpg',
  'img/honey-badger.jpg',
  'img/impala.jpg',
  'img/jackalberry.jpg',
  'img/kirk-s-dik-dik.jpg',
  'img/klipspringer.jpg',
  'img/kori-bustard.jpg',
  'img/l-hoest-s-monkey.jpg',
  'img/lappet-faced-vulture.jpg',
  'img/leadwood.jpg',
  'img/leopard-tortoise.jpg',
  'img/leopard.jpg',
  'img/lesser-kudu.jpg',
  'img/lilac-breasted-roller.jpg',
  'img/lion.jpg',
  'img/malachite-kingfisher.jpg',
  'img/marabou-stork.jpg',
  'img/martial-eagle.jpg',
  'img/marula.jpg',
  'img/masai-giraffe.jpg',
  'img/meerkat.jpg',
  'img/mopane.jpg',
  'img/mountain-gorilla.jpg',
  'img/mountain-reedbuck.jpg',
  'img/mozambique-spitting-cobra.jpg',
  'img/nile-crocodile.jpg',
  'img/nile-monitor.jpg',
  'img/nyala.jpg',
  'img/open-billed-stork.jpg',
  'img/oribi.jpg',
  'img/pel-s-fishing-owl.jpg',
  'img/pied-kingfisher.jpg',
  'img/plains-zebra.jpg',
  'img/puff-adder.jpg',
  'img/puku.jpg',
  'img/red-billed-hornbill.jpg',
  'img/red-billed-oxpecker.jpg',
  'img/red-duiker.jpg',
  'img/red-lechwe.jpg',
  'img/reed-cormorant.jpg',
  'img/roan-antelope.jpg',
  'img/rock-hyrax.jpg',
  'img/sable-antelope.jpg',
  'img/saddle-billed-stork.jpg',
  'img/sausage-tree.jpg',
  'img/scrub-hare.jpg',
  'img/secretarybird.jpg',
  'img/serval.jpg',
  'img/sharpe-s-grysbok.jpg',
  'img/side-striped-jackal.jpg',
  'img/sitatunga.jpg',
  'img/slender-mongoose.jpg',
  'img/southern-carmine-bee-eater.jpg',
  'img/southern-giraffe.jpg',
  'img/southern-ground-hornbill.jpg',
  'img/southern-lesser-galago.jpg',
  'img/southern-yellow-billed-hornbill.jpg',
  'img/spotted-eagle-owl.jpg',
  'img/spotted-hyena.jpg',
  'img/springbok.jpg',
  'img/springhare.jpg',
  'img/spur-winged-goose.jpg',
  'img/squacco-heron.jpg',
  'img/steenbok.jpg',
  'img/steppe-buzzard.jpg',
  'img/suni.jpg',
  'img/superb-starling.jpg',
  'img/tawny-eagle.jpg',
  'img/thomson-s-gazelle.jpg',
  'img/tree-squirrel.jpg',
  'img/tsessebe.jpg',
  'img/uganda-kob.jpg',
  'img/variable-skink.jpg',
  'img/vervet-monkey.jpg',
  'img/wahlberg-s-eagle.jpg',
  'img/warthog.jpg',
  'img/water-mongoose.jpg',
  'img/waterbuck.jpg',
  'img/western-osprey.jpg',
  'img/whistling-duck.jpg',
  'img/white-backed-vulture.jpg',
  'img/white-rhinoceros.jpg',
  'img/white-stork.jpg',
  'img/woodland-kingfisher.jpg',
  'img/yellow-billed-stork.jpg',
  'img/yellow-mongoose.jpg',
  'img/golden-jackal-african-wolf.jpg',
  'img/cape-fur-seal.jpg',
  'img/southern-right-whale.jpg',
  'img/brown-hyena.jpg',
  'img/african-penguin.jpg',
  'img/striped-hyena.jpg',
  'img/grey-crowned-crane.jpg',
  'img/shoebill.jpg',
  'img/somali-ostrich.jpg',
  'img/abyssinian-ground-hornbill.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE).then(() =>
        Promise.allSettled(IMAGES.map((u) => c.add(u)))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Page navigations: network-first, fall back to the cached page (offline).
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Same-origin assets (css, js, photos): cache-first, then network (and cache it).
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }))
    );
    return;
  }

  // Cross-origin (Google Fonts): stale-while-revalidate.
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
