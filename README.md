# Owled Media · Diwali 2026

A personalised Diwali wish for Owled Media's clients. The owl (Lakshmi's vahana, and our name) holds a lit diya. The guest carries its flame to five diyas, and each one reveals one of our numbers. Fireworks go off, then the guest walks into the **Owled mela**: five stalls holding 30 pieces of our work.

No framework and no build step: plain HTML, CSS and JavaScript, and all sound is synthesised in the browser.

## The flow

1. **Loader**: the owl blinks while fonts load, then one tap opens the wish (that tap is also what lets phones play sound).
2. **Light the diyas**: drag the flame from the owl's lamp to each diya, or tap a diya, or press "light them for me". Every diya you light makes the room brighter, plays a note and counts up a number.
3. **Reveal**: fireworks, then the greeting with the guest's name (plus a personal note if the link names a client).
4. **The mela**: our numbers, a "made for you" row for that client, five stalls of work with a viewer for each piece, a wish back on WhatsApp, and a shareable story card.

## Personal links

```
index.html?name=Riya+Shah            → "happy diwali, Riya"
index.html?name=Riya+Shah&c=acme     → plus Acme's note and their picks first
index.html                           → asks for a name on the loader
```

To send one: open `tools/links.html` (the send page), type the person's name, optionally pick their company, and tap **Send on WhatsApp**. WhatsApp opens with the message and their personal link, and you pick the contact. "Many people at once" makes a WhatsApp button per name from a pasted list (`Name, company` per line).

## Where to edit (no code needed)

| File | What's in it |
|---|---|
| `data/site.js` | Brand, every line of copy, the 5 numbers, the 5 stalls, contact, tracking |
| `data/work.js` | The portfolio: title, client, platform, month, views, thumbnail, link, one-line blurb |
| `data/clients.js` | Per-client note + which pieces to show in "made for you" |
| `assets/work/` | Thumbnails (WebP, 1080×1350). Leave `thumb: ''` for a generated cover |

Copy that uses `{name}` gets the guest's first name.

## Repo layout

```
index.html          the page
css/style.css       all styling (colour tokens at the top)
js/core.js          guest, number formatting, synthesised sound, tracking
js/scene.js         loader, owl, diyas, night lighting, particles, fireworks
js/mela.js          numbers, stalls, work cards, viewer, outro
js/share.js         1080×1920 share card
data/               the content (see above)
tools/links.html    bulk link maker
assets/             your images (thumbnails, og.jpg for link previews)
```

## Preview before publishing

- **GitHub Codespaces**: open the repo → Code → Codespaces → create, then run `python3 -m http.server 8080` and open the forwarded port.
- **On your computer**: double-click `index.html`. It works straight from the file, with no server.

## Publishing later (repo stays private)

Connect the private repo to **Cloudflare Pages**, **Netlify** or **Vercel** (all free, each gives a `*.pages.dev` / `*.netlify.app` / `*.vercel.app` address). No build command; the output directory is `/`. Every push to `main` goes live in about a minute.

## Tracking (optional)

1. Make a Google Form with four short-answer questions: name, client, event, detail.
2. Open the form's prefilled-link tool to find each question's `entry.123…` id.
3. Paste the form's `…/formResponse` URL and those ids into `site.js → track`.

Events: `open`, `reveal`, `stall`, `work`, `share`. Leave `form` empty and nothing is sent anywhere.

## Before you send it

- [ ] Real numbers in `site.js → stats`
- [ ] Real work in `data/work.js` (+ thumbnails in `assets/work/`)
- [ ] Contact email, WhatsApp number, website
- [ ] `assets/og.jpg` (1200×630) for the link preview on WhatsApp
- [ ] Test on an iPhone and an Android phone
