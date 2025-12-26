import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Workflow, Bot, StickyNote } from "lucide-react";

export const metadata: Metadata = {
  title: "Agent Workflow Studio",
  description: "Ideate AI agents against real business workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-screen">
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <Workflow className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Agent Workflow Studio</h1>
                  <p className="text-xs text-slate-500">Ideate AI agents for your workflows</p>
                </div>
              </div>

              <nav className="flex items-center gap-1">
                <Link
                  href="/workflows"
                  className="px-4 py-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <Workflow className="w-4 h-4" />
                  Workflows
                </Link>
                <Link
                  href="/agents"
                  className="px-4 py-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  Agent Designer
                </Link>
                <Link
                  href="/opportunities"
                  className="px-4 py-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <StickyNote className="w-4 h-4" />
                  Opportunities
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}
