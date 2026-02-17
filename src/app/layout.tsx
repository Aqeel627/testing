import {
  Geist,
  Geist_Mono,
  Roboto_Condensed,
  Roboto,
  Inter,
} from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import SearchModal from "@/components/modal/search/SearchModal";
import { AuExchThemeProvider } from "@/components/common/theme-provider";
import NavigationLoader from "./navigation-loader";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Auexch",
  description: "Explore Auexch",
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
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
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
        <Suspense>
          <NavigationLoader />
          <AuExchThemeProvider>
            {children}
            <SearchModal />
          </AuExchThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
