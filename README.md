# Self-Service Kiosk Check-in System (Pastel Minimal Theme)

A UI prototype for self-service kiosk check-in using React 18, TypeScript, Zustand, and React Router DOM v6 with beautiful pastel minimal design.

## Features

- **Pastel Design**: Soft gradient backgrounds and gentle color palette
- **Streamlined Check-In**: Direct check-in from welcome page using National ID or Phone
- **Registration Flow**: New appointment booking with elegant form design
- **Queue Management**: Beautiful ticket printing interface with pastel styling
- **Mock API**: Uses static JSON responses for rapid prototyping

## Design Highlights

- **Background**: Soft gradient `linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)`
- **Buttons**: Pastel gradients like `linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)`
- **Typography**: Gentle colors (#3c3c3c for main text, #7b7b7b for secondary)
- **Shadows**: Subtle `0 6px 20px rgba(0,0,0,0.06)` for depth
- **Form Elements**: Inset shadows and 14px border-radius
- **Accent Color**: Mint green (#7bb8a8) for links and highlights
- **Visual Hierarchy**: Enhanced with pastel gradients throughout

## Color Palette

```css
Primary Background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)
Card Background: white with subtle shadow
Primary Button: linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)
Secondary Button: linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)
Success Elements: linear-gradient(90deg, #a8edea 0%, #d5f4e6 100%)
Text Primary: #3c3c3c
Text Secondary: #7b7b7b
Accent Links: #7bb8a8
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── WelcomePage.tsx         # Combined welcome + check-in
│   │   ├── RegisterPage.tsx        # User registration form
│   │   ├── AppointmentPage.tsx     # Date/time selection
│   │   ├── ConfirmationPage.tsx    # Appointment details
│   │   └── PrintPage.tsx           # Queue ticket printing
│   ├── App.css                     # Pastel-themed global styles
│   └── ...
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the displayed URL

### Building for Production

```bash
npm run build
```

### Docker Deployment

```bash
docker build -t self-service-kiosk .
docker run -p 80:80 self-service-kiosk
```

## UI Flow

1. **Welcome Screen**: 
   - Soft gradient background
   - Input field with inset shadow for National ID/Phone Number
   - Pastel gradient "Check-in" button
   - Mint green link to registration

2. **Registration**: Form with pastel-styled inputs for personal details
3. **Appointment Selection**: Interactive date/time picker with soft gradients
4. **Confirmation**: Clean display with pastel info cards
5. **Print Queue**: Elegant ticket design with gradient styling

## Demo Data

For testing purposes, use:
- National ID: `1234567890123` (for check-in)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **Build Tool**: Vite
- **Styling**: Pastel-themed CSS3 with responsive design
- **Container**: Docker with nginx

## Pastel Design Elements

- **Soft Gradients**: Multiple gradient combinations for visual interest
- **Gentle Shadows**: Subtle depth without harsh contrasts
- **Rounded Corners**: 14px for inputs/buttons, 16-24px for cards
- **Color Harmony**: Coordinated pastel palette throughout
- **Smooth Transitions**: 0.2s ease animations
- **Typography Balance**: 600 weight titles, 500 weight secondary text
- **Touch-Friendly**: Optimized for kiosk and tablet interfaces

## Development Notes

- All API calls are mocked with realistic delays
- Responsive design optimized for various screen sizes
- Error and success messages with themed styling
- TypeScript for enhanced developer experience
- Build optimization: ~6KB CSS, ~178KB JS
