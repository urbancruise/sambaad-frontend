"use client";

import React, { useMemo, useRef, useState } from "react";
import { Search, SquarePen } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { ConversationSummary } from "../types";
import ConversationListItem from "./ConversationListItem";
import { searchMessages } from "../api/chat.service";
import { SearchResult } from "../types";

interface ConversationListProps {
  currentUserId: number;
  activeConversationId: string | null;
  onSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  onSelectSearchResult: (conversationId: string) => void;
}

export default function ConversationList({
  currentUserId,
  activeConversationId,
  onSelect,
  onNewConversation,
  onSelectSearchResult,
}: ConversationListProps) {
  const conversations = useSelector((state: RootState) => state.chat.conversations) as ConversationSummary[];
  const onlineUserIds = useSelector((state: RootState) => state.chat.onlineUserIds) as number[];

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  const filteredConversations = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
    return conversations.filter((c) => {
      const name = c.type === "GROUP" ? c.name : c.participants.find((p) => p.id !== currentUserId)?.fullName;
      return name?.toLowerCase().includes(q);
    });
  }, [conversations, query, currentUserId]);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (value.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchMessages(value.trim());
        setSearchResults(results);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  return (
    <div className="w-80 shrink-0 h-full flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
        <h2 className="font-bold text-slate-900 dark:text-white text-lg">Chats</h2>
        <button
          onClick={onNewConversation}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-[#03C35E]"
          title="New chat"
        >
          <SquarePen size={18} />
        </button>
      </div>

      <div className="px-3 py-2.5">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search chats or messages"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:outline-none focus:ring-2 focus:ring-[#03C35E]/40 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {searchResults !== null ? (
          <>
            <p className="text-[11px] font-semibold text-slate-400 uppercase px-2 py-1.5">
              {searching ? "Searching…" : `Messages (${searchResults.length})`}
            </p>
            {searchResults.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onSelectSearchResult(r.conversationId);
                  setQuery("");
                  setSearchResults(null);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {r.conversationType === "GROUP" ? r.conversationName : r.sender.fullName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {r.sender.fullName}: {r.body}
                </p>
              </button>
            ))}
            {!searching && searchResults.length === 0 && (
              <p className="text-xs text-slate-400 px-3 py-4 text-center">No messages found</p>
            )}
          </>
        ) : (
          filteredConversations.map((c) => (
            <ConversationListItem
              key={c.id}
              conversation={c}
              currentUserId={currentUserId}
              isActive={c.id === activeConversationId}
              isOnline={
                c.type === "DIRECT" &&
                onlineUserIds.includes(c.participants.find((p) => p.id !== currentUserId)?.id ?? -1)
              }
              onClick={() => onSelect(c.id)}
            />
          ))
        )}

        {searchResults === null && filteredConversations.length === 0 && (
          <p className="text-xs text-slate-400 px-3 py-6 text-center">
            No conversations yet — start one with the pencil icon above.
          </p>
        )}
      </div>
    </div>
  );
}