/* The portfolio. ALL PLACEHOLDERS: swap in your real 25–30 pieces.
   id       unique, used by clients.js picks
   cat      one of the stall ids in site.js (reels, films, campaigns, creators, design)
   thumb    path like 'assets/work/w01.webp' (1080×1350 or 1080×1920 works best); leave '' for a generated cover
   link     where "watch" goes (instagram / youtube / drive); '' hides the button
   views    a plain number; it's formatted for you (4200000 → 4.2M)
   tall     true for 9:16 pieces (reels), false for 16:9 (films) */
window.OWLED_WORK = [
  { id: 'w01', cat: 'reels', title: 'the 5-second chai test', client: 'Acme Foods', platform: 'instagram', month: 'apr', views: 2100000, tall: true, thumb: '', link: '', blurb: 'a blind taste test that turned into a trend.' },
  { id: 'w02', cat: 'reels', title: 'office aunty diaries ep. 3', client: 'Nimbu Tea', platform: 'instagram', month: 'may', views: 3400000, tall: true, thumb: '', link: '', blurb: 'the series our audience asked for by name.' },
  { id: 'w03', cat: 'reels', title: 'monsoon mood board', client: 'Acme Foods', platform: 'instagram', month: 'jun', views: 1800000, tall: true, thumb: '', link: '', blurb: 'rain, pakoras and a 41% save rate.' },
  { id: 'w04', cat: 'reels', title: 'pov: your first salary', client: 'PaisaPal', platform: 'instagram', month: 'jun', views: 5200000, tall: true, thumb: '', link: '', blurb: 'relatable, then useful. in that order.' },
  { id: 'w05', cat: 'reels', title: 'sneaker unboxing in 1 take', client: 'Kicks & Co', platform: 'youtube shorts', month: 'jul', views: 960000, tall: true, thumb: '', link: '', blurb: 'one continuous shot, zero cuts, all hype.' },
  { id: 'w06', cat: 'reels', title: 'dadi reviews skincare', client: 'Zest Beauty', platform: 'instagram', month: 'aug', views: 4100000, tall: true, thumb: '', link: '', blurb: 'brutally honest and very loved.' },
  { id: 'w07', cat: 'reels', title: 'rakhi gift speedrun', client: 'Giftly', platform: 'instagram', month: 'aug', views: 1300000, tall: true, thumb: '', link: '', blurb: 'a 30-second gift guide that sold out a SKU.' },

  { id: 'w08', cat: 'films', title: 'ghar ki pehli diwali', client: 'Acme Foods', platform: 'youtube', month: 'oct', views: 4000000, tall: false, thumb: '', link: '', blurb: 'a 90-second festive film about a first home.' },
  { id: 'w09', cat: 'films', title: 'made in moradabad', client: 'Brasswork', platform: 'youtube', month: 'may', views: 720000, tall: false, thumb: '', link: '', blurb: 'a mini-doc on the artisans behind the brand.' },
  { id: 'w10', cat: 'films', title: 'the long drive', client: 'Roadie Cars', platform: 'youtube', month: 'jul', views: 2600000, tall: false, thumb: '', link: '', blurb: 'father, daughter, one road trip.' },
  { id: 'w11', cat: 'films', title: 'founders, unfiltered', client: 'PaisaPal', platform: 'linkedin', month: 'sep', views: 410000, tall: false, thumb: '', link: '', blurb: 'the brand story, told by the people who built it.' },
  { id: 'w12', cat: 'films', title: 'one kitchen, three generations', client: 'Nimbu Tea', platform: 'youtube', month: 'sep', views: 1900000, tall: false, thumb: '', link: '', blurb: 'recipes as heirlooms.' },

  { id: 'w13', cat: 'campaigns', title: '#chaiwithstrangers', client: 'Nimbu Tea', platform: 'multi', month: 'apr', views: 7800000, tall: false, thumb: '', link: '', blurb: 'a street activation that ran for 21 days online.' },
  { id: 'w14', cat: 'campaigns', title: 'the 1 rupee sale', client: 'Giftly', platform: 'multi', month: 'may', views: 3100000, tall: false, thumb: '', link: '', blurb: 'teasers, a countdown, a crashed (then fixed) site.' },
  { id: 'w15', cat: 'campaigns', title: 'festive pantry drop', client: 'Acme Foods', platform: 'multi', month: 'oct', views: 2300000, tall: false, thumb: '', link: '', blurb: 'launch film, 14 reels, 6 creators, one hamper.' },
  { id: 'w16', cat: 'campaigns', title: 'drive safe, drive home', client: 'Roadie Cars', platform: 'multi', month: 'aug', views: 1500000, tall: false, thumb: '', link: '', blurb: 'a safety campaign people actually shared.' },
  { id: 'w17', cat: 'campaigns', title: 'kicks for kids', client: 'Kicks & Co', platform: 'multi', month: 'sep', views: 880000, tall: false, thumb: '', link: '', blurb: 'buy one, give one: 4,000 pairs donated.' },
  { id: 'w18', cat: 'campaigns', title: 'money monday', client: 'PaisaPal', platform: 'multi', month: 'jun', views: 2700000, tall: false, thumb: '', link: '', blurb: 'a weekly finance series across four platforms.' },

  { id: 'w19', cat: 'creators', title: '12 creators, 1 lipstick', client: 'Zest Beauty', platform: 'instagram', month: 'jul', views: 6400000, tall: true, thumb: '', link: '', blurb: 'one shade, twelve very different looks.' },
  { id: 'w20', cat: 'creators', title: 'get ready with me: diwali', client: 'Zest Beauty', platform: 'instagram', month: 'oct', views: 2900000, tall: true, thumb: '', link: '', blurb: 'festive grwm with mid-tier creators.' },
  { id: 'w21', cat: 'creators', title: 'chef vs. home cook', client: 'Acme Foods', platform: 'youtube', month: 'aug', views: 1700000, tall: false, thumb: '', link: '', blurb: 'a cook-off series with food creators.' },
  { id: 'w22', cat: 'creators', title: 'finfluencer roundtable', client: 'PaisaPal', platform: 'youtube', month: 'sep', views: 640000, tall: false, thumb: '', link: '', blurb: 'four creators, one honest conversation about money.' },
  { id: 'w23', cat: 'creators', title: 'road trip takeover', client: 'Roadie Cars', platform: 'instagram', month: 'jul', views: 1200000, tall: true, thumb: '', link: '', blurb: 'creators drove, we filmed, everyone posted.' },
  { id: 'w24', cat: 'creators', title: 'skin school live', client: 'Zest Beauty', platform: 'instagram live', month: 'aug', views: 530000, tall: true, thumb: '', link: '', blurb: 'a dermat + creator live with 9k concurrent viewers.' },

  { id: 'w25', cat: 'design', title: 'festive key art system', client: 'Acme Foods', platform: 'print + social', month: 'oct', views: 900000, tall: false, thumb: '', link: '', blurb: 'one system, 60 adaptations.' },
  { id: 'w26', cat: 'design', title: 'money carousels', client: 'PaisaPal', platform: 'instagram', month: 'jun', views: 1100000, tall: true, thumb: '', link: '', blurb: 'the carousel template that saved 30k times.' },
  { id: 'w27', cat: 'design', title: 'packaging refresh', client: 'Nimbu Tea', platform: 'retail', month: 'may', views: 0, tall: false, thumb: '', link: '', blurb: 'new packs, same nostalgia.' },
  { id: 'w28', cat: 'design', title: 'sneaker drop posters', client: 'Kicks & Co', platform: 'instagram', month: 'sep', views: 450000, tall: true, thumb: '', link: '', blurb: 'risograph-style posters for a limited drop.' },
  { id: 'w29', cat: 'design', title: 'rakhi gift cards', client: 'Giftly', platform: 'print', month: 'aug', views: 0, tall: false, thumb: '', link: '', blurb: '12 illustrated cards, printed and shipped.' },
  { id: 'w30', cat: 'design', title: 'brass catalogue', client: 'Brasswork', platform: 'print + web', month: 'jul', views: 260000, tall: false, thumb: '', link: '', blurb: 'a lookbook that doubled as a website.' },
];
