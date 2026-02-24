import {
  Geist,
  Geist_Mono,
  Roboto_Condensed,
  Roboto,
  Inter,
} from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { AuExchThemeProvider } from "@/components/common/theme-provider";
import { Suspense } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Closebetslip } from "@/components/common/m-betslip/close-betslip";
const MiniCasinoDrawer = dynamic(() => import("@/components/common/mini-casino-drawer"));
const GlobalApisCall = dynamic(() => import("@/lib/providers/global-apis"));
const NavigationLoader = dynamic(() => import("@/lib/providers/navigation-loader"));
const SearchModal = dynamic(() => import("@/components/modal/search"));

export const metadata: Metadata = {
  title: "100exch",
  description: "Explore 100exch",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        /> */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover" />
      </head>
      <body
        className={`
          ${inter.variable}
          ${geistSans.variable}
          ${geistMono.variable}
          ${robotoCondensed.variable} 
          ${roboto.variable}
          antialiased
        `}
        style={{
          fontFamily: `var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
        }}
        cz-shortcut-listen="true"
      >
        <Script src="/language/translateicon.js" strategy="afterInteractive" />
        <Script src="/language/lang-config.js" strategy="beforeInteractive" />
        <Script src="/language/translation.js" strategy="beforeInteractive" />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />
        <Suspense>
          <Closebetslip/>
          <NavigationLoader />
          <GlobalApisCall />
          <AuExchThemeProvider>
            {children}
            <MiniCasinoDrawer />
            <SearchModal />
          </AuExchThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
