import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GradCRM | Calm job search tracking for graduates",
  description:
    "GradCRM is a polished job application tracker for graduates who want a calm, beautiful way to manage applications, interviews, and next steps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[linear-gradient(180deg,_#fffafc_0%,_#fff7fb_30%,_#fdf2f8_100%)] text-slate-800">
        {children}
      </body>
    </html>
  );
}
