
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize empty local storage for mock data persistence if needed
    if (!localStorage.getItem('mock_mmp_files')) {
      localStorage.setItem('mock_mmp_files', JSON.stringify([]));
    }
    
    // Redirect to auth page immediately
    navigate("/auth");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PACT Workflow Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Advanced MMP Management System
        </p>
        <div className="flex flex-col items-center justify-center">
          <Button 
            className="mb-4 px-6 py-2 font-medium"
            onClick={() => navigate("/auth")}
          >
            Continue to Login
          </Button>
          <div className="animate-pulse text-sm text-gray-500 dark:text-gray-400">
            Redirecting to authentication page...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
