# Gabbers

Gabbers is a real-time voice chat platform designed for language practice. Inspired by Clubhouse, Gabbers allows users to join virtual rooms for live conversation practice (starting with English for Persian speakers) and plans to support more languages in the future. The platform supports authentication via Google OAuth and local sign-in (using PostgreSQL), and it integrates WebRTC and Socket.io for real-time voice communication.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-Time Voice Chat:**  
  Engage in live voice conversations in dedicated rooms using WebRTC.
  
- **Multiple Authentication Options:**  
  Sign in using Google OAuth or create a local account with email and password (securely stored in PostgreSQL).

- **Responsive & SEO-Friendly:**  
  Built with Next.js 13 (using the new app directory) and Tailwind CSS for a modern, responsive UI.

- **Scalable Architecture:**  
  Uses Socket.io for signaling between peers, enabling scalable real-time communication.

- **Future Enhancements:**  
  Planned AI integrations for topic suggestions, conversation moderation, and speaking performance evaluation.

## Tech Stack

- **Frontend:**  
  - Next.js 13 (React, TypeScript, App Router)  
  - Tailwind CSS

- **Authentication:**  
  - NextAuth (with Google Provider and Credentials Provider)  
  - Firebase (for Google OAuth adapter)  
  - bcryptjs for local password hashing

- **Backend & Real-Time Communication:**  
  - Node.js, Express, Socket.io (for signaling in WebRTC)
  - WebRTC for peer-to-peer voice chat

- **Database:**  
  - PostgreSQL (for local user accounts and other structured data)
  - Firebase Firestore (for dynamic data as needed)

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- [PostgreSQL](https://www.postgresql.org/) installed and running
- A Firebase project for authentication (and optionally Firestore)
- A Google Cloud project with OAuth credentials for Google sign-in

### Clone the Repository

```bash
git clone https://github.com/yourusername/gabbers.git
cd gabbers
