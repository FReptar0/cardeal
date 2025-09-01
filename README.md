# Cardeal - Car Rental Booking Platform
A Next.js-based car rental booking application that integrates with external services to provide a complete rental experience from search to confirmation.

## Overview

Cardeal is a full-stack web application that enables users to search, select, and book rental cars through integration with the TSD (Travel Service Distributor) service and Flap payment gateway. The application handles the complete user journey including car selection, insurance plans, extras booking, and payment processing.

## Features
- **Car Search & Selection**: Real-time availability and pricing through TSD integration
- **Insurance Plans**: Multiple protection levels with dynamic pricing based on vehicle category  
- **Extras Management**: Additional services like GPS, child seats, and insurance add-ons
- **Payment Processing**: Online payments via Flap gateway or counter payment options
- **Booking Confirmation**: PDF generation and booking management
- **User Authentication**: JWT-based authentication with persistent sessions

## Technology Stack
- **Frontend**: Next.js 15.3.1, React 19.0.0, Material-UI 6.4.3
- **Backend**: Next.js API routes, MongoDB 6.15.0
- **External Services**: TSD XML API, Flap Payment Gateway
- **Key Libraries**: React Hook Form, React-PDF, XML2JS
- 

## Getting Started

### Prerequisites

- Node.js (version compatible with Next.js 15.3.1)
- MongoDB database
- Environment variables for TSD and Flap integrations

### Installation

1. Clone the repository
2. Install dependencies:


```bash
npm install
# or
yarn install
```

3. Set up environment variables in `.env.local`:
   - Database connection strings
   - TSD API credentials  
   - Flap payment gateway keys
   - JWT secrets

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

The application follows Next.js conventions with organized components and API routes:

- `/src/components/` - Reusable React components
- `/src/pages/` - Next.js pages and API routes
- `/src/contexts/` - React context providers for state management
- `/src/data/` - Static data files for cars and extras

## Key Components

- **SearchBar**: Location and date selection with validation
- **OrderSummary**: Price breakdown with IVA calculations 
- **ExtrasLoader**: Loading states for dynamic content 

## API Integration

The application integrates with external services through Next.js API routes:

- `/api/rates` - Fetch car availability and pricing from TSD
- `/api/bookings/*` - Manage reservations and confirmations
- `/api/create-payment` - Initialize Flap payment processing
- `/api/webhook-success` - Handle payment confirmations

## Deployment

The application is optimized for deployment on Vercel:

Build the application:

```bash
npm run build
npm start
```


## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint
