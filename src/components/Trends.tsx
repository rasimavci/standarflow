"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, Users, BarChart3, Zap, Activity, Globe, Smartphone } from "lucide-react";

interface TrendCategory {
  name: string;
  icon: JSX.Element;
  growth: string;
  funding: string;
  deals: number;
  description: string;
  hotStartups: string[];
  color: string;
}

export default function Trends() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const trendCategories: TrendCategory[] = [
    {
      name: "AI & Machine Learning",
      icon: <Zap className="w-8 h-8" />,
      growth: "+156%",
      funding: "$24.5B",
      deals: 1248,
      description: "Generative AI, LLMs, and AI infrastructure continue to dominate venture funding with unprecedented growth.",
      hotStartups: ["OpenAI", "Anthropic", "Stability AI", "Cohere", "Midjourney"],
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "FinTech",
      icon: <DollarSign className="w-8 h-8" />,
      growth: "+89%",
      funding: "$18.2B",
      deals: 856,
      description: "Digital banking, payment solutions, and blockchain applications are reshaping financial services.",
      hotStartups: ["Stripe", "Plaid", "Chime", "Revolut", "Brex"],
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "HealthTech",
      icon: <Activity className="w-8 h-8" />,
      growth: "+112%",
      funding: "$15.8B",
      deals: 742,
      description: "Telemedicine, AI diagnostics, and personalized healthcare are transforming the medical industry.",
      hotStartups: ["Tempus", "Oscar Health", "Devoted Health", "Hims & Hers", "Ro"],
      color: "from-red-500 to-orange-500"
    },
    {
      name: "CleanTech",
      icon: <Globe className="w-8 h-8" />,
      growth: "+143%",
      funding: "$12.4B",
      deals: 524,
      description: "Renewable energy, carbon capture, and sustainable solutions are attracting massive investment.",
      hotStartups: ["Rivian", "Northvolt", "Commonwealth Fusion", "Redwood Materials", "Form Energy"],
      color: "from-green-600 to-teal-500"
    },
    {
      name: "SaaS & Enterprise",
      icon: <BarChart3 className="w-8 h-8" />,
      growth: "+67%",
      funding: "$16.9B",
      deals: 1056,
      description: "Cloud-based solutions, productivity tools, and enterprise software continue steady growth.",
      hotStartups: ["Notion", "Figma", "Canva", "Airtable", "Monday.com"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Web3 & Crypto",
      icon: <Smartphone className="w-8 h-8" />,
      growth: "+78%",
      funding: "$9.7B",
      deals: 412,
      description: "Decentralized finance, NFTs, and blockchain infrastructure remain hot despite market volatility.",
      hotStartups: ["Coinbase", "OpenSea", "Alchemy", "Magic Eden", "Polygon"],
      color: "from-indigo-500 to-purple-500"
    },
    {
      name: "EdTech",
      icon: <Users className="w-8 h-8" />,
      growth: "+92%",
      funding: "$8.3B",
      deals: 384,
      description: "Online learning platforms, upskilling programs, and educational AI are rapidly expanding.",
      hotStartups: ["Coursera", "Duolingo", "Udemy", "Skillshare", "Masterclass"],
      color: "from-yellow-500 to-orange-500"
    },
    {
      name: "E-commerce",
      icon: <TrendingUp className="w-8 h-8" />,
      growth: "+54%",
      funding: "$11.2B",
      deals: 628,
      description: "Direct-to-consumer brands, marketplace platforms, and social commerce are thriving.",
      hotStartups: ["Shopify", "Faire", "Poshmark", "ThredUp", "Wish"],
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Market Insights 2025
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Investment Trends
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the hottest sectors, funding patterns, and emerging opportunities 
            shaping the venture capital landscape.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Funding</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$117B</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 94% YoY</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Deals</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">5,850</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">↑ 67% YoY</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Active Investors</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">2,340</p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">↑ 45% YoY</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Avg Deal Size</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$20M</p>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">↑ 28% YoY</p>
          </div>
        </div>

        {/* Trend Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
              className="group cursor-pointer"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-br ${category.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    {category.icon}
                    <span className="text-2xl font-bold">{category.growth}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Funding</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{category.funding}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Deals</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{category.deals}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {category.description}
                  </p>

                  {/* Expandable Hot Startups */}
                  {selectedCategory === category.name && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Hot Startups:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {category.hotStartups.map((startup, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                          >
                            {startup}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    {selectedCategory === category.name ? "Show Less ↑" : "Show More ↓"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Join the Next Big Trend?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Connect with innovative founders or find the perfect investors for your startup
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Apply as Founder
            </a>
            <a
              href="/investors"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Join as Investor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
