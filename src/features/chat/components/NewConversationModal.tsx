"use client";

import React, { useState } from "react";
import { X, Users, User, Search } from "lucide-react";
import { ChatUser } from "../types";
import { createConversation } from "../api/chat.service";

interface NewConversationModalProps {
  // Directory of people the user is allowed to message — pass in
  // whatever your app already uses for this (team members, org
  // directory, etc.). Kept generic since I don't have that source here.
  directory: ChatUser[];
  onClose: () => void;
  onCreated: (conversationId: string) => void;
}

export default function NewConversationModal({ directory, onClose, onCreated }: NewConversationModalProps) {
  const [mode, setMode] = useState<"DIRECT" | "GROUP">("DIRECT");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ChatUser[]>([]);
  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);

  const filtered = directory.filter((u) => u.fullName.toLowerCase().includes(query.toLowerCase()));

  const toggleSelect = (user: ChatUser) => {
    if (mode === "DIRECT") {
      setSelected([user]);
      return;
    }
    setSelected((prev) =>
      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user]
    );
  };

  const canCreate =
    mode === "DIRECT" ? selected.length === 1 : selected.length >= 1 && groupName.trim().length > 0;

  const handleCreate = async () => {
    if (!canCreate) return;
    setCreating(true);
    try {
      const conversation = await createConversation({
        type: mode,
        name: mode === "GROUP" ? groupName.trim() : undefined,
        participantIds: selected.map((u) => u.id),
      });
      onCreated(conversation.id);
      onClose();
    } catch (err) {
      console.error("Failed to create conversation:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white">New conversation</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 px-5 pt-4">
          <button
            onClick={() => {
              setMode("DIRECT");
              setSelected([]);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium ${
              mode === "DIRECT" ? "bg-[#03C35E]/10 text-[#03C35E]" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <User size={14} /> Direct
          </button>
          <button
            onClick={() => {
              setMode("GROUP");
              setSelected([]);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium ${
              mode === "GROUP" ? "bg-[#03C35E]/10 text-[#03C35E]" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users size={14} /> Group
          </button>
        </div>

        {mode === "GROUP" && (
          <div className="px-5 pt-3">
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C35E]/40 text-slate-900 dark:text-slate-100"
            />
          </div>
        )}

        <div className="px-5 pt-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people"
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C35E]/40 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto px-2 py-2">
          {filtered.map((user) => {
            const isSelected = selected.some((u) => u.id === user.id);
            return (
              <button
                key={user.id}
                onClick={() => toggleSelect(user)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                  isSelected ? "bg-[#03C35E]/10" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm text-slate-800 dark:text-slate-200">{user.fullName}</span>
              </button>
            );
          })}
          {filtered.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No matches</p>}
        </div>

        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleCreate}
            disabled={!canCreate || creating}
            className="w-full py-2.5 rounded-lg bg-[#03C35E] text-white text-sm font-semibold disabled:opacity-40 hover:bg-[#02a850] transition-colors"
          >
            {creating ? "Creating…" : mode === "DIRECT" ? "Start chat" : "Create group"}
          </button>
        </div>
      </div>
    </div>
  );
}