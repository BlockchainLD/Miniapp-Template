import { APP_METADATA } from "../../lib/utils";

export async function GET() {

  const manifest = {
    miniapp: {
      version: "1",
      name: APP_METADATA.title,
      description: APP_METADATA.description,
      iconUrl: APP_METADATA.splash.imageUrl,
      splashImageUrl: APP_METADATA.splash.imageUrl,
      splashBackgroundColor: APP_METADATA.splash.backgroundColor,
      homeUrl: APP_METADATA.url,
      heroImageUrl: APP_METADATA.imageUrl,
      ogImageUrl: APP_METADATA.imageUrl,
      ogTitle: APP_METADATA.title,
      ogDescription: APP_METADATA.description,
      requiredChains: ['eip155:8453'],
      requiredCapabilities: ['actions.ready']
    },
    baseBuilder: APP_METADATA.baseBuilder
  };
  
  return Response.json(manifest);
}