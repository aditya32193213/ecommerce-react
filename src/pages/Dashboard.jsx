// pages/Dashboard.jsx
const Dashboard = () => {
  return (
    <div data-testid="dashboard-page" className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 data-testid="dashboard-title" className="text-4xl font-bold text-green-700 mb-4">
          Welcome to the Dashboard
        </h1>
        <p data-testid="dashboard-subtitle" className="text-lg text-green-600">
          You're successfully logged in 🎉
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
