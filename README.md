# DevNest

A cozy space for developers to collaborate.

## Getting Started Locally

To run this project on your local machine, follow these steps:

### Prerequisites

- **Node.js**: Version 18 or higher.
- **npm**: Installed with Node.js.

### Installation

1. **Download the project**: Export the project from Firebase Studio and extract the zip file to your desired folder.
2. **Install dependencies**:
   ```bash
   npm install
   ```

### Configuration

1. **Firebase Config**: The Firebase configuration is already located in `src/firebase/config.ts`.
2. **AI Features (Genkit)**: To use the AI functionality locally, create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
   ```

### Running the App

1. **Start the Next.js dev server**:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:9002](http://localhost:9002).

2. **Start the Genkit UI (Optional)**:
   To test and debug AI flows, run:
   ```bash
   npm run genkit:dev
   ```

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Components**: ShadCN UI
- **Database/Auth**: Firebase (Firestore & Auth)
- **AI**: Genkit with Google Gemini
