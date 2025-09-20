
export const APP_METADATA = {
    title: 'Mini App Template',
    description: 'A demo mini app built on Base',
    tagline: 'A demo mini app built on Base',
    imageUrl: 'https://i.imgur.com/2bsV8mV.png',
    splash: {
        imageUrl: 'https://i.imgur.com/brcnijg.png',
        backgroundColor: '#FFFFFF' 
    },
    url: process.env.SITE_URL || 'http://localhost:3000',
    canonicalDomain: new URL(process.env.SITE_URL || 'http://localhost:3000').hostname,
    accountAssociation: {
        header: "eyJmaWQiOjYxNiwidHlwZSI6bnVsbCwia2V5IjoiMHg4MzQyQTQ4Njk0QTc0MDQ0MTE2RjMzMGRiNTA1MGEyNjdiMjhkRDg1In0",
        payload: "eyJkb21haW4iOiJiYXNlLW1pbmktYXBwLXRlbXBsYXRlLnZlcmNlbC5hcHAifQ",
        signature: "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAyMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwYzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxNzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDE4YzBmZDU5YmU3YWQxZDg1ZDk3ZmVhMDFlMGMyYzhiOTZmYzEzODY1ZGM2MWEyZDQ4MjMwOTYxYjYwOTY0NGQ3MGVjMzE3ZTQ3Yzc4ZTUyYmU1ZDk1ZWU4M2M1YWUzZjJlY2E1ZmM5YjE1Mjg3YTZhNDdjYWY3ZWU4ZDQ5YjM5MjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMjVmMTk4MDg2YjJkYjE3MjU2NzMxYmM0NTY2NzNiOTZiY2VmMjNmNTFkMWZiYWNkZDdjNDM3OWVmNjU0NjU1NzJmMWQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwOGE3YjIyNzQ3OTcwNjUyMjNhMjI3NzY1NjI2MTc1NzQ2ODZlMmU2NzY1NzQyMjJjMjI2MzY4NjE2YzZjNjU2ZTY3NjUyMjNhMjI1NzJkNTQ1MjJkNTY3NTUwNmQ1NjQ0Mzc2NzU3NzUzOTU4NDM3NzY4NDM3NzRhNzM2NzMxMmQ0YjRlNTE3MjM1NjkzMzY5NzM0NTM5NGQ3YTc5Mzg0ZDIyMmMyMjZmNzI2OTY3Njk2ZTIyM2EyMjY4NzQ3NDcwNzMzYTJmMmY2YjY1Nzk3MzJlNjM2ZjY5NmU2MjYxNzM2NTJlNjM2ZjZkMjIyYzIyNjM3MjZmNzM3MzRmNzI2OTY3Njk2ZTIyM2E2NjYxNmM3MzY1N2QwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMA"
    },
    baseBuilder: {
        allowedAddresses: ['0x8342A48694A74044116F330db5050a267b28dD85']
    },
    tags: ['miniapp', 'template', 'base', 'dylsteck'],
    noindex: false,
    primaryCategory: 'utility' // One of: games, social, finance, utility, productivity, health-fitness, news-media, music, shopping, education, developer-tools, entertainment, art-creativity
};

export const fcMiniAppEmbed = (title = 'Launch', imageUrl = APP_METADATA.imageUrl, url = APP_METADATA.url) => {
    return {
        version: "next",
        imageUrl: imageUrl,
        button: {
          title: title,
          action: {
            type: "launch_frame",
            name: APP_METADATA.title,
            url: url,
            splashImageUrl: APP_METADATA.splash.imageUrl,
            splashBackgroundColor: APP_METADATA.splash.backgroundColor,
          },
        },
    };
}