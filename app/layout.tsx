import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;
  const title = "Hồ Sơ Rủi Ro Đầu Tư | Tài Trần HTG";
  const description = "Chẩn đoán khẩu vị rủi ro và nhận chiến lược đầu tư cá nhân hóa cùng Tài Trần HTG.";
  const socialImage = `${baseUrl}/thumbnail_preview.png`;

  return {
    title,
    description,
    icons: {
      icon: [{ url: "/newLogoHTG.jpg", type: "image/jpeg" }],
      shortcut: "/newLogoHTG.jpg",
      apple: [{ url: "/newLogoHTG.jpg", type: "image/jpeg" }],
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "vi_VN",
      url: baseUrl,
      siteName: "HTG Investment",
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "Hồ sơ rủi ro đầu tư Tài Trần HTG" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}

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
