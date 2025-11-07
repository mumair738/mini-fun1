const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  "baseBuilder": {
    "ownerAddress": "0x064eDF609a89049Ddd3A59341F2F39D82eae1840"
  },
  accountAssociation: {
    header: "eyJmaWQiOjIzNjY2OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDY3MTQ2YzBDYmE4ODEwQ0U5OGFFMjE4MGU0RmExRWNBMjAxYzhGNTYifQ",
    payload: "eyJkb21haW4iOiJtaW5pLWZ1bjEudmVyY2VsLmFwcCJ9",
    signature: "SMxBfVy02g9EhqqDk2ossjFO+dI1dOIiGuAJ1XbrBdU4zo7MfLfwSeozG849bjqY+8j9hK+ejqgzz2nKpgJQixw="
  },
  miniapp: {
    version: "1",
    name: "Mini Fun Flip",
    subtitle: "Meme Flip Game",
    description: "Play and win with meme flip game - automatic wallet deduction",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/doge1.png`,
    splashImageUrl: `${ROOT_URL}/doge1.png`,
    splashBackgroundColor: "#0A56A0",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["meme", "game", "flip", "crypto", "wallet"],
    heroImageUrl: `${ROOT_URL}/doge1.png`,
    tagline: "Flip memes and win crypto rewards",
    ogTitle: "Mini Fun Flip - Meme Game",
    ogDescription: "Play the ultimate meme flip game with automatic wallet integration",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;

