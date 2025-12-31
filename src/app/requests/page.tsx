"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserPlus, Check, X, Building2, MapPin, TrendingUp, DollarSign, ArrowLeft, MessageSquare, Briefcase, Clock, CheckCircle, XCircle, Send, Inbox } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ConnectionRequest {
  id: string | number;
  name: string;
  email: string;
  avatar: string;
  company?: string;
  firm?: string;
  industry: string;
  stage?: string;
  fundingGoal?: string;
  investmentRange?: string;
  location: string;
  description?: string;
  bio?: string;
  traction?: string;
  team?: string;
  conversationId: string;
  messageId: string;
  message: string;
  timestamp: string;
  status: "pending" | "accepted" | "rejected";
  role: "founder" | "investor";
}

export default function ConnectionRequestsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  const loadConnectionRequests = useCallback(async () => {
    if (!user) return;

    const messagesRes = await fetch('/api/messages');
    const foundersRes = await fetch('/api/founders');
    const investorsRes = await fetch('/api/investors');
    
    const messages = await messagesRes.json();
    const founders = await foundersRes.json();
    const investors = await investorsRes.json();

    console.log('=== REQUESTS PAGE DEBUG ===');
    console.log('User:', user.email, user.role);
    console.log('All messages from API:', messages);
    console.log('Messages with isConnectionRequest:', messages.filter((m: any) => m.isConnectionRequest === true));

    // Received requests
    const receivedMessages = messages.filter(
      (m: any) => 
        m.recipientEmail === user.email && 
        m.senderRole !== user.role &&
        m.isConnectionRequest === true
    );

    console.log('Received messages:', receivedMessages);

    const receivedMap = new Map();
    receivedMessages.forEach((msg: any) => {
      if (!receivedMap.has(msg.conversationId)) {
        receivedMap.set(msg.conversationId, msg);
      }
    });

    const received: ConnectionRequest[] = [];
    receivedMap.forEach((msg: any) => {
      const person = msg.senderRole === "founder" 
        ? founders.find((f: any) => f.email === msg.senderEmail)
        : investors.find((i: any) => i.email === msg.senderEmail);
      
      if (person) {
        received.push({
          id: msg.senderId,
          name: msg.senderName,
          email: msg.senderEmail,
          avatar: msg.senderAvatar,
          company: person.company,
          firm: person.firm,
          industry: msg.senderRole === "founder" ? person.industry : person.industries?.join(", "),
          stage: person.stage,
          fundingGoal: person.fundingGoal,
          investmentRange: person.investmentRange,
          location: person.location,
          description: person.description,
          bio: person.bio,
          traction: person.traction,
          team: person.team,
          conversationId: msg.conversationId,
          messageId: msg.id,
          message: msg.message,
          timestamp: msg.timestamp,
          status: msg.requestStatus || "pending",
          role: msg.senderRole,
        });
      }
    });

    // Sent requests
    const sentMessages = messages.filter(
      (m: any) => 
        m.senderEmail === user.email && 
        m.recipientRole !== user.role &&
        m.isConnectionRequest === true
    );

    console.log('Sent messages:', sentMessages);
    console.log('=== END DEBUG ===');

    const sentMap = new Map();
    sentMessages.forEach((msg: any) => {
      if (!sentMap.has(msg.conversationId)) {
        sentMap.set(msg.conversationId, msg);
      }
    });

    const sent: ConnectionRequest[] = [];
    sentMap.forEach((msg: any) => {
      const person = msg.recipientRole === "founder"
        ? founders.find((f: any) => f.email === msg.recipientEmail)
        : investors.find((i: any) => i.email === msg.recipientEmail);
      
      if (person) {
        sent.push({
          id: msg.recipientId,
          name: msg.recipientName,
          email: msg.recipientEmail,
          avatar: msg.recipientAvatar,
          company: person.company,
          firm: person.firm,
          industry: msg.recipientRole === "founder" ? person.industry : person.industries?.join(", "),
          stage: person.stage,
          fundingGoal: person.fundingGoal,
          investmentRange: person.investmentRange,
          location: person.location,
          description: person.description,
          bio: person.bio,
          traction: person.traction,
          team: person.team,
          conversationId: msg.conversationId,
          messageId: msg.id,
          message: msg.message,
          timestamp: msg.timestamp,
          status: msg.requestStatus || "pending",
          role: msg.recipientRole,
        });
      }
    });

    received.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    sent.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setReceivedRequests(received);
    setSentRequests(sent);
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    loadConnectionRequests();
  }, [isAuthenticated, loadConnectionRequests, router]);

  const acceptRequest = async (conversationId: string, requestId: string | number) => {
    if (!user) return;

    const messagesRes = await fetch('/api/messages');
    const messages = await messagesRes.json();
    
    // Update request status to accepted
    const updatedMessages = messages.map((m: any) => {
      if (m.conversationId === conversationId && m.isConnectionRequest) {
        return { ...m, requestStatus: "accepted" };
      }
      return m;
    });

    // Add to favorites
    if (user.role === "investor") {
      const investorsRes = await fetch('/api/investors');
      const investors = await investorsRes.json();
      const investorIndex = investors.findIndex((inv: any) => inv.email === user.email);
      
      if (investorIndex !== -1) {
        const currentFavorites = investors[investorIndex].favorites || [];
        if (!currentFavorites.includes(requestId)) {
          investors[investorIndex].favorites = [...currentFavorites, requestId];
          await fetch('/api/investors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ investors }),
          });
        }
      }
    } else if (user.role === "founder") {
      const foundersRes = await fetch('/api/founders');
      const founders = await foundersRes.json();
      const founderIndex = founders.findIndex((f: any) => f.email === user.email);
      
      if (founderIndex !== -1) {
        const currentFavorites = founders[founderIndex].favorites || [];
        if (!currentFavorites.includes(requestId)) {
          founders[founderIndex].favorites = [...currentFavorites, requestId];
          await fetch('/api/founders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ founders }),
          });
        }
      }
    }

    // Send acceptance message
    const request = receivedRequests.find(r => r.conversationId === conversationId);
    if (request) {
      const acceptMessage = {
        id: Date.now().toString(),
        conversationId,
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        senderAvatar: user.avatar,
        senderRole: user.role,
        recipientId: request.id,
        recipientName: request.name,
        recipientEmail: request.email,
        recipientAvatar: request.avatar,
        recipientRole: request.role,
        message: `Great to connect! I'm interested in learning more. Let's schedule a call.`,
        timestamp: new Date().toISOString(),
        read: false,
        isConnectionRequest: false,
      };
      updatedMessages.push(acceptMessage);
    }

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', messages: updatedMessages }),
    });
    
    loadConnectionRequests();
    router.push("/messages");
  };

  const rejectRequest = async (conversationId: string) => {
    const messagesRes = await fetch('/api/messages');
    const messages = await messagesRes.json();
    
    // Update request status to rejected
    const updatedMessages = messages.map((m: any) => {
      if (m.conversationId === conversationId && m.isConnectionRequest) {
        return { ...m, requestStatus: "rejected" };
      }
      return m;
    });

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', messages: updatedMessages }),
    });
    
    loadConnectionRequests();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
    }
  };

  if (!isAuthenticated) return null;

  const currentRequests = activeTab === "received" ? receivedRequests : sentRequests;
  const pendingCount = currentRequests.filter(r => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <UserPlus className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Connection Requests
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your connection requests
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("received")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "received"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Inbox className="w-5 h-5" />
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "sent"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Send className="w-5 h-5" />
            Sent ({sentRequests.length})
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentRequests.filter(r => r.status === "accepted").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {currentRequests.length === 0 ? (
            <div className="p-12 text-center">
              <UserPlus className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No {activeTab} requests yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {activeTab === "received" 
                  ? "When others reach out to you, they'll appear here"
                  : "Start connecting with others through the Match Making page"}
              </p>
              <Link
                href="/matchmaking"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Browse {user?.role === "investor" ? "Founders" : "Investors"}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentRequests.map((request) => (
                <div
                  key={request.conversationId}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    <Image
                      src={request.avatar}
                      alt={request.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {request.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {request.company || request.firm}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(request.status)}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(request.timestamp)}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                          &quot;{request.message}&quot;
                        </p>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-700 dark:text-gray-300">{request.industry}</span>
                        </div>
                        {request.stage && (
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-gray-700 dark:text-gray-300">{request.stage}</span>
                          </div>
                        )}
                        {(request.fundingGoal || request.investmentRange) && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {request.fundingGoal || request.investmentRange}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          <span className="text-gray-700 dark:text-gray-300">{request.location}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {request.description || request.bio}
                      </p>

                      {activeTab === "received" && request.status === "pending" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => acceptRequest(request.conversationId, request.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            <Check className="w-5 h-5" />
                            Accept & Message
                          </button>
                          <button
                            onClick={() => rejectRequest(request.conversationId)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-semibold"
                          >
                            <X className="w-5 h-5" />
                            Decline
                          </button>
                        </div>
                      )}
                      {request.status === "accepted" && (
                        <Link
                          href="/messages"
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          <MessageSquare className="w-5 h-5" />
                          Continue Conversation
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
