# my-name-writing-app

Prepared for deployment on Vercel (Next.js).

Quick start:
1. Install dependencies
   npm install
2. Run dev server
   npm run dev
3. Build
   npm run build
4. Start production
   npm start

Notes:
- Add secrets (Razorpay key etc.) under Project Settings → Environment Variables in Vercel.
- Static assets should live in /public
- If you prefer plain React (Vite or CRA) tell me and I'll adapt scripts and structure.

Reminder:
- Install react-hot-toast in your environment:
  npm install react-hot-toast

Migration hints:
- Move calculateMissedDays to a shared util (done: utils/progress.js)
- Replace UploadFile and Payment.* with your backend endpoints or Vercel serverless functions
