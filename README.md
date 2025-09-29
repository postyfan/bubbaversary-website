# Bubbaversary website

![Made with Love](https://img.shields.io/badge/Made%20with-Love-ff69b4.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38bdf8.svg)

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/bubbaversary-website.git
cd bubbaversary-website
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📧 Email Setup

### Option 1: EmailJS (Client-side)
1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Get your service ID, template ID, and public key
3. Add to \`.env.local\`:
\`\`\`env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
\`\`\`

### Option 2: Vercel Serverless
1. Uncomment code in \`/api/send-email.js\`
2. Add SendGrid API key to Vercel environment variables
3. Deploy to Vercel

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/labubu-date-picker)

Or manually:
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/labubu-date-picker)

## Project Structure

\`\`\`
├── src/
│   ├── App.jsx          # Main React component
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind CSS styles
├── public/              # Static assets
├── api/                 # Serverless functions
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
\`\`\`

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **EmailJS** - Email service
- **Vercel** - Deployment

## Environment Variables

Create a \`.env.local\` file:
\`\`\`env
VITE_EMAILJS_SERVICE_ID=xxx
VITE_EMAILJS_TEMPLATE_ID=xxx
VITE_EMAILJS_PUBLIC_KEY=xxx
VITE_YOUR_EMAIL=your@email.com
\`\`\`

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
