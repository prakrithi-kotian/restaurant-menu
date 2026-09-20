import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Udupi Lunch Home | QR Menu & Online Ordering — Goregaon West, Mumbai",
  description:
    "Order authentic Mangalorean & Udupi non-veg specialities — Chicken Thali, Fish Fry, Kori Rotti, Neer Dosa & more. Place your order directly from the table. Free delivery on orders above ₹500.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontHeading.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
