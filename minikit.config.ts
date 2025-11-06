const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjIzNjY2OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDY3MTQ2YzBDYmE4ODEwQ0U5OGFFMjE4MGU0RmExRWNBMjAxYzhGNTYifQ",
    payload: "eyJkb21haW4iOiJtaW5pLWZ1bjEudmVyY2VsLmFwcCJ9",
    signature: "SMxBfVy02g9EhqqDk2ossjFO+dI1dOIiGuAJ1XbrBdU4zo7MfLfwSeozG849bjqY+8j9hK+ejqgzz2nKpgJQixw="
  },
  miniapp: {
    version: "1",
    name: "Base NFT Mint",
    subtitle: "Mint ETH Price NFTs",
    description: "Mint free NFTs capturing live ETH price",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `https://upload.wikimedia.org/wikipedia/commons/8/8e/OOjs_UI_icon_image.svg`,
    splashImageUrl: `https://raw.githubusercontent.com/vercel/next.js/canary/examples/api-routes/public/vercel.svg`,
    splashBackgroundColor: "#6b46c1",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["nft", "minting", "price-tracking", "blockchain"],
    heroImageUrl: `https://upload.wikimedia.org/wikipedia/commons/8/8e/OOjs_UI_icon_image.svg`,
    tagline: "Mint NFTs capturing live ETH prices",
    ogTitle: "Base NFT Mint - Live ETH Price NFTs",
    ogDescription: "Mint unique NFTs that capture the exact ETH price at the moment of minting",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;

