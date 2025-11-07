import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../minikit.config";
import { RootProvider } from "./rootProvider";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.description,
    openGraph: {
      title: "🪙 Mini Fun Flip - Win Real ZORA Tokens for FREE!",
      description: "🎁 Free-to-play crypto game • 🏆 Win 0.0001 ZORA tokens • 💰 $100 winning pot • 📅 Max 2 flips per day",
      url: "https://mini-fun1.vercel.app",
      siteName: "Mini Fun Flip",
      images: [
        {
          url: "/doge1.png",
          width: 1200,
          height: 630,
          alt: "Mini Fun Flip - Win Real ZORA Tokens",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "🪙 Mini Fun Flip - Win Real ZORA Tokens for FREE!",
      description: "🎁 Free-to-play crypto game • 🏆 Win 0.0001 ZORA tokens • 💰 $100 winning pot",
      images: ["/doge1.png"],
    },other: {
      "fc:frame": JSON.stringify({
        version: "1",
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Let's Flip!`,
          action: {
            name: `Launch ${minikitConfig.miniapp.name}`,
            type: "launch_frame",
          },
        },
      }),
      'fc:miniapp': JSON.stringify({
        version: '1',
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Let's Flip!`,
          action: {
            type: 'launch_miniapp',
            name: minikitConfig.miniapp.name,
            url: minikitConfig.miniapp.homeUrl,
            splashImageUrl: minikitConfig.miniapp.splashImageUrl,
            splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
          },
        },
      }),
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceCodePro.variable}`}>
        <Providers>
          <SafeArea>
            {children}
          </SafeArea>
        </Providers>
      </body>
    </html>
  );
}
