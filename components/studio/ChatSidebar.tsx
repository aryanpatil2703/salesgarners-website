"use client";

import * as React from "react";
import {
  Plus,
  Search,
  X,
  MessageSquare,
  MoreVertical,
  Edit2,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Check
} from "lucide-react";
import {
  Conversation,
  ConversationGroup,
  groupConversationsByDate,
  searchConversations
} from "@/lib/storage/chat-storage";
import { cn } from "@/lib/utils";

export interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  isMobileDrawer?: boolean;
}

/**
 * Supabase Studio-inspired conversation sidebar.
 * Features persistent conversation listing, date grouping, text search, inline rename, and delete confirmation.
 * @param {ChatSidebarProps} props
 * @returns {JSX.Element}
 */
export function ChatSidebar({
  conversations,
  activeId,
  isOpen,
  onToggleOpen,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  isMobileDrawer = false,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null);
  const [renamingId, setRenamingId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    if (menuOpenId) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [menuOpenId]);

  // Keyboard shortcut listener: Ctrl+N or Cmd+N for New Chat
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onNewChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewChat]);

  const filtered = React.useMemo(() => {
    return searchConversations(searchQuery, conversations);
  }, [searchQuery, conversations]);

  const groups = React.useMemo(() => {
    return groupConversationsByDate(filtered);
  }, [filtered]);

  const startRename = (conv: Conversation) => {
    setRenamingId(conv.id);
    setRenameValue(conv.title);
    setMenuOpenId(null);
  };

  const commitRename = (id: string) => {
    if (renameValue.trim()) {
      onRenameConversation(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  const confirmDelete = (id: string) => {
    onDeleteConversation(id);
    setDeleteConfirmId(null);
    setMenuOpenId(null);
  };

  if (!isOpen && !isMobileDrawer) {
    return (
      <div className="hidden md:flex flex-col items-center py-3 px-2 border-r border-zinc-800 bg-[#111113] w-12 shrink-0">
        <button
          type="button"
          onClick={onToggleOpen}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onNewChat}
          aria-label="New chat"
          title="New chat (Ctrl+K)"
          className="mt-3 flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#111113] border-r border-zinc-800/90 text-zinc-300 select-none z-30 transition-all duration-200",
        isMobileDrawer ? "w-72" : "w-64 md:w-68 shrink-0"
      )}
    >
      {/* Sidebar Header & New Chat */}
      <div className="p-3 border-b border-zinc-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-1">
            <span className="text-[12px] font-bold uppercase tracking-wider text-zinc-400">
              Chats
            </span>
            <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-800 px-1.5 py-0.2 rounded-full">
              {conversations.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleOpen}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* Prominent New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-100 border border-zinc-700/60 font-medium text-[13px] transition-all duration-150 hover:shadow-xs group"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>New Chat</span>
          </div>
          <kbd className="text-[10px] text-zinc-400 bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-700/50">
            Ctrl+K
          </kbd>
        </button>

        {/* Search Conversations Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats…"
            className="w-full pl-8 pr-7 py-1.5 rounded-md bg-zinc-900/90 text-[12.5px] text-zinc-200 placeholder:text-zinc-500 border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grouped Recent Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scroll-smooth">
        {groups.length === 0 ? (
          <div className="px-3 py-8 text-center text-zinc-500 text-[12.5px]">
            {searchQuery ? "No matching conversations found." : "No chat history yet."}
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="space-y-1">
              <h4 className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                {group.label}
              </h4>

              <div className="space-y-0.5">
                {group.conversations.map((conv) => {
                  const isActive = conv.id === activeId;
                  const isRenaming = renamingId === conv.id;

                  return (
                    <div
                      key={conv.id}
                      className={cn(
                        "group relative flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] transition-colors cursor-pointer",
                        isActive
                          ? "bg-zinc-800 text-white font-medium shadow-xs"
                          : "text-zinc-300 hover:bg-zinc-900/80 hover:text-zinc-100"
                      )}
                      onClick={() => {
                        if (!isRenaming) onSelectConversation(conv.id);
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 pr-1">
                        <MessageSquare className="h-3.5 w-3.5 shrink-0 text-zinc-500 group-hover:text-zinc-300" />
                        {isRenaming ? (
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitRename(conv.id);
                              if (e.key === "Escape") setRenamingId(null);
                            }}
                            onBlur={() => commitRename(conv.id)}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-zinc-950 px-1.5 py-0.5 rounded text-white text-[12.5px] border border-emerald-500/50 outline-none"
                          />
                        ) : (
                          <span className="truncate">{conv.title}</span>
                        )}
                      </div>

                      {/* Context Menu Trigger */}
                      {!isRenaming && (
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                            }}
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/60 transition-opacity",
                              menuOpenId === conv.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}
                            title="Conversation actions"
                            aria-label="Conversation actions"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>

                          {/* Context Action Menu */}
                          {menuOpenId === conv.id && (
                            <div
                              ref={menuRef}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-7 z-50 w-36 rounded-lg bg-zinc-900 border border-zinc-800 py-1 shadow-xl animate-in fade-in-50 duration-100"
                            >
                              <button
                                type="button"
                                onClick={() => startRename(conv)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-zinc-300 hover:bg-zinc-800 hover:text-white"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                <span>Rename</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteConfirmId(conv.id);
                                  setMenuOpenId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-rose-400 hover:bg-zinc-800 hover:text-rose-300"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-[15px] font-semibold text-white">Delete conversation?</h3>
              <p className="mt-1.5 text-[13px] text-zinc-400 leading-relaxed">
                This will permanently delete this conversation and its messages. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-md text-[13px] text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(deleteConfirmId)}
                className="px-3 py-1.5 rounded-md text-[13px] font-medium bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default ChatSidebar;

