# 📧 EmailJS Setup Guide for Bubbaversary Website

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the connection steps for your provider
5. **Copy the Service ID** - this goes in `VITE_EMAILJS_SERVICE_ID`

## Step 3: Create Email Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template content:

```
Subject: 💕 Our Bubbaversary Date Plan is Ready!

Hi {{to_name}},

🎉 Our Bubbaversary Date Plan is Ready! 🎉

📅 Date: {{date}}
🍽️ Restaurant: {{restaurant}}
🎉 Activity: {{activity}}
✨ Excitement Level: {{excitement}}

🌦️ Weather Forecast: {{weather}}

{{message}}

Can't wait for our amazing bubbaversary date! 💕

With love,
{{from_name}} 🐱
```

4. **Copy the Template ID** - this goes in `VITE_EMAILJS_TEMPLATE_ID`

## Step 4: Get Public Key
1. Go to **Account** → **General**
2. Find your **Public Key** 
3. **Copy the Public Key** - this goes in `VITE_EMAILJS_PUBLIC_KEY`

## Step 5: Update .env.local
Replace the placeholder values in your `.env.local` file:
- `VITE_EMAILJS_SERVICE_ID=service_xxxxxxx`
- `VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx`
- `VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx`
- `VITE_YOUR_EMAIL=your-actual-email@example.com`

## Step 6: Test the Setup
1. Run `npm run dev` to start your development server
2. Complete the date planning flow
3. Click "Send me our plan" button
4. Check your email inbox!

## 🔒 Security Notes
- Never commit `.env.local` to git (it's already in .gitignore)
- Public Key is safe to use in frontend (it's meant to be public)
- For production, add these variables to your Vercel environment settings

## 📱 Template Variables Available
Your EmailJS template can use these variables:
- `{{to_name}}` - "Beautiful Girl"
- `{{from_name}}` - "Bubba" 
- `{{date}}` - "Wednesday, October 15, 2025"
- `{{restaurant}}` - Selected restaurant name
- `{{activity}}` - Selected activity name
- `{{excitement}}` - "8/10 😍"
- `{{weather}}` - Weather forecast details
- `{{message}}` - Complete formatted message
- `{{to_email}}` - Recipient email address