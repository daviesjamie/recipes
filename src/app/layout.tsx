import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";

export const metadata: Metadata = {
  title: "jagd's Recipes",
  description: "Delicious vegetarian recipes without the life stories",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="px-16 py-24">
        <header className="mx-auto mb-6 max-w-xl border-b-2 border-gray-950 pb-2">
          <Link href="/">
            <h2 className="text-3xl">{"jagd's Recipes"}</h2>
          </Link>
        </header>
        <main className="mx-auto max-w-xl">{children}</main>
      </body>
    </html>
  );
}
