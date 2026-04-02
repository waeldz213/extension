import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "LeadGenius — Prospection IA pour Agences Web",
  description:
    "Plateforme SaaS de prospection intelligente. Audit de sites, génération de pitchs par IA, CRM Kanban. Surpassez la concurrence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
