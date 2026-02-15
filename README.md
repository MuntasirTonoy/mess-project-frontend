# Mess Project - Utility Bill Management

A modern web application built with Next.js to help mess members calculate and manage their shared utility bills (Electric, Water, etc.) efficiently by Digital Solution Inc.

## 🚀 Features

- **Smart Calculator**: Easily calculate bills based on meter readings or fixed amounts.
- **Bill History**: A dedicated dashboard to view, detail, and delete past records.
- **Detailed Breakdowns**: View bill summaries per person and per utility.
- **Responsive Design**: Full desktop and mobile support using Tailwind CSS and DaisyUI.
- **Real-time API Integration**: Uses Axios to communicate with the Express backend.

## 🛠 Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **Axios** (Data fetching)
- **Tailwind CSS** & **DaisyUI**
- **Date-fns** (Date formatting)
- **SweetAlert2** (Interactive alerts)

## ⚙️ Setup & Installation

1. Clone the repository and navigate to the frontend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` for local development:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🌍 Environment Variables

For production (Vercel), ensure you set:

- `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://mess-project-backend.vercel.app`).

## 📁 Project Structure

- `/app`: Next.js App Router pages (Dashboard, Bills, etc.).
- `/components`: Reusable UI components (Calculator, Summary).
- `/config`: Centralized API and Axios configuration.
- `/public`: Static assets and icons.
