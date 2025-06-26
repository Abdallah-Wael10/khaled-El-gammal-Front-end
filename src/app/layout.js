import { Poppins } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./components/ClientProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "KHALED EL GAMAL | The Power Of Creativity",
  description: "Handcrafted Egyptian art and decor from Khaled El Gamal. Discover unique pieces inspired by Khan El Khalili. Shop now!",
  keywords: "Khaled El Gamal, Khan El Khalili, Handmade, Egyptian Art, Decor, Shop, Gallery",
  openGraph: {
    title: "KHALED EL GAMAL | The Power Of Creativity",
    description: "Handcrafted Egyptian art and decor from Khaled El Gamal. Discover unique pieces inspired by Khan El Khalili.",
    url: "http://localhost:3000",
    siteName: "Khaled El Gamal",
    images: [
      {
        url: "http://localhost:3000/khaledbg.webp",
        width: 1200,
        height: 630,
        alt: "Khaled El Gamal Gallery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KHALED EL GAMAL | The Power Of Creativity",
    description: "Handcrafted Egyptian art and decor from Khaled El Gamal.",
    images: ["http://localhost:3000/khaledbg.webp"],
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
