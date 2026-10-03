import type { Metadata, Viewport } from "next";
import "./globals.css";
import RoleDemoToolbar from "@/components/RoleDemoToolbar";

export const metadata: Metadata = {
  title: "Vela Health — Modern Healthcare Discovery & Patient Care Platform",
  description: "Connected healthcare discovery, appointment booking, clinical workflows, and patient care platform.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vela Health",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B3629",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="min-h-full font-sans text-vela-ink bg-[#F5F7F5] antialiased flex flex-col selection:bg-[#EFF2EF] selection:text-vela-forest">
        <div className="flex-1 flex flex-col w-full">{children}</div>
        <RoleDemoToolbar />
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
