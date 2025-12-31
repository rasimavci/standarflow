"use client";

import { Users, TrendingUp, Rss, UserCircle } from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  iconColor: string;
  link?: string;
}

const features: Feature[] = [
  {
    icon: Users,
    title: "Smart Match Making",
    description: "Our AI-powered algorithm connects founders with investors based on industry, stage, investment size, and strategic fit.",
    color: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    link: "/matchmaking"
  },
  {
    icon: TrendingUp,
    title: "Investment Trends",
    description: "Stay ahead with real-time insights into trending investment topics, hot sectors, and emerging opportunities.",
    color: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-400",
    link: "/trends"
  },
  {
    icon: Rss,
    title: "Curated Feeds",
    description: "Get personalized updates on funding news, success stories, investor activities, and opportunities tailored to your profile.",
    color: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: UserCircle,
    title: "Professional Profiles",
    description: "Showcase your startup or investment portfolio with rich profiles, pitch decks, traction metrics, and achievements.",
    color: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600 dark:text-orange-400"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Connect
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to make fundraising and investing seamless and effective.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const CardContent = (
              <>
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </>
            );

            return feature.link ? (
              <a
                key={index}
                href={feature.link}
                className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1 block"
              >
                {CardContent}
              </a>
            ) : (
              <div 
                key={index}
                className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {CardContent}
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Create Your Profile
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up and complete your profile with company details and pitch deck
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Get Matched
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Our algorithm finds the best investor matches for your startup
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start Connecting
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Connect directly with investors and begin your funding journey
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
