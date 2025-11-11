import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "~/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_URL;

// frame preview metadata
const appName = 'Kaymo';
const splashImageUrl = `${appUrl}/logos/powered-by-neynar.png`;
const iconUrl = `${appUrl}/logos/neynar.svg`;

const framePreviewMetadata = {
  version: "next",
  imageUrl: splashImageUrl,
  button: {
    title: 'Launch Kaymo',
    action: {
      type: "launch_frame",
      name: appName,
      url: appUrl,
      splashImageUrl,
      iconUrl,
      splashBackgroundColor: "#000000",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: appName,
    openGraph: {
      title: appName,
      description: "A content scheduler app (powered by Neynar) that will help user to cast",
    },
    other: {
      "fc:frame": JSON.stringify(framePreviewMetadata),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Start of Neynar Frame */}
        <meta property="og:title" content={appName} />
        <meta
          property="og:description"
          content="A demo app (powered by Neynar) that will help user to cast"
        />
        <meta property="og:image" content={splashImageUrl} />
        <link rel="icon" href="/logos/wownar-logo.svg" sizes="32x32" />

        {/* End of Neynar Frame */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
            {children}
            <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
