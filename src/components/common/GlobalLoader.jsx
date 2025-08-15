import ClipLoader from "react-spinners/ClipLoader";
import { useSelector } from "react-redux";

const GlobalLoader = () => {
  const isLoading = useSelector((state) => state.app.globalLoading); // use global loading from slice

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 bg-white/50 flex justify-center items-center z-[1000]"
      data-testid="global-loader"
    >
      <ClipLoader size={60} color="#3b82f6" data-testid="clip-loader" />
    </div>
  );
};

export default GlobalLoader;