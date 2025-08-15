import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Hide BackButton on homepage and login page
  const isHidden = pathname === "/" || pathname === "/login";

  return (
    <div
      className={`${isHidden ? "hidden" : "flex justify-start"}`}
      data-testid="back-button-wrapper"
    >
      <div className="p-4">
        <div className="sticky top-0 z-30 inline-block shadow-sm">
          <button
            data-testid="back-button"
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackButton;