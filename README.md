# Bubbaversary Website
<img src="https://media.tenor.com/-JToZdYDcREAAAAj/dudu-give-flowers-bubu-gif.gif">
<br>

---
> A creative and romantic way to ask someone special on a date

This is a personalized interactive website I built to ask my girlfriend on a date. It features a modern, responsive design with smooth animations and an email notification system.

## Features

- **Interactive UI**: Engaging user experience with smooth transitions and animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Email Notifications**: Get notified when she responds (via EmailJS)
- **Modern Stack**: Built with React, Vite, and Tailwind CSS
- **Fast & Lightweight**: Optimized for performance

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/postyfan/bubbaversary-website.git
cd bubbaversary-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Email Setup (Optional)

### Option 1: EmailJS (Recommended for client-side)

1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Get your service ID, template ID, and public key
3. Create a `.env.local` file in the root directory:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_YOUR_EMAIL=your@email.com
```

### Option 2: SendGrid (Serverless function)

1. Uncomment code in `/api/send-email.js`
2. Add SendGrid API key to Vercel environment variables when deploying

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/postyfan/bubbaversary-website)

Or manually:
```bash
npm run build
vercel --prod
```

## Project Structure

```
bubbaversary-website/
├── src/
│   ├── App.jsx              # Main React component
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind CSS styles
├── public/                  # Static assets
├── api/                     # Serverless functions
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## Built With

- **[React 18](https://react.dev/)** - UI framework
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[EmailJS](https://www.emailjs.com/)** - Client-side email service
- **[Vercel](https://vercel.com/)** - Deployment platform

## Customization

Feel free to customize the website for your own special occasion:

1. Update text and messages in `src/App.jsx`
2. Modify colors in `tailwind.config.js`
3. Add your own images to the `public/` folder
4. Adjust animations and transitions in the component styles

## License

This project is open source and available under the [MIT License](LICENSE).

## Inspiration

Sometimes the best way to ask someone special out is to put your heart (and code) into it. This project was built with love and a lot of late-night coding sessions.

---

Made with love and coffee.

If you found this project inspiring or helpful, feel free to star the repo!