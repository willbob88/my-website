/**
 * ============================================================================
 *  ARTIST PORTFOLIO CONFIGURATION & ARTWORK CATALOG
 * ============================================================================
 *  Edit this single file to update your name, bio, contact email, paintings,
 *  and Print-on-Demand ("Buy Print") links — no HTML or CSS editing required!
 */

window.SITE_CONFIG = {
  // 1. Your Artist / Studio Name (shown in header, hero, and footer)
  artistName: "Will Studio",
  tagline: "Original paintings in oil, acrylic, and watercolor — capturing quiet coastal light, natural forms, and unhurried moments.",
  location: "Studio & Gallery",

  // 2. Contact & Social Links (replace with your real email & links)
  email: "hello@yourdomain.com",
  instagramUrl: "", // e.g. "https://instagram.com/yourhandle"

  // 3. Optional free Formspree form URL (leave empty to use direct email links for $0)
  // Later, if you want visitors to submit the contact form without opening their email app,
  // create a free Formspree form and paste its URL here, e.g. "https://formspree.io/f/xxxxxxx"
  formspreeEndpoint: "",

  // 4. Optional Print Shop URL (leave empty until you open your Print-on-Demand store)
  // Examples: Printify Pop-Up Store, Printful Quick Store, Fourthwall, INPRNT, or Etsy
  printShopUrl: "",

  // 5. Artist Bio (shown in the About section)
  aboutHeading: "Light, texture, and the quiet rhythm of paint.",
  aboutParagraphs: [
    "Working across oil, acrylic, and watercolor, my practice explores the interplay of atmosphere, memory, and natural surface. Each painting begins with direct observation — shifting coastal light, weathered linen, and the unpredictable movement of pigment and water.",
    "Original works are created on archival linen canvas and handmade cotton paper. Fine art giclée prints are being prepared so collectors everywhere can bring these pieces into their homes."
  ],

  // 6. Featured hero painting ID (matches one of the `id` values below)
  featuredArtworkId: "late-light-headland"
};

/**
 * YOUR ARTWORKS
 * ----------------------------------------------------------------------------
 * To add a painting:
 *   1. Drop your image file into the `images/` folder (e.g. `images/my-painting.jpg`).
 *   2. Copy one of the blocks below and update the title, medium, size, and image path.
 *
 * To turn on Print-on-Demand for any painting later:
 *   Paste your Printful, Printify, Fourthwall, INPRNT, or Stripe Payment Link into
 *   `printUrl: "https://..."` — a "Order Archival Print" button will appear automatically!
 */
window.ARTWORKS = [
  {
    id: "late-light-headland",
    title: "Late Light Over the Headland",
    category: "Oil",
    medium: "Oil on Belgian linen",
    dimensions: "24 × 32 in",
    year: "2026",
    image: "images/oil-golden-meadow.jpg",
    orientation: "portrait",
    originalStatus: "Available",
    originalPrice: "$1,450",
    printUrl: "", // Paste Print-on-Demand product URL here when ready
    printPriceNote: "Archival prints coming soon",
    story: "Painted en plein air along the coastal bluff as afternoon warmth settled over wild grasses and sea spray. Built in layered impasto strokes to preserve the movement of wind and late sun."
  },
  {
    id: "harbor-lanterns-dusk",
    title: "Harbor Lanterns at Dusk",
    category: "Oil",
    medium: "Oil on stretched canvas",
    dimensions: "30 × 22 in",
    year: "2026",
    image: "images/oil-harbor-dusk.jpg",
    orientation: "landscape",
    originalStatus: "Available",
    originalPrice: "$1,680",
    printUrl: "",
    printPriceNote: "Archival prints coming soon",
    story: "A study of blue hour along a quiet fishing quay, where warm harbor lamps break across cool slate reflections in rhythmic palette-knife strokes."
  },
  {
    id: "morning-mist-cliffs",
    title: "Morning Mist, Sea Cliffs",
    category: "Watercolor",
    medium: "Watercolor on 300lb cold-press cotton",
    dimensions: "15 × 20 in",
    year: "2026",
    image: "images/watercolor-coastal-mist.jpg",
    orientation: "portrait",
    originalStatus: "Available",
    originalPrice: "$640",
    printUrl: "",
    printPriceNote: "Archival prints coming soon",
    story: "Translucent washes of Payne's grey and raw umber allowed to granulate naturally across deckle-edged cotton paper, evoking fog lifting from coastal stone."
  },
  {
    id: "earth-ochre-study-4",
    title: "Earth & Ochre Study No. 4",
    category: "Acrylic",
    medium: "Acrylic on raw unprimed linen",
    dimensions: "24 × 24 in",
    year: "2025",
    image: "images/acrylic-terracotta-forms.jpg",
    orientation: "square",
    originalStatus: "Available",
    originalPrice: "$1,120",
    printUrl: "",
    printPriceNote: "Archival prints coming soon",
    story: "An exploration of weight, gesture, and negative space. Matte terracotta, alabaster, muted olive, and charcoal strokes sit directly against exposed woven linen."
  },
  {
    id: "after-the-rain-valley",
    title: "After the Rain, Valley Road",
    category: "Acrylic",
    medium: "Acrylic on linen canvas",
    dimensions: "28 × 21 in",
    year: "2025",
    image: "images/acrylic-olive-horizon.jpg",
    orientation: "landscape",
    originalStatus: "Sold",
    originalPrice: "Private Collection",
    printUrl: "",
    printPriceNote: "Archival prints coming soon",
    story: "Broad, sweeping brushwork captures low rain clouds parting over hillside groves and sienna earth immediately after an autumn shower."
  },
  {
    id: "wild-olive-late-figs",
    title: "Wild Olive & Late Figs",
    category: "Watercolor",
    medium: "Watercolor on handmade deckle paper",
    dimensions: "12 × 16 in",
    year: "2026",
    image: "images/watercolor-botanical-study.jpg",
    orientation: "portrait",
    originalStatus: "Available",
    originalPrice: "$480",
    printUrl: "",
    printPriceNote: "Archival prints coming soon",
    story: "An intimate still-life botanical study painted from harvest cuttings in luminous transparent glazes of sap green, raw umber, and muted plum."
  }
];
