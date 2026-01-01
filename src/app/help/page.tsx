"use client";

import { useState } from "react";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: "📚" },
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "founders", name: "For Founders", icon: "💡" },
    { id: "investors", name: "For Investors", icon: "💰" },
    { id: "account", name: "Account & Profile", icon: "👤" },
    { id: "matching", name: "Matchmaking", icon: "🤝" },
  ];

  const faqs = [
    {
      category: "getting-started",
      question: "How do I get started on StandardFlow?",
      answer: "Getting started is easy! Simply sign up for an account, choose whether you're a founder or investor, complete your profile, and start exploring matches. We'll guide you through each step of the process."
    },
    {
      category: "getting-started",
      question: "Is StandardFlow free to use?",
      answer: "StandardFlow offers both free and premium plans. The basic features are free for all users. Premium plans offer additional features like advanced matching algorithms, priority support, and detailed analytics."
    },
    {
      category: "founders",
      question: "What documents do I need to upload as a founder?",
      answer: "We recommend uploading your pitch deck, business plan, and financial projections. However, at minimum, you'll need to provide basic company information and a brief description of your startup."
    },
    {
      category: "founders",
      question: "How does the matching algorithm work?",
      answer: "Our algorithm considers multiple factors including your industry, funding stage, location, investment size, and strategic preferences. We use machine learning to continuously improve match quality based on successful connections."
    },
    {
      category: "founders",
      question: "How long does it take to get matched with investors?",
      answer: "Most founders start receiving matches within 24-48 hours of completing their profile. The exact timing depends on your industry, location, and funding stage."
    },
    {
      category: "investors",
      question: "How do I verify my investor status?",
      answer: "To become a verified investor, you'll need to provide proof of accreditation and investment history. Our team reviews all applications within 3-5 business days."
    },
    {
      category: "investors",
      question: "Can I filter startups by specific criteria?",
      answer: "Yes! You can filter by industry, stage, location, funding amount, traction metrics, and many other criteria. Premium members get access to advanced filters and saved searches."
    },
    {
      category: "investors",
      question: "How do I request a meeting with a founder?",
      answer: "Simply click the 'Request Meeting' button on any founder's profile. The founder will be notified and can accept or decline your request. You can also send a message first to introduce yourself."
    },
    {
      category: "account",
      question: "How do I update my profile information?",
      answer: "Go to Settings > Profile and update any information. Changes are saved automatically. Some changes may require verification before they're published."
    },
    {
      category: "account",
      question: "Can I have both a founder and investor account?",
      answer: "Yes! You can create separate profiles for your founder and investor activities. Simply switch between profiles using the account switcher in the top navigation."
    },
    {
      category: "account",
      question: "How do I delete my account?",
      answer: "Go to Settings > Account > Delete Account. Please note this action is irreversible and all your data will be permanently deleted within 30 days."
    },
    {
      category: "matching",
      question: "Why am I not getting any matches?",
      answer: "Make sure your profile is complete with all required information. Also check that your matching preferences aren't too restrictive. Our support team can review your profile if you continue to have issues."
    },
    {
      category: "matching",
      question: "Can I unmatch with someone?",
      answer: "Yes, you can unmatch at any time from the Matches page. The other party will not be notified, but you won't appear in each other's matches anymore."
    },
    {
      category: "matching",
      question: "What happens after I match with someone?",
      answer: "Once matched, you can start messaging each other through our platform. We recommend scheduling a video call to discuss potential collaboration further."
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Search our help center or browse by category
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
              />
              <svg
                className="absolute left-4 top-5 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="grid gap-6 mb-12">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No results found. Try a different search term or category.
              </p>
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-lg text-blue-100 mb-6">
            Our support team is here to assist you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="mailto:support@standardflow.com"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
