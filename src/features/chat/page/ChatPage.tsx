"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { getChatDirectory, getConversations } from "../api/chat.service";
import { setConversations, setConversationsLoading } from "../store/chatSlice";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import NewConversationModal from "../components/NewConversationModal";
import { useChatCall } from "../components/ChatSocketProvider";
import { ChatUser } from "../types";

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

  if (!user) return null;

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setMobileShowList(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
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
            conversationId={activeConversationId}
            currentUserId={user.id}
            onStartCall={(type) => startCall(activeConversationId, type)}
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
          onCreated={handleSelectConversation}
        />
      )}
    </div>
  );
}