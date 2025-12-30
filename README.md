# standarflow - Investor-Founder Platform

A modern platform  connecting innovative founders with strategic investors. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🤝 Smart Match Making
AI-powered algorithm that connects founders with investors based on industry, stage, investment size, and strategic fit.

### 📈 Investment Trends
Real-time insights into trending investment topics, hot sectors, and emerging opportunities in the startup ecosystem.

### 📰 Curated Feeds
Personalized updates on funding news, success stories, investor activities, and opportunities tailored to your profile.

### 👤 Professional Profiles
Showcase your startup or investment portfolio with rich profiles, pitch decks, traction metrics, and achievements.

### 📄 Founder Application
Simple application process with pitch deck upload functionality for founders seeking investment.

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd folder1
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
folder1/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with metadata
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   └── components/
│       ├── Hero.tsx        # Hero section with navigation
│       ├── Features.tsx    # Features showcase
│       ├── ApplicationForm.tsx  # Founder application form
│       └── Footer.tsx      # Footer component
├── public/                 # Static assets
├── .github/
│   └── copilot-instructions.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Available Scripts

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Breakdown

### Hero Section
- Eye-catching headline and call-to-action
- Platform statistics (investors, startups, capital raised, matches)
- Dual CTAs for founders and investors

### Features Section
- Four main features with icons and descriptions
- "How It Works" 3-step process
- Responsive grid layout

### Application Form
- Comprehensive founder application
- Fields for company details, industry, funding stage
- Pitch deck upload with drag-and-drop
- Success confirmation

### Footer
- Platform links and resources
- Company information
- Social media links

## Customization

### Colors
Modify the color scheme in [tailwind.config.ts](tailwind.config.ts) and [src/app/globals.css](src/app/globals.css).

### Content
Update text content in the component files:
- [src/components/Hero.tsx](src/components/Hero.tsx) - Hero text and stats
- [src/components/Features.tsx](src/components/Features.tsx) - Feature descriptions
- [src/components/ApplicationForm.tsx](src/components/ApplicationForm.tsx) - Form fields
- [src/components/Footer.tsx](src/components/Footer.tsx) - Footer links

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click

### Deploy to Other Platforms

Build the project:
```bash
npm run build
```

The output will be in the `.next` directory. Follow your hosting provider's Next.js deployment guide.

## Future Enhancements

- User authentication system
- Backend API for form submissions
- Database integration for storing applications
- Admin dashboard for reviewing applications
- Real-time matching algorithm
- Investor portal
- Messaging system between founders and investors
- Analytics dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact [support@standarflow.com](mailto:support@standarflow.com)

---

Built with ❤️ by the standarflow Team
