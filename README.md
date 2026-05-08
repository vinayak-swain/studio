
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
   The app will be available at [http://localhost:3000](http://localhost:3000).

2. **Start the Genkit UI (Optional)**:
   To test and debug AI flows, run:
   ```bash
   npm run genkit:dev
   ```

## Studio CLI (DVCS)

DevNest comes with a powerful CLI tool for terminal-based version control with AI insights. **Note: All commands must be prefixed with `studio`.**

### Local CLI Setup

1. **Navigate to the CLI directory**:
   ```bash
   cd studio-cli
   ```
2. **Install and Build**:
   ```bash
   npm install
   npm run build
   ```
3. **Link Globally**:
   ```bash
   npm link
   ```
   *Now the `studio` command is available everywhere on your machine.*

### Common Commands (Always prefix with 'studio')

- `studio login`: Authenticate with your DevNest account.
- `studio init`: Initialize a new repository in the current folder.
- `studio status`: See local sync status and tracked files.
- `studio push`: Push all local files to the cloud with AI code analysis.
- `studio pull`: Pull the latest state from the cloud.
- `studio commit "message"`: Create a local commit with AI-generated risk scoring.
- `studio clone <owner/repo>`: Clone a repository from DevNest.

## Technical Architecture

### Data Storage & Persistence
- **Database**: **Firebase Firestore** (NoSQL Cloud Database). All repository metadata, user profiles, and application settings are persisted here.
- **Authentication**: **Firebase Auth**. Handles secure sign-up, login, and session management.
- **Persistence**: Data is stored in the cloud. It survives server restarts and local environment changes.
- **CLI Sync**: The CLI uses token-based authentication to securely push/pull file buffers directly to Firestore.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Components**: ShadCN UI
- **Database/Auth**: Firebase (Firestore & Auth)
- **AI**: Genkit with Google Gemini
- **CLI**: TypeScript, Commander, Chalk, Inquirer
