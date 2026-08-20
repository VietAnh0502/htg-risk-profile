import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const siteUrl = new URL("https://htg-risk-profile.vercel.app/");
const title = "Hồ Sơ Rủi Ro Đầu Tư | Tài Trần HTG";
const description = "Chẩn đoán khẩu vị rủi ro và nhận chiến lược đầu tư cá nhân hóa cùng Tài Trần HTG.";
const socialImage = new URL("/thumbnail-preview-v2.jpg", siteUrl).toString();
const logo = new URL("/newLogoHTG.jpg", siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: logo, type: "image/jpeg", sizes: "1254x1254" }],
    shortcut: logo,
    apple: [{ url: logo, type: "image/jpeg", sizes: "1254x1254" }],
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "HTG Investment",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Hồ sơ rủi ro đầu tư Tài Trần HTG" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [socialImage] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
