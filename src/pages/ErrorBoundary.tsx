import type { FC } from "react";
import { FaCoffee } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const ErrorBoundary: FC = () => {
  const navigate = useNavigate();

  return (
    <main>
      <div className="fullscreen">
        <div className="placeholder u-overlay">
          <div className="u-center-alt">
            <div className="placeholder-icon">
              <span className="icon">
                <FaCoffee size="50" />
              </span>
            </div>

            <h6 className="placeholder-title">Oops!</h6>

            <div className="placeholder-subtitle">
              <p>Sorry, an unexpected error has occurred.</p>
            </div>

            <div className="placeholder-commands u-center">
              <div className="m-1" onClick={() => window.location.reload()}>
                <button className="btn-primary">Refresh</button>
              </div>
              <div className="m-1" onClick={() => navigate("/")}>
                <button className="btn-primary">Home</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ErrorBoundary;
