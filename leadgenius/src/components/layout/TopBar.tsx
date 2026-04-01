"use client";

import { Bell, User } from "lucide-react";

export default function TopBar({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-[#27272a] flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-zinc-100">{title}</h1>
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-all">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-zinc-200">Mon Agence</p>
            <p className="text-xs text-zinc-500">Plan Gratuit</p>
          </div>
        </div>
      </div>
    </header>
  );
}
