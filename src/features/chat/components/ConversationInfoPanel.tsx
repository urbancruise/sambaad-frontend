"use client";

import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { X, Users, Pencil, Check, UserPlus, LogOut, Search, Crown } from "lucide-react";
import { ChatUser, Participant } from "../types";
import { addParticipants, removeParticipant, updateConversation } from "../api/chat.service";
import { refreshConversations } from "../hooks/useChatSocket";

interface ConversationInfoPanelProps {
  conversation: {
    id: string;
    type: "DIRECT" | "GROUP";
    name: string | null;
    participants: Participant[];
  };
  currentUserId: number;
  /** Everyone the user could add (org directory). */
  directory: ChatUser[];
  onlineUserIds: number[];
  onClose: () => void;
  /** Called after the current user exits the group. */
  onLeft: () => void;
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong");

export default function ConversationInfoPanel({
  conversation,
  currentUserId,
  directory,
  onlineUserIds,
  onClose,
  onLeft,
}: ConversationInfoPanelProps) {
  const dispatch = useDispatch();

  const isGroup = conversation.type === "GROUP";
  const me = conversation.participants.find((p) => p.id === currentUserId);
  const canManage = isGroup && (me?.role === "OWNER" || me?.role === "ADMIN");

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(conversation.name ?? "");
  const [addMode, setAddMode] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const other = !isGroup ? conversation.participants.find((p) => p.id !== currentUserId) : null;

  // People who can still be added: in the directory, not already members.
  const addable = useMemo(() => {
    const memberIds = new Set(conversation.participants.map((p) => p.id));
    const q = query.trim().toLowerCase();
    return directory.filter((u) => !memberIds.has(u.id) && (!q || u.fullName.toLowerCase().includes(q)));
  }, [directory, conversation.participants, query]);

  // Run an API action, then reload the list so every screen shows the change.
  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      await refreshConversations(dispatch);
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const saveName = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === conversation.name) {
      setEditingName(false);
      setNameDraft(conversation.name ?? "");
      return;
    }
    const ok = await run(() => updateConversation(conversation.id, { name: trimmed }));
    if (ok) setEditingName(false);
  };

  const confirmAdd = async () => {
    if (selectedIds.length === 0) return;
    const ok = await run(() => addParticipants(conversation.id, selectedIds));
    if (ok) {
      setAddMode(false);
      setSelectedIds([]);
      setQuery("");
    }
  };

  const handleRemove = async (member: Participant) => {
    if (!window.confirm(`Remove ${member.fullName} from this group?`)) return;
    await run(() => removeParticipant(conversation.id, member.id));
  };

  const handleExit = async () => {
    if (!window.confirm("Exit this group? You won't receive new messages from it.")) return;
    const ok = await run(() => removeParticipant(conversation.id, currentUserId));
    if (ok) onLeft();
  };

  const displayName = isGroup ? conversation.name ?? "Group" : other?.fullName ?? "Unknown";

  return (
    <aside className="absolute inset-y-0 right-0 z-30 w-full sm:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h3 className="font-bold text-slate-900 dark:text-white">{isGroup ? "Group info" : "Contact info"}</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Identity */}
        <div className="flex flex-col items-center px-4 py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-slate-300">
            {isGroup ? <Users size={36} /> : initialsOf(displayName)}
          </div>

          {isGroup && editingName ? (
            <div className="flex items-center gap-1.5 mt-4 w-full">
              <input
                autoFocus
                value={nameDraft}
                maxLength={100}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveName();
                  if (e.key === "Escape") {
                    setEditingName(false);
                    setNameDraft(conversation.name ?? "");
                  }
                }}
                className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#03C35E]/40"
              />
              <button
                onClick={saveName}
                disabled={busy || !nameDraft.trim()}
                className="p-2 rounded-lg bg-[#03C35E] text-white disabled:opacity-40"
                aria-label="Save group name"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-4 max-w-full">
              <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
              {canManage && (
                <button
                  onClick={() => {
                    setNameDraft(conversation.name ?? "");
                    setEditingName(true);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"
                  aria-label="Edit group name"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
          )}

          <p className="text-xs text-slate-400 mt-1">
            {isGroup
              ? `Group · ${conversation.participants.length} members`
              : other?.email ?? ""}
          </p>
          {!isGroup && other && (
            <p className={`text-xs mt-1 font-medium ${onlineUserIds.includes(other.id) ? "text-[#03C35E]" : "text-slate-400"}`}>
              {onlineUserIds.includes(other.id) ? "Online" : "Offline"}
            </p>
          )}
          {isGroup && !canManage && (
            <p className="text-[11px] text-slate-400 mt-2 text-center">Only group admins can edit this group.</p>
          )}
        </div>

        {error && (
          <p className="mx-4 mt-3 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Members (groups only) */}
        {isGroup && (
          <div className="px-2 py-3">
            <div className="flex items-center justify-between px-2 mb-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">
                {conversation.participants.length} members
              </p>
            </div>

            {canManage && !addMode && (
              <button
                onClick={() => setAddMode(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
              >
                <span className="w-10 h-10 rounded-full bg-[#03C35E] text-white flex items-center justify-center">
                  <UserPlus size={18} />
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Add members</span>
              </button>
            )}

            {canManage && addMode && (
              <div className="mx-1 mb-2 rounded-xl border border-slate-200 dark:border-slate-700 p-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search people"
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#03C35E]/40"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto mt-2">
                  {addable.map((u) => {
                    const selected = selectedIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        onClick={() =>
                          setSelectedIds((prev) =>
                            prev.includes(u.id) ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                          )
                        }
                        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left ${
                          selected ? "bg-[#03C35E]/10" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {initialsOf(u.fullName)}
                        </span>
                        <span className="flex-1 text-sm text-slate-800 dark:text-slate-200 truncate">{u.fullName}</span>
                        {selected && <Check size={15} className="text-[#03C35E]" />}
                      </button>
                    );
                  })}
                  {addable.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-3">No one left to add</p>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setAddMode(false);
                      setSelectedIds([]);
                      setQuery("");
                    }}
                    className="flex-1 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAdd}
                    disabled={busy || selectedIds.length === 0}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold bg-[#03C35E] text-white disabled:opacity-40"
                  >
                    {busy ? "Adding…" : `Add${selectedIds.length ? ` (${selectedIds.length})` : ""}`}
                  </button>
                </div>
              </div>
            )}

            {conversation.participants.map((member) => {
              const isMe = member.id === currentUserId;
              const canRemove = canManage && !isMe && member.role !== "OWNER";
              return (
                <div key={member.id} className="flex items-center gap-3 px-3 py-2 rounded-xl group hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {initialsOf(member.fullName)}
                    </div>
                    {onlineUserIds.includes(member.id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#03C35E] border-2 border-white dark:border-slate-900" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {member.fullName}
                      {isMe && <span className="text-slate-400 font-normal"> (You)</span>}
                    </p>
                    {member.email && <p className="text-[11px] text-slate-400 truncate">{member.email}</p>}
                  </div>
                  {(member.role === "OWNER" || member.role === "ADMIN") && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#03C35E] border border-[#03C35E]/40 rounded px-1.5 py-0.5 shrink-0">
                      {member.role === "OWNER" && <Crown size={10} />}
                      {member.role === "OWNER" ? "Owner" : "Admin"}
                    </span>
                  )}
                  {canRemove && (
                    <button
                      onClick={() => handleRemove(member)}
                      disabled={busy}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shrink-0"
                      aria-label={`Remove ${member.fullName}`}
                      title="Remove from group"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isGroup && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleExit}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-40"
          >
            <LogOut size={16} />
            Exit group
          </button>
        </div>
      )}
    </aside>
  );
}