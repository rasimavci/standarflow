"use client";

import { useState, useEffect } from "react";
import { Upload, CheckCircle2 } from "lucide-react";

interface Country {
  name: {
    common: string;
  };
  cca2: string;
}

interface University {
  name: string;
  domains: string[];
  web_pages: string[];
}

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    founderName: "",
    email: "",
    companyName: "",
    website: "",
    country: "",
    university: "",
    industry: "",
    stage: "",
    fundingGoal: "",
    description: ""
  });
  const [fileName, setFileName] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [universitySearch, setUniversitySearch] = useState("");
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [universityError, setUniversityError] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: Country, b: Country) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
      })
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

  // Fetch universities based on country selection
  useEffect(() => {
    if (!formData.country) {
      setUniversities([]);
      return;
    }

    const selectedCountry = countries.find(c => c.cca2 === formData.country);
    if (!selectedCountry) return;

    let countryName = selectedCountry.name.common;
    if (countryName === "Turkey") {
      countryName = "Turkiye";
    }

    const isUnitedStates = countryName === "United States";

    // For United States, only search when user types (min 1 char)
    if (isUnitedStates) {
      if (universitySearch.length < 1) {
        setUniversities([]);
        return;
      }

      const timeoutId = setTimeout(() => {
        setLoadingUniversities(true);
        fetch(`/api/universities?name=${encodeURIComponent(universitySearch)}&country=${encodeURIComponent(countryName)}`)
          .then(res => {
            if (!res.ok) {
              throw new Error('Failed to fetch universities');
            }
            return res.json();
          })
          .then(data => {
            if (Array.isArray(data)) {
              setUniversities(data);
              setUniversityError(false);
            } else {
              console.error('Invalid data format from API:', data);
              setUniversities([]);
              setUniversityError(true);
            }
            setLoadingUniversities(false);
          })
          .catch(err => {
            console.error('Error fetching universities:', err);
            setUniversities([]);
            setLoadingUniversities(false);
            setUniversityError(true);
          });
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      // For other countries, fetch all universities directly
      setLoadingUniversities(true);
      fetch(`/api/universities?country=${encodeURIComponent(countryName)}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch universities');
          }
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setUniversities(data);
            setUniversityError(false);
          } else {
            console.error('Invalid data format from API:', data);
            setUniversities([]);
            setUniversityError(true);
          }
          setLoadingUniversities(false);
        })
        .catch(err => {
          console.error('Error fetching universities:', err);
          setUniversities([]);
          setLoadingUniversities(false);
          setUniversityError(true);
        });
    }
  }, [universitySearch, formData.country, countries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    const founderData = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
      role: "founder",
      pitchDeck: fileName,
      createdAt: new Date().toISOString(),
      status: "active",
      favorites: []
    };
    
    // Get existing founders from localStorage
    const existingFounders = JSON.parse(localStorage.getItem("founders") || "[]");
    
    // Check if email already exists
    const existingIndex = existingFounders.findIndex((f: any) => f.email === formData.email);
    if (existingIndex >= 0) {
      // Update existing
      existingFounders[existingIndex] = founderData;
    } else {
      // Add new
      existingFounders.push(founderData);
    }
    
    localStorage.setItem("founders", JSON.stringify(existingFounders));
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        founderName: "",
        email: "",
        companyName: "",
        website: "",
        country: "",
        university: "",
        industry: "",
        stage: "",
        fundingGoal: "",
        description: ""
      });
      setFileName("");
      setUniversitySearch("");
    }, 3000);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData, 
      country: e.target.value,
      university: "" // Reset university when country changes
    });
    setUniversitySearch("");
    setUniversities([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <section id="apply" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Apply as a Founder
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Fill out the form below to get started. 
              You can optionally upload your pitch deck to enhance your application.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-12 text-center">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Application Submitted!
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Thank you for applying. We&apos;ll review your application and get back to you within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Founder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.founderName}
                    onChange={(e) => setFormData({...formData, founderName: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@startup.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Startup Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourstartup.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Country *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={handleCountryChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.cca2} value={country.cca2}>
                        {country.name.common === "Turkey" ? "Turkiye" : country.name.common}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    University *
                  </label>
                  {formData.country && countries.find(c => c.cca2 === formData.country)?.name.common === "United States" ? (
                    // Autocomplete input for United States
                    <>
                      <input
                        type="text"
                        required
                        value={universitySearch}
                        onChange={(e) => {
                          setUniversitySearch(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onFocus={() => universitySearch && setShowSuggestions(true)}
                        placeholder="Type to search universities..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {showSuggestions && universities.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {universities.map((uni, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setFormData({...formData, university: uni.name});
                                setUniversitySearch(uni.name);
                                setShowSuggestions(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              {uni.name}
                            </button>
                          ))}
                        </div>
                      )}
                      {loadingUniversities && universitySearch.length >= 1 && (
                        <p className="text-sm text-gray-500 mt-1">Searching...</p>
                      )}
                      {universityError && (
                        <p className="text-sm text-red-500 mt-1">
                          Unable to load universities. Please try again.
                        </p>
                      )}
                    </>
                  ) : (
                    // Regular dropdown for other countries
                    <>
                      <select
                        required
                        value={formData.university}
                        onChange={(e) => setFormData({...formData, university: e.target.value})}
                        disabled={!formData.country || loadingUniversities}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {loadingUniversities ? 'Loading universities...' : formData.country ? 'Select University' : 'Select country first'}
                        </option>
                        {universities.map((uni, index) => (
                          <option key={index} value={uni.name}>
                            {uni.name}
                          </option>
                        ))}
                      </select>
                      {universityError && (
                        <p className="text-sm text-red-500 mt-1">
                          Unable to load universities. Please try again.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Industry *
                  </label>
                  <select
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Industry</option>
                    <option value="fintech">FinTech</option>
                    <option value="healthtech">HealthTech</option>
                    <option value="saas">SaaS</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="ai">AI/ML</option>
                    <option value="cleantech">CleanTech</option>
                    <option value="edtech">EdTech</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Funding Stage *
                  </label>
                  <select
                    required
                    value={formData.stage}
                    onChange={(e) => setFormData({...formData, stage: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Stage</option>
                    <option value="pre-seed">Pre-Seed</option>
                    <option value="seed">Seed</option>
                    <option value="series-a">Series A</option>
                    <option value="series-b">Series B</option>
                    <option value="series-c">Series C+</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Funding Goal *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fundingGoal}
                  onChange={(e) => setFormData({...formData, fundingGoal: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., $500,000 - $1,000,000"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Company Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your company, product, and traction..."
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Pitch Deck (Optional - PDF, Max 10MB)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.ppt,.pptx"
                    className="hidden"
                    id="pitch-deck"
                  />
                  <label
                    htmlFor="pitch-deck"
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition"
                  >
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        {fileName ? (
                          <span className="text-blue-600 font-semibold">{fileName}</span>
                        ) : (
                          <>
                            <span className="text-blue-600 font-semibold">Click to upload</span> or drag and drop
                          </>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        PDF, PPT, or PPTX (max. 10MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Submit Application
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
