"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Heart, 
  Building2, 
  Briefcase,
  DollarSign,
  Calendar,
  Bell,
  Target,
  Award,
  Clock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    favorites: 0,
    messages: 0,
    requests: 0,
    connections: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated, router]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load messages
      const messagesRes = await fetch('/api/messages');
      const messages = await messagesRes.json();

      // Load founders/investors based on role
      if (user.role === 'investor') {
        const foundersRes = await fetch('/api/founders');
        const founders = await foundersRes.json();
        
        const investorsRes = await fetch('/api/investors');
        const investors = await investorsRes.json();
        const currentInvestor = investors.find((inv: any) => inv.email === user.email);
        
        setStats({
          favorites: currentInvestor?.favorites?.length || 0,
          messages: messages.filter((m: any) => 
            m.senderEmail === user.email || m.recipientEmail === user.email
          ).length,
          requests: messages.filter((m: any) => 
            m.isConnectionRequest && m.recipientEmail === user.email && m.requestStatus === 'pending'
          ).length,
          connections: messages.filter((m: any) => 
            m.isConnectionRequest && m.requestStatus === 'accepted' &&
            (m.senderEmail === user.email || m.recipientEmail === user.email)
          ).length
        });
      } else {
        const investorsRes = await fetch('/api/investors');
        const investors = await investorsRes.json();
        
        const foundersRes = await fetch('/api/founders');
        const founders = await foundersRes.json();
        const currentFounder = founders.find((f: any) => f.email === user.email);
        
        setStats({
          favorites: currentFounder?.favorites?.length || 0,
          messages: messages.filter((m: any) => 
            m.senderEmail === user.email || m.recipientEmail === user.email
          ).length,
          requests: messages.filter((m: any) => 
            m.isConnectionRequest && m.recipientEmail === user.email && m.requestStatus === 'pending'
          ).length,
          connections: messages.filter((m: any) => 
            m.isConnectionRequest && m.requestStatus === 'accepted' &&
            (m.senderEmail === user.email || m.recipientEmail === user.email)
          ).length
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user.role === 'investor' 
              ? 'Discover promising startups and manage your investment pipeline' 
              : 'Connect with investors and grow your startup'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/saved" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.favorites}</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-semibold">Saved</h3>
          </Link>

          <Link href="/messages" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.messages}</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-semibold">Messages</h3>
          </Link>

          <Link href="/requests" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.requests}</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-semibold">Pending Requests</h3>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.connections}</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-semibold">Connections</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/matchmaking"
              className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Browse {user.role === 'investor' ? 'Startups' : 'Investors'}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Find your match</p>
              </div>
            </Link>

            <Link
              href="/requests"
              className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">View Requests</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage connections</p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your info</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Role-specific content */}
        {user.role === 'investor' ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Investment Focus</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Investment Criteria</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    <span>{user.firm || 'Your Firm'}</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{user.investmentRange || 'Investment Range'}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Tip</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Complete your profile and set your investment preferences to get better matches with startups that fit your criteria.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Startup</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Company Overview</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Building2 className="w-4 h-4" />
                    <span>{user.company || 'Your Company'}</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{user.stage || 'Funding Stage'}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Tip</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Keep your pitch deck updated and clearly communicate your traction to attract the right investors.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
