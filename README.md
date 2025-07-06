# GreenGraph

A modern, full-stack financial dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Stage 1: Basic Transaction Tracking
- Add, edit, and delete transactions (amount, date, description)
- Transaction list view
- Monthly expenses bar chart
- Basic form validation

### Stage 2: Categories
- All Stage 1 features, plus:
- Predefined categories for transactions
- Category-wise pie chart
- Dashboard with summary cards: total expenses, category breakdown, most recent transactions

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

- All API endpoints are in `/src/app/api`.
- Pages are in `/src/app` (e.g., `/dashboard`, `/transactions`, `/categories`, `/analytics`).
- Components are in `/src/components` (with reusable UI in `/src/components/ui`).
- Types, hooks, and utilities are in their respective folders.

---

**This project is submitted as part of an interview assignment (Stage 2 complete).**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



