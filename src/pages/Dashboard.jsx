/**
 * Dashboard Page
 * -----------------
 * File: Dashboard.jsx
 * Purpose: Serves as the landing page for authenticated users after login.
 * 
 * Features:
 *  - Displays a welcome message for the logged-in user
 *  - Confirms successful login with a celebratory subtitle
 *  - Responsive, centered layout with Tailwind CSS styling
 *  - Uses data-testid attributes for unit testing
 */

const Dashboard = () => {
  return (
    // Wrapper with full-screen height, centered content, and light green background
    <div data-testid="dashboard-page" className="min-h-screen flex items-center justify-center bg-green-50">
      
      {/* Main content container with centered text */}
      <div className="text-center">
        
        {/* Page title with bold green text */}
        <h1 data-testid="dashboard-title" className="text-4xl font-bold text-green-700 mb-4">
          Welcome to the Dashboard
        </h1>

        {/* Subtitle confirming successful login */}
        <p data-testid="dashboard-subtitle" className="text-lg text-green-600">
          You're successfully logged in 🎉
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
