"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { getChatDirectory, getConversations } from "../api/chat.service";
import { setConversations, setConversationsLoading } from "../store/chatSlice";
import { refreshConversations } from "../hooks/useChatSocket";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import NewConversationModal from "../components/NewConversationModal";
import { useChatCall } from "../components/ChatSocketProvider";
import { ChatUser, ConversationSummary } from "../types";

/**
 * Self-contained — takes no props, same as EmailFolderPage.tsx etc.
 * Every role's route just renders this directly:
 *
 *   // app/(dashboard)/<role>/chat/page.tsx
 *   import ChatPage from "@/src/features/chat/page/ChatPage";
 *   export default function Page() { return <ChatPage />; }
 *
 * Chat is intentionally NOT scoped by role/hierarchy - any active
 * user can message any other (see GET /chat/directory on the
 * backend) - so there is nothing role-specific for the wrapper to
 * pass in.
 */
export default function ChatPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { startCall } = useChatCall();

  const [directory, setDirectory] = useState<ChatUser[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [mobileShowList, setMobileShowList] = useState(true);
  const conversations = useSelector((state: RootState) => state.chat.conversations) as ConversationSummary[];

  useEffect(() => {
    (async () => {
      dispatch(setConversationsLoading(true));
      try {
        const [conversations, dir] = await Promise.all([getConversations(), getChatDirectory()]);
        dispatch(setConversations(conversations));
        setDirectory(dir);
      } finally {
        dispatch(setConversationsLoading(false));
      }
    })();
  }, [dispatch]);

  // If the open chat disappears from the list (we were removed from the
  // group, or exited it), close it instead of showing a dead window.
  useEffect(() => {
    if (activeConversationId && !conversations.some((c) => c.id === activeConversationId)) {
      setActiveConversationId(null);
      setMobileShowList(true);
    }
  }, [conversations, activeConversationId]);

  if (!user) return null;

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setMobileShowList(false);
  };

  // A chat/group was just created: load it into the list FIRST (this was
  // why new contacts only showed after a manual refresh), then open it.
  const handleCreated = async (conversationId: string) => {
    await refreshConversations(dispatch);
    handleSelectConversation(conversationId);
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className={`${mobileShowList ? "flex" : "hidden"} md:flex`}>
        <ConversationList
          currentUserId={user.id}
          activeConversationId={activeConversationId}
          onSelect={handleSelectConversation}
          onNewConversation={() => setShowNewConversation(true)}
          onSelectSearchResult={handleSelectConversation}
        />
      </div>

      <div className={`${mobileShowList ? "hidden" : "flex"} md:flex flex-1 min-w-0`}>
        {activeConversationId ? (
          <ChatWindow
            key={activeConversationId}
            conversationId={activeConversationId}
            currentUserId={user.id}
            directory={directory}
            onStartCall={(type, title) => startCall(activeConversationId, type, title)}
            onBack={() => setMobileShowList(true)}
          />
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center text-slate-400 text-sm bg-[#F7F9FB] dark:bg-slate-950">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      {showNewConversation && (
        <NewConversationModal
          directory={directory}
          onClose={() => setShowNewConversation(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}