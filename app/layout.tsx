import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arcade Vault · Portal Retro",
  description:
    "Juega clásicos arcade en línea y compite por la mayor cantidad de puntos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <head>
        {/* Fuentes del tema: igual que la plantilla de referencia */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* La regla está pensada para pages/_document; en App Router el layout raíz envuelve todas las páginas. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Courier+Prime:wght@400;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        {/* Fondo decorativo: cuadrícula en perspectiva + scanlines, y ruido */}
        <div className="av-bg" />
        <div className="av-noise" />
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
