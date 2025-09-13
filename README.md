# Krishi Shakhi - AI-Powered Farming Assistant

## Overview
Krishi Shakhi is an AI-powered farming assistant web application that helps farmers with crop management, disease detection, weather monitoring, and community support.

## Features
- **Dashboard**: Overview of crops, weather, and farming activities
- **Crop Management**: Track and manage crops throughout their lifecycle
- **Disease Detection**: AI-powered plant disease detection using image upload
- **Weather Monitoring**: Real-time weather data and farming recommendations
- **Expert Tips**: Professional farming advice and best practices
- **Community**: Connect with fellow farmers and share knowledge

## Recent Fixes Applied

### 1. Entity System
- Created missing entity classes (`Crop.js`, `CommunityPost.js`, `DiseaseDetection.js`, `ExpertTip.js`, `User.js`)
- Added `all.js` export file for entity imports
- Implemented mock data for development/testing

### 2. Core Integration
- Enhanced `Core.js` with `InvokeLLM` and `UploadFile` functions
- Added mock implementations for AI services and file uploads
- Implemented proper error handling

### 3. UI Components
- Created missing UI components (`Input`, `Textarea`, `Badge`, `Label`, `Progress`, `Alert`, `Select`, `Tabs`)
- Added `CardTitle` component to the card module
- Implemented proper component styling with Tailwind CSS

### 4. Configuration
- Added `jsconfig.json` for path aliasing (`@/` imports)
- Fixed `package.json` dependencies and removed conflicting packages
- Updated Tailwind configuration

### 5. Bug Fixes
- Fixed import paths throughout the application
- Corrected React ref attributes in `DiseaseDetection.js`
- Added missing icon imports (`AlertTriangle`, `Sprout`)
- Created placeholder image files for sample data

## Getting Started

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── dashboard/    # Dashboard-specific components
│   ├── tasks/        # Task management components
│   └── upload/       # File upload components
├── entities/         # Data models and API interactions
├── integrations/     # External service integrations
├── pages/           # Main application pages
├── styles/          # CSS and styling
└── utils/           # Utility functions
```

## Mock Data
The application currently uses mock data for development. In production, this would be replaced with:
- Real AI services for disease detection
- Weather API integration
- Database connectivity
- File storage services

## Technologies Used
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- Date-fns (date utilities)
- Mock services for development