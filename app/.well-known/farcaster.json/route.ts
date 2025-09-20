import { APP_METADATA } from "../../lib/utils";

export async function GET() {

  const body = {
    version: "1",
    name: APP_METADATA.title,
    subtitle: APP_METADATA.tagline,
    tagline: APP_METADATA.tagline,
    description: APP_METADATA.description,
    iconUrl: APP_METADATA.splash.imageUrl,
    splashImageUrl: APP_METADATA.splash.imageUrl,
    splashBackgroundColor: APP_METADATA.splash.backgroundColor,
    homeUrl: APP_METADATA.url,
    heroImageUrl: APP_METADATA.imageUrl,
    ogImageUrl: APP_METADATA.imageUrl,
    ogTitle: APP_METADATA.title,
    ogDescription: APP_METADATA.description,
    noindex: APP_METADATA.noindex,
    primaryCategory: APP_METADATA.primaryCategory,
    requiredChains: ['eip155:8453'],
    requiredCapabilities: ['actions.ready'],
    canonicalDomain: APP_METADATA.canonicalDomain,
    tags: APP_METADATA.tags
  };

  const manifest = {
    accountAssociation: APP_METADATA.accountAssociation,
    frame: body,
    miniapp: body,
    baseBuilder: APP_METADATA.baseBuilder
  };

  return Response.json(manifest);
}