"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Send, MessageCircle, Search, User, Building2, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Message {
  id: string;
  conversationId: string;
  senderId: string | number;
  senderName: string;
  senderEmail: string;
  senderAvatar: string;
  senderRole: "founder" | "investor";
  recipientId: string | number;
  recipientName: string;
  recipientEmail: string;
  recipientAvatar: string;
  recipientRole: "founder" | "investor";
  message: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  conversationId: string;
  otherUser: {
    id: string | number;
    name: string;
    email: string;
    avatar: string;
    role: "founder" | "investor";
    company?: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    loadConversations();
  }, [isAuthenticated, router]);

  const loadConversations = () => {
    if (!user) return;

    const allMessages: Message[] = JSON.parse(localStorage.getItem("messages") || "[]");
    
    // Group messages by conversation
    const conversationMap = new Map<string, Conversation>();

    allMessages.forEach((msg) => {
      const isUserSender = msg.senderEmail === user.email;
      const isUserRecipient = msg.recipientEmail === user.email;

      if (!isUserSender && !isUserRecipient) return;

      const conversationId = msg.conversationId;
      const otherUser = isUserSender
        ? {
            id: msg.recipientId,
            name: msg.recipientName,
            email: msg.recipientEmail,
            avatar: msg.recipientAvatar,
            role: msg.recipientRole,
          }
        : {
            id: msg.senderId,
            name: msg.senderName,
            email: msg.senderEmail,
            avatar: msg.senderAvatar,
            role: msg.senderRole,
          };

      const existing = conversationMap.get(conversationId);
      if (!existing || new Date(msg.timestamp) > new Date(existing.lastMessageTime)) {
        const unreadCount = allMessages.filter(
          (m) =>
            m.conversationId === conversationId &&
            m.recipientEmail === user.email &&
            !m.read
        ).length;

        conversationMap.set(conversationId, {
          conversationId,
          otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.timestamp,
          unreadCount,
        });
      }
    });

    const sortedConversations = Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    setConversations(sortedConversations);
  };

  const loadMessages = (conversationId: string) => {
    const allMessages: Message[] = JSON.parse(localStorage.getItem("messages") || "[]");
    const conversationMessages = allMessages.filter((m) => m.conversationId === conversationId);
    
    // Mark messages as read
    const updatedMessages = allMessages.map((m) => {
      if (m.conversationId === conversationId && m.recipientEmail === user?.email) {
        return { ...m, read: true };
      }
      return m;
    });
    
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    setMessages(conversationMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    setSelectedConversation(conversationId);
    loadConversations(); // Refresh to update unread count
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const conversation = conversations.find((c) => c.conversationId === selectedConversation);
    if (!conversation) return;

    const allMessages: Message[] = JSON.parse(localStorage.getItem("messages") || "[]");
    
    const newMsg: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation,
      senderId: user.id,
      senderName: user.name,
      senderEmail: user.email,
      senderAvatar: user.avatar,
      senderRole: user.role as "founder" | "investor",
      recipientId: conversation.otherUser.id,
      recipientName: conversation.otherUser.name,
      recipientEmail: conversation.otherUser.email,
      recipientAvatar: conversation.otherUser.avatar,
      recipientRole: conversation.otherUser.role,
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    allMessages.push(newMsg);
    localStorage.setItem("messages", JSON.stringify(allMessages));

    setMessages([...messages, newMsg]);
    setNewMessage("");
    loadConversations(); // Refresh conversations
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.conversationId === selectedConversation);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Connect with investors and founders
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
                  <Link
                    href="/matchmaking"
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Browse {user?.role === "founder" ? "investors" : "startups"}
                  </Link>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.conversationId}
                    onClick={() => loadMessages(conv.conversationId)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                      selectedConversation === conv.conversationId
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                  >
                    <Image
                      src={conv.otherUser.avatar}
                      alt={conv.otherUser.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {conv.otherUser.name}
                        </h3>
                        {conv.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatTime(conv.lastMessageTime)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={selectedConv.otherUser.avatar}
                      alt={selectedConv.otherUser.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {selectedConv.otherUser.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {selectedConv.otherUser.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.senderEmail === user?.email;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            isOwn
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                          } rounded-2xl px-4 py-2`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div>
                  <MessageCircle className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
