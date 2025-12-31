import foundersData from '@/data/founders.json';
import investorsData from '@/data/investors.json';

export const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;

  // Initialize founders data if not exists
  const existingFounders = localStorage.getItem('founders');
  if (!existingFounders) {
    localStorage.setItem('founders', JSON.stringify(foundersData));
  } else {
    // Merge existing with mock data (avoid duplicates by email)
    const founders = JSON.parse(existingFounders);
    const founderEmails = new Set(founders.map((f: any) => f.email));
    
    foundersData.forEach((mockFounder) => {
      if (!founderEmails.has(mockFounder.email)) {
        founders.push(mockFounder);
      }
    });
    
    localStorage.setItem('founders', JSON.stringify(founders));
  }

  // Initialize investors data if not exists
  const existingInvestors = localStorage.getItem('investors');
  if (!existingInvestors) {
    localStorage.setItem('investors', JSON.stringify(investorsData));
  } else {
    // Merge existing with mock data (avoid duplicates by email)
    const investors = JSON.parse(existingInvestors);
    const investorEmails = new Set(investors.map((i: any) => i.email));
    
    investorsData.forEach((mockInvestor) => {
      if (!investorEmails.has(mockInvestor.email)) {
        investors.push(mockInvestor);
      }
    });
    
    localStorage.setItem('investors', JSON.stringify(investors));
  }
};
