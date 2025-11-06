function _withValidProperties(properties: Record<string, undefined | string | string[]>) {
   return Object.fromEntries(
     Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
   );
 }

export async function GET() {
   const _URL = process.env.NEXT_PUBLIC_URL as string;
  const { minikitConfig } = await import('../../../minikit.config');
  return Response.json({
    accountAssociation: minikitConfig.accountAssociation,
    baseBuilder: {
      allowedAddresses: ["0x67146c0Cba8810CE98aE2180e4Fa1EcA201c8F56"] // add your Base Account address here
    },
    miniapp: {
      version: minikitConfig.miniapp.version,
      name: minikitConfig.miniapp.name,
      homeUrl: minikitConfig.miniapp.homeUrl,
      iconUrl: minikitConfig.miniapp.iconUrl,
      splashImageUrl: minikitConfig.miniapp.splashImageUrl,
      splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
      webhookUrl: minikitConfig.miniapp.webhookUrl,
      subtitle: minikitConfig.miniapp.subtitle,
      description: minikitConfig.miniapp.description,
      screenshotUrls: minikitConfig.miniapp.screenshotUrls,
      primaryCategory: minikitConfig.miniapp.primaryCategory,
      tags: minikitConfig.miniapp.tags,
      heroImageUrl: minikitConfig.miniapp.heroImageUrl,
      tagline: minikitConfig.miniapp.tagline,
      ogTitle: minikitConfig.miniapp.ogTitle,
      ogDescription: minikitConfig.miniapp.ogDescription,
      ogImageUrl: minikitConfig.miniapp.ogImageUrl,
      noindex: true
    }
  });
}
