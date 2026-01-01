"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, TrendingUp, DollarSign, Building2, Calendar, MapPin, ExternalLink, X, Users, Target, FileText } from "lucide-react";
import Footer from "@/components/Footer";

interface CrowdfundingCampaign {
  cik: string;
  companyName: string;
  acceptedDate: string;
  amountSold: number;
  offeringAmount: number;
  formType: string;
  url: string;
  filename: string;
  state: string;
  city: string;
  compensationAmount?: number;
}

interface EquityOffering {
  cik: string;
  companyName?: string;
  acceptedDate: string;
  date?: string;
  filingDate?: string;
  nameOfIssuer?: string;
  entityName?: string;
  formType: string;
  formSignification?: string;
  url?: string;
  filename?: string;
  aggregateAmountSold?: number;
  totalAmountSold?: number;
  totalOfferingAmount?: number;
  totalAmountRemaining?: number;
  valueOfRemainingSalesToBeOffered?: number;
  issuerCity?: string;
  issuerStateOrCountry?: string;
  issuerStateOrCountryDescription?: string;
  industryGroupType?: string;
  entityType?: string;
  totalNumberAlreadyInvested?: number;
  hasNonAccreditedInvestors?: boolean;
  isAmendment?: boolean;
}

type FundraisingType = 'crowdfunding' | 'equity';

interface CategoryConfig {
  id: FundraisingType;
  name: string;
  icon: any;
  color: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'crowdfunding',
    name: 'Crowdfunding Campaigns',
    icon: Users,
    color: 'blue'
  },
  {
    id: 'equity',
    name: 'Equity Offerings',
    icon: TrendingUp,
    color: 'purple'
  }
];

export default function FundraisingPage() {
  const [selectedCategory, setSelectedCategory] = useState<FundraisingType>('crowdfunding');
  const [crowdfundingData, setCrowdfundingData] = useState<CrowdfundingCampaign[]>([]);
  const [equityData, setEquityData] = useState<EquityOffering[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CrowdfundingCampaign | EquityOffering | null>(null);

  const API_KEY = "0MnwxO7b6STq6VUUvxvOfnTTEQ4YZ4ID";

  const loadCrowdfundingData = useCallback(async (searchName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = searchName
        ? `https://financialmodelingprep.com/stable/crowdfunding-offerings-search?name=${encodeURIComponent(searchName)}&apikey=${API_KEY}`
        : `https://financialmodelingprep.com/stable/crowdfunding-offerings-latest?page=0&limit=100&apikey=${API_KEY}`;
      
      const response = await fetch(endpoint);

      if (!response.ok) {
        if (response.status === 402) {
          setError('API limit reached. Please try again later.');
        } else {
          setError(`Unable to load data (Error ${response.status})`);
        }
        return;
      }

      const data = await response.json();
      setCrowdfundingData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading crowdfunding data:', error);
      setError('Failed to load crowdfunding campaigns.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEquityData = useCallback(async (searchName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = searchName
        ? `https://financialmodelingprep.com/stable/fundraising-search?name=${encodeURIComponent(searchName)}&apikey=${API_KEY}`
        : `https://financialmodelingprep.com/stable/fundraising-latest?page=0&limit=100&apikey=${API_KEY}`;
      
      const response = await fetch(endpoint);

      if (!response.ok) {
        if (response.status === 402) {
          setError('API limit reached. Please try again later.');
        } else {
          setError(`Unable to load data (Error ${response.status})`);
        }
        return;
      }

      const data = await response.json();
      setEquityData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading equity data:', error);
      setError('Failed to load equity offerings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSearchQuery('');
    setError(null);
    if (selectedCategory === 'crowdfunding') {
      loadCrowdfundingData();
    } else {
      loadEquityData();
    }
  }, [selectedCategory, loadCrowdfundingData, loadEquityData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      if (selectedCategory === 'crowdfunding') {
        loadCrowdfundingData();
      } else {
        loadEquityData();
      }
      return;
    }

    if (selectedCategory === 'crowdfunding') {
      loadCrowdfundingData(searchQuery.trim());
    } else {
      loadEquityData(searchQuery.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (selectedCategory === 'crowdfunding') {
      loadCrowdfundingData();
    } else {
      loadEquityData();
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDisplayName = (item: CrowdfundingCampaign | EquityOffering) => {
    if ('companyName' in item && item.companyName) return item.companyName;
    if ('entityName' in item && item.entityName) return item.entityName;
    if ('nameOfIssuer' in item && item.nameOfIssuer) return item.nameOfIssuer;
    return 'Unknown Company';
  };

  const getDisplayDate = (item: CrowdfundingCampaign | EquityOffering) => {
    if ('acceptedDate' in item && item.acceptedDate) return item.acceptedDate;
    if ('date' in item && item.date) return item.date;
    return '';
  };

  const getAmountSold = (offering: EquityOffering) => {
    return offering.totalAmountSold || offering.aggregateAmountSold || 0;
  };

  const getAmountRemaining = (offering: EquityOffering) => {
    return offering.totalAmountRemaining || offering.valueOfRemainingSalesToBeOffered || 0;
  };

  const currentData = selectedCategory === 'crowdfunding' ? crowdfundingData : equityData;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full mb-6">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Investment Opportunities
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Fundraising Opportunities
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover crowdfunding campaigns and equity offerings. Track funding activities and explore investment opportunities.
            </p>
          </div>

          {/* Category Selector */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-800">
              <button
                onClick={() => setSelectedCategory('crowdfunding')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === 'crowdfunding'
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Crowdfunding Campaigns
              </button>
              <button
                onClick={() => setSelectedCategory('equity')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === 'equity'
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Equity Offerings
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${selectedCategory === 'crowdfunding' ? 'campaigns' : 'offerings'} by company name...`}
                  className="w-full pl-12 pr-32 py-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-lg"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Stats Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-12 text-white">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">{currentData.length}</div>
                <div className="text-blue-100">{selectedCategory === 'crowdfunding' ? 'Campaigns' : 'Offerings'} Found</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">
                  <Target className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-blue-100">Active Opportunities</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">USA</div>
                <div className="text-blue-100">Market Focus</div>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto px-8 py-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">Error</h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Data Grid */}
          {!loading && !error && (
            <>
              {selectedCategory === 'crowdfunding' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {crowdfundingData.map((campaign, index) => (
                    <div
                      key={`${campaign.cik}-${index}`}
                      onClick={() => setSelectedItem(campaign)}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                              {campaign.companyName}
                            </h3>
                            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                              {campaign.formType}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">Target: {formatCurrency(campaign.offeringAmount)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>Raised: {formatCurrency(campaign.amountSold)}</span>
                          </div>
                          {campaign.city && campaign.state && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{campaign.city}, {campaign.state}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(campaign.acceptedDate)}</span>
                          </div>
                        </div>

                        {campaign.offeringAmount > 0 && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{Math.round((campaign.amountSold / campaign.offeringAmount) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min((campaign.amountSold / campaign.offeringAmount) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2">
                          View Details
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {equityData.map((offering, index) => (
                    <div
                      key={`${offering.cik}-${index}`}
                      onClick={() => setSelectedItem(offering)}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-500"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                              {getDisplayName(offering)}
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                              <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                                {offering.formType}
                              </span>
                              {offering.isAmendment && (
                                <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold">
                                  Amendment
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          {getAmountSold(offering) > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold">Sold: {formatCurrency(getAmountSold(offering))}</span>
                            </div>
                          )}
                          {offering.totalOfferingAmount && offering.totalOfferingAmount > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Target className="w-4 h-4" />
                              <span>Target: {formatCurrency(offering.totalOfferingAmount)}</span>
                            </div>
                          )}
                          {getAmountRemaining(offering) > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <TrendingUp className="w-4 h-4" />
                              <span>Remaining: {formatCurrency(getAmountRemaining(offering))}</span>
                            </div>
                          )}
                          {offering.industryGroupType && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Building2 className="w-4 h-4" />
                              <span className="line-clamp-1">{offering.industryGroupType}</span>
                            </div>
                          )}
                          {offering.issuerCity && offering.issuerStateOrCountryDescription && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{offering.issuerCity}, {offering.issuerStateOrCountryDescription}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(getDisplayDate(offering))}</span>
                          </div>
                          {offering.totalNumberAlreadyInvested && offering.totalNumberAlreadyInvested > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Users className="w-4 h-4" />
                              <span>{offering.totalNumberAlreadyInvested} Investors</span>
                            </div>
                          )}
                        </div>

                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2">
                          View Details
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Data Message */}
              {currentData.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <FileText className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      No {selectedCategory === 'crowdfunding' ? 'campaigns' : 'offerings'} found
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`sticky top-0 ${selectedCategory === 'crowdfunding' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-purple-600 to-purple-700'} p-6 flex items-start justify-between z-10`}>
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {getDisplayName(selectedItem)}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full font-semibold">
                    {selectedItem.formType}
                  </span>
                  {'isAmendment' in selectedItem && selectedItem.isAmendment && (
                    <span className="px-3 py-1 bg-orange-400/30 text-white rounded-full font-semibold">
                      Amendment
                    </span>
                  )}
                  {'formSignification' in selectedItem && selectedItem.formSignification && (
                    <span className="text-white/90 text-xs">
                      {selectedItem.formSignification}
                    </span>
                  )}
                  <span className="text-white/90">
                    CIK: {selectedItem.cik}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-shrink-0 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {selectedCategory === 'crowdfunding' && 'companyName' in selectedItem && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Funding Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Offering Amount</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(selectedItem.offeringAmount)}
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount Raised</p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(selectedItem.amountSold)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedItem.offeringAmount > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Campaign Progress</h3>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>Funding Progress</span>
                            <span className="font-semibold">{Math.round((selectedItem.amountSold / selectedItem.offeringAmount) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full transition-all"
                              style={{ width: `${Math.min((selectedItem.amountSold / selectedItem.offeringAmount) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Company Information</h3>
                      <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        {selectedItem.city && selectedItem.state && (
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                              <p className="text-gray-900 dark:text-white font-medium">{selectedItem.city}, {selectedItem.state}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Accepted Date</p>
                            <p className="text-gray-900 dark:text-white font-medium">{formatDate(selectedItem.acceptedDate)}</p>
                          </div>
                        </div>
                        {selectedItem.compensationAmount && (
                          <div className="flex items-start gap-3">
                            <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Compensation Amount</p>
                              <p className="text-gray-900 dark:text-white font-medium">{formatCurrency(selectedItem.compensationAmount)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {selectedCategory === 'equity' && 'nameOfIssuer' in selectedItem && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Offering Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {getAmountSold(selectedItem) > 0 && (
                          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount Sold</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {formatCurrency(getAmountSold(selectedItem))}
                            </p>
                          </div>
                        )}
                        {selectedItem.totalOfferingAmount && selectedItem.totalOfferingAmount > 0 && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Offering</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {formatCurrency(selectedItem.totalOfferingAmount)}
                            </p>
                          </div>
                        )}
                        {getAmountRemaining(selectedItem) > 0 && (
                          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining to Offer</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {formatCurrency(getAmountRemaining(selectedItem))}
                            </p>
                          </div>
                        )}
                        {selectedItem.totalNumberAlreadyInvested && selectedItem.totalNumberAlreadyInvested > 0 && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Investors</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {selectedItem.totalNumberAlreadyInvested}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Company Information</h3>
                      <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        {selectedItem.entityName && (
                          <div className="flex items-start gap-3">
                            <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Entity Name</p>
                              <p className="text-gray-900 dark:text-white font-medium">{selectedItem.entityName}</p>
                            </div>
                          </div>
                        )}
                        {selectedItem.industryGroupType && (
                          <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Industry</p>
                              <p className="text-gray-900 dark:text-white font-medium">{selectedItem.industryGroupType}</p>
                            </div>
                          </div>
                        )}
                        {selectedItem.entityType && (
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Entity Type</p>
                              <p className="text-gray-900 dark:text-white font-medium">{selectedItem.entityType}</p>
                            </div>
                          </div>
                        )}
                        {selectedItem.issuerCity && selectedItem.issuerStateOrCountryDescription && (
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                              <p className="text-gray-900 dark:text-white font-medium">
                                {selectedItem.issuerCity}, {selectedItem.issuerStateOrCountryDescription}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Accepted Date</p>
                            <p className="text-gray-900 dark:text-white font-medium">{formatDate(getDisplayDate(selectedItem))}</p>
                          </div>
                        </div>
                        {selectedItem.hasNonAccreditedInvestors !== undefined && (
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Non-Accredited Investors</p>
                              <p className="text-gray-900 dark:text-white font-medium">
                                {selectedItem.hasNonAccreditedInvestors ? 'Yes' : 'No'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-100 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
              {selectedItem.url ? (
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${selectedCategory === 'crowdfunding' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg transition-colors font-semibold`}
                >
                  View Official Filing
                  <ExternalLink className="w-5 h-5" />
                </a>
              ) : (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Official filing URL not available
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
