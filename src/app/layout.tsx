import type { Metadata, Viewport } from "next";
import "./globals.css";
import RoleDemoToolbar from "@/components/RoleDemoToolbar";

export const metadata: Metadata = {
  title: "Vela Health — Modern Healthcare Discovery & Patient Care Platform",
  description:
    "Connected healthcare discovery, appointment booking, clinical workflows, and patient care platform.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vela Health",
  },
};

export const viewport: Viewport = {
  themeColor: "#32151E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/icons/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full font-sans text-vela-ink bg-white antialiased flex flex-col selection:bg-[#EEEAE2] selection:text-vela-forest">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div id="app-content" className="flex-1 flex flex-col w-full">
          {children}
        </div>
        {process.env.NODE_ENV === "development" &&
          process.env.NEXT_PUBLIC_ENABLE_DEMO === "true" && <RoleDemoToolbar />}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    reg.update();
                  }).catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
