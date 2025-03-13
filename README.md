# Virtual Study Room V1

## Overview
This project is a **Analysis App** that helps users track their study sessions, visualize trends, and make data-driven decisions.

## Tech Stack
- **Frontend**: React (Next.js) with Tailwind CSS
- **Backend**: Firebase Firestore for real-time database
- **Charts**: Recharts for data visualization

## Features
- Track total study time, completed goals, and average session duration
- Visualize study trends with interactive charts
- Video and audio call functionality
- Responsive UI with a modern design

## Folder Structure
- **`src/app`** - Contains Next.js pages (e.g., `analysis`, `video-call`)
- **`src/components`** - Reusable UI components (e.g., `button`, `chart`)
- **`src/config`** - Firebase configuration

## Setup Instructions
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run Server on Port 5000
   ```sh
   node server.js
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Add your Firebase config in `src/config/firebase.js`.

## Deployment
To deploy the Next.js app:
```sh
npm run build && npm run start
```

