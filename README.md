# Smart Park Companion

Smart Park Companion is a modern web application designed to streamline parking management for both facility owners and drivers. It provides an intuitive interface for booking spots, managing parking data, and viewing analytics.

## Features

### For Drivers
- **Find Parking**: Located nearby parking spots easily.
- **Book Spots**: Reserve parking spaces in advance.
- **Manage Bookings**: View and manage active and past bookings.
- **Profile Management**: Update user details and preferences.

### For Owners
- **Dashboard**: Get a bird's-eye view of your parking facility's performance.
- **Camera Setup**: Configure LPR (License Plate Recognition) cameras (Simulation).
- **Data Management**: Monitor occupancy and parking data.
- **Analytics**: Visualize revenue and usage trends.

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: React Query, Context API
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd smart-park-companion
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit `http://localhost:8080` in your browser.

## Project Structure

- `src/pages/user`: Components and pages for the driver interface.
- `src/pages/owner`: Components and pages for the owner dashboard.
- `src/components`: Reusable UI components.
- `src/contexts`: Global state providers (Auth, Theme).
