/* ─────────────────────────────────────────────────────────────
   OWLED MEDIA · Diwali 2026 — everything you'd want to edit lives in data/.
   site.js    → brand, copy, the five numbers, stall categories, contact
   work.js    → the portfolio (25–30 pieces)
   clients.js → optional per-client notes + "made for you" picks
   ───────────────────────────────────────────────────────────── */
window.OWLED = {
  brand: {
    name: 'Owled Media',
    short: 'OWLED',
    tagline: 'stories that get watched',
    site: 'https://owled.media',          // PLACEHOLDER
  },

  defaultName: 'dost',

  copy: {
    loader: '{name}, your diwali wish is on its way',
    loaderSub: 'waking up the owl…',
    // the owl is Lakshmi's vahana: on diwali night it carries the light. that's us.
    sceneHint: 'drag the flame to each diya',
    sceneHintTouch: 'drag the flame to each diya',
    sceneAuto: 'light them for me ▸',
    sceneDone: 'shubh deepavali, {name}',
    heroKick: 'from all of us at owled media',
    heroTitle: 'happy diwali, {name}',
    heroLede: 'seven months, five diyas, one very busy owl. here’s what we lit up together this year.',
    melaTitle: 'the owled mela',
    melaSub: 'every stall holds a little of what we made. step in, look around.',
    forYouTitle: 'made for you, {name}',
    outroTitle: 'here’s to a brighter 2027',
    outroLede: 'thank you for trusting us with your stories. let’s make the next ones even louder.',
  },

  // each diya, once lit, reveals one number. keep it to five.
  stats: [
    { value: 48000000, label: 'views',            suffix: '+', fmt: 'short' },
    { value: 30,       label: 'pieces shipped',    suffix: '',  fmt: 'int' },
    { value: 12,       label: 'brands',            suffix: '',  fmt: 'int' },
    { value: 6.8,      label: 'avg. engagement',   suffix: '%', fmt: 'dec' },
    { value: 7,        label: 'months of diwali-level effort', suffix: '', fmt: 'int' },
  ],

  // stall order = the order they appear in the mela. `id` must match work.js `cat`.
  stalls: [
    { id: 'reels',     name: 'reels ki rangoli',   sub: 'short-form that stopped the scroll', color: '#e4407b', icon: 'rangoli' },
    { id: 'films',     name: 'brand film talkies', sub: 'long-form, big screen energy',       color: '#f5a524', icon: 'reel' },
    { id: 'campaigns', name: 'campaign patakhe',   sub: 'launches that went boom',            color: '#2bb5a3', icon: 'rocket' },
    { id: 'creators',  name: 'creator chaupal',    sub: 'influencer collabs that clicked',    color: '#7b5cff', icon: 'chat' },
    { id: 'design',    name: 'design ki dukaan',   sub: 'posts, carousels, key art',          color: '#ff7a2f', icon: 'brush' },
  ],

  contact: {
    email: 'hello@owled.media',            // PLACEHOLDER
    whatsapp: '919999999999',              // PLACEHOLDER: country code, no +
    wishText: 'Happy Diwali, Owled! 🪔 – {name}',
    instagram: 'https://instagram.com/',   // PLACEHOLDER
  },

  // optional: send link opens / stall visits to a Google Form (see README → "Tracking").
  // leave form empty to switch tracking off entirely.
  track: {
    form: '',
    fields: { name: 'entry.000000001', client: 'entry.000000002', event: 'entry.000000003', detail: 'entry.000000004' },
  },
};
