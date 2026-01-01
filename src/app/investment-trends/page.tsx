"use client";

import { useState } from "react";

export default function InvestmentTrendsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025");

  const trendingIndustries = [
    {
      name: "AI/ML",
      growth: "+145%",
      deals: 342,
      totalFunding: "$12.4B",
      avgDealSize: "$36.3M",
      color: "blue"
    },
    {
      name: "HealthTech",
      growth: "+92%",
      deals: 198,
      totalFunding: "$8.7B",
      avgDealSize: "$43.9M",
      color: "green"
    },
    {
      name: "FinTech",
      growth: "+78%",
      deals: 265,
      totalFunding: "$9.2B",
      avgDealSize: "$34.7M",
      color: "purple"
    },
    {
      name: "CleanTech",
      growth: "+124%",
      deals: 156,
      totalFunding: "$7.1B",
      avgDealSize: "$45.5M",
      color: "emerald"
    },
    {
      name: "EdTech",
      growth: "+64%",
      deals: 134,
      totalFunding: "$4.2B",
      avgDealSize: "$31.3M",
      color: "orange"
    },
    {
      name: "CyberSecurity",
      growth: "+89%",
      deals: 112,
      totalFunding: "$5.8B",
      avgDealSize: "$51.8M",
      color: "red"
    }
  ];

  const regionalTrends = [
    { region: "North America", deals: 654, funding: "$28.4B", topSector: "AI/ML" },
    { region: "Europe", deals: 412, funding: "$15.2B", topSector: "FinTech" },
    { region: "Asia Pacific", deals: 387, funding: "$13.8B", topSector: "E-commerce" },
    { region: "Middle East", deals: 89, funding: "$3.2B", topSector: "FinTech" },
    { region: "Latin America", deals: 76, funding: "$2.1B", topSector: "FinTech" }
  ];

  const stageTrends = [
    { stage: "Seed", avgSize: "$2.5M", deals: 542, growth: "+34%" },
    { stage: "Series A", avgSize: "$12.8M", deals: 387, growth: "+28%" },
    { stage: "Series B", avgSize: "$38.4M", deals: 234, growth: "+42%" },
    { stage: "Series C+", avgSize: "$95.2M", deals: 145, growth: "+56%" }
  ];

  const emergingTrends = [
    {
      title: "AI-Powered Healthcare",
      description: "Machine learning applications in diagnostics and drug discovery are attracting massive investment.",
      growth: "+215%",
      deals: 89
    },
    {
      title: "Climate Tech Solutions",
      description: "Carbon capture, renewable energy storage, and sustainable materials are trending upward.",
      growth: "+178%",
      deals: 67
    },
    {
      title: "Web3 & Blockchain",
      description: "Decentralized finance and NFT platforms continue to evolve despite market volatility.",
      growth: "+94%",
      deals: 124
    },
    {
      title: "Space Technology",
      description: "Satellite technology and space exploration ventures are gaining traction.",
      growth: "+167%",
      deals: 42
    },
    {
      title: "Quantum Computing",
      description: "Quantum algorithms and quantum-safe cryptography are emerging investment areas.",
      growth: "+203%",
      deals: 28
    },
    {
      title: "Edge AI & IoT",
      description: "Smart cities and industrial IoT applications are driving edge computing investments.",
      growth: "+142%",
      deals: 98
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Investment Trends 2025
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay ahead of the curve with real-time insights into startup funding trends, 
            hot industries, and emerging investment opportunities.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex gap-2">
            {["2025", "2024", "2023"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">$62.8B</div>
            <div className="text-blue-100">Total Funding</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">1,308</div>
            <div className="text-green-100">Total Deals</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">+87%</div>
            <div className="text-purple-100">YoY Growth</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">$48M</div>
            <div className="text-orange-100">Avg Deal Size</div>
          </div>
        </div>

        {/* Trending Industries */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Trending Industries
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingIndustries.map((industry) => (
              <div
                key={industry.name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {industry.name}
                  </h3>
                  <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                    {industry.growth}
                  </span>
                </div>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Total Funding:</span>
                    <span className="font-semibold">{industry.totalFunding}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deals:</span>
                    <span className="font-semibold">{industry.deals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Deal Size:</span>
                    <span className="font-semibold">{industry.avgDealSize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Trends */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Regional Trends
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Region</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Deals</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Total Funding</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Top Sector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {regionalTrends.map((trend) => (
                  <tr key={trend.region} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{trend.region}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{trend.deals}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{trend.funding}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                        {trend.topSector}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stage Trends */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Funding by Stage
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {stageTrends.map((stage) => (
              <div
                key={stage.stage}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {stage.stage}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Size</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stage.avgSize}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Deals</div>
                    <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                      {stage.deals}
                    </div>
                  </div>
                  <div className="text-green-600 dark:text-green-400 font-semibold">
                    {stage.growth}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Trends */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Emerging Trends to Watch
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {emergingTrends.map((trend) => (
              <div
                key={trend.title}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {trend.title}
                  </h3>
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-2">
                    {trend.growth}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {trend.description}
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {trend.deals} deals in 2025
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-blue-100 mb-6">
            Subscribe to our weekly investment trends newsletter
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
