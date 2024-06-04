import { Metadata } from "next";
import { Providers } from "./providers";
import { ConditionalNavBars } from "@/components/ConditionalNavBars";
import Auth from "@/components/Auth";
import "@rainbow-me/rainbowkit/styles.css";

export const metadata: Metadata = {
  title: "DefiKids",
  description: "Welcome to DefiKids",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Providers>
          <Auth />
          <ConditionalNavBars />
          {children}
        </Providers>
      </body>
    </html>
  );
}
