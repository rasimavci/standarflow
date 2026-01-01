"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, ChevronDown, User, Settings, LogOut, Bell, Heart, Shield, MessageSquare, UserPlus } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const updateUnreadCount = () => {
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      const unread = messages.filter(
        (m: any) => m.recipientEmail === user.email && !m.read
      ).length;
      setUnreadCount(unread);

      // Count connection requests for investors
      if (user.role === 'investor') {
        const founderMessages = messages.filter(
          (m: any) => m.recipientEmail === user.email && m.senderRole === 'founder'
        );
        const conversationIds = new Set(founderMessages.map((m: any) => m.conversationId));
        setRequestCount(conversationIds.size);
      }
    };

    updateUnreadCount();
    const interval = setInterval(updateUnreadCount, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SF</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">standardflow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/matchmaking" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">
              Match Making
            </Link>
            <Link href="/fundraising" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">
              Fundraising
            </Link>
            <Link href="/trends" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">
              Trends
            </Link>
            <Link href="/feed" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">
              Feed
            </Link>
            {isAuthenticated && user?.role === 'investor' && (
              <Link href="/requests" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition relative">
                Requests
                {requestCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-blue-600 text-white text-xs rounded-full px-1">
                    {requestCount > 9 ? '9+' : requestCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/investors/apply" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">
                  For Investors
                </Link>
                <Link href="/#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">
                  Features
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <Link href="/#apply" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">
                Apply Now
              </Link>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Link href="/messages" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Image
                      src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                      alt={user.name || 'User avatar'}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user.role}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/saved"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Heart className="w-4 h-4" />
                        Saved
                      </Link>
                      <Link
                        href="/messages"
                        className="flex items-center justify-between gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-4 h-4" />
                          Messages
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                      {user.role === 'investor' && (
                        <Link
                          href="/requests"
                          className="flex items-center justify-between gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <UserPlus className="w-4 h-4" />
                            Requests
                          </div>
                          {requestCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                              {requestCount}
                            </span>
                          )}
                        </Link>
                      )}
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logout();
                          router.push('/');
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <Link
                href="/matchmaking"
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Match Making
              </Link>
              <Link
                href="/fundraising"
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fundraising
              </Link>
              <Link
                href="/trends"
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trends
              </Link>
              <Link
                href="/feed"
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Feed
              </Link>
              {isAuthenticated && user?.role === 'investor' && (
                <Link
                  href="/requests"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Connection Requests</span>
                  {requestCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                      {requestCount > 9 ? '9+' : requestCount}
                    </span>
                  )}
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/investors/apply"
                    className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    For Investors
                  </Link>
                  <Link
                    href="/#features"
                    className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                </>
              )}
              {!isAuthenticated && (
                <Link
                  href="/#apply"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply Now
                </Link>
              )}
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <div className="flex items-center gap-3 mb-3">
                      <Image src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt={user.name || 'User avatar'} width={40} height={40} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                        router.push('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-4 pt-2 space-y-2 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/signin"
                    className="block px-4 py-2 text-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
