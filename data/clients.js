/* Optional per-client personalisation. Link: index.html?name=Riya&c=acme
   - note: a line only this client sees under the hero
   - picks: work ids (from work.js) shown first in "made for you"
   A link without ?c= (or with an unknown one) simply skips the "made for you" row. */
window.OWLED_CLIENTS = {
  acme: {
    company: 'Acme Foods',
    note: 'from the first reel to the 4M-view festive film: thank you for saying yes to the wild ideas.',
    picks: ['w03', 'w08', 'w15'],
  },
  zest: {
    company: 'Zest Beauty',
    note: 'twelve creators, one launch week, zero sleep. worth it.',
    picks: ['w19', 'w20', 'w24'],
  },
};
