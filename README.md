## TTB Alcohol Label Verification App

This is a full-stack web application designed to simulate the Alcohol and Tobacco Tax and Trade Bureau (TTB) label approval process. It uses AI (Google Cloud Vision API) to verify that an alcohol label image contains the required data submitted by the user in the application form.

✨ Project Status

The application is functional, deployed live, and meets all core requirements of the assessment, demonstrating a robust and secure full-stack architecture.

🔗 Live Deployed Links

Live Application URL (Frontend - Vercel/Netlify): https://ttb-ui.vercel.app/

Backend API URL (Render): https://ttb-fhe1.onrender.com

## Technology Stack
Component	Technology	Rationale
Frontend (UI)	Angular 17+	Robust structure and component-based UI development.
Backend (API)	Node.js with Express	Fast server environment, ideal for file uploads and API calls.
AI Processing	Google Cloud Vision API	High accuracy on complex label typography for reliable verification.
Deployment	Vercel (Frontend) & Render (Backend)	Secure and optimized hosting for static and server environments.
💻 Local Setup and Installation

This project is split into two repositories: Backend API and Angular Frontend.

1. Backend Setup (Node.js/Express)

Clone the Backend repository:
https://github.com/shangyi111/ttb-backend

Install dependencies:

npm install


Create a .env file and add your Google Credentials JSON in one line:

GOOGLE_CREDENTIALS_JSON={"type":"service_account", "project_id":"...", ...}


Start the Backend API (runs at http://localhost:3000):

node server.js

2. Frontend Setup (Angular)

Navigate to the Angular repository (https://github.com/shangyi111/ttb-ui).

Install dependencies:

npm install


Configure local API endpoint:
src/environments/environment.ts

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};


Run the Angular UI (runs at http://localhost:4200):

ng serve

## Verification Approach and Assumptions

The verification logic (in performVerification inside server.js) follows strong normalization and accuracy rules.

Matching Assumptions

Normalization: Lowercasing, whitespace cleanup, punctuation stripping.

Case-insensitive comparisons

ABV Matching: Regular expression extracting numeric + unit patterns (e.g., 45% Alc./Vol.)

Verification Checks
Field	            Requirement	         Logic

Brand Name	        Mandatory	         Normalized string match
Product Class/Type	Mandatory	         Normalized string match
Alcohol Content (ABV)	Mandatory	     Regex-based numeric + unit search
Government Warning	Mandatory (Bonus)	 Looks for "government warning"
Net Contents	    Optional (Bonus)	 Searches volume + unit (e.g., 750ml)

## Bonus Features and Polish

Detailed Results Table: Clear green/red match table comparing expected vs found values.

Loading Indicator: Disables button and shows message during backend verification.

Unit Testing: ui: Run tests using ng test. Backend: Run tests using node --test verification.test.js.

Secure Credential Handling: Google Vision credentials loaded only from backend environment variables.

Graceful Error Handling: UI displays backend-originated errors like OCR failures.

## Known Limitations
Image Quality Dependent: Accuracy relies heavily on clear, high-resolution images.

No Punctuation Check: Government Warning only verifies phrase presence, not exact mandated text.

No Contextual Check: Risk of false matches if similar text appears elsewhere on the label.

Sync Processing: Backend is synchronous; may time out under high load.