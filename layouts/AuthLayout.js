import PropTypes from "prop-types";

export default function AuthLayout({ children }) {
  return (
    <main className="auth-layout">
      <div className="auth-content">
        <div className="auth-sections">
          <div className="auth-background" />
          <div className="auth-main-content">
            <div className="auth-inner">
              {children}
              <div className="auth-bottom">
                <a href="#" target="_blank">
                  Termeni și Condiții
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};
