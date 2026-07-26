import { createContext, useContext, useState, useCallback, useRef } from 'react';

const AlertModalContext = createContext(null);

export const useAlertModal = () => {
  const context = useContext(AlertModalContext);
  if (!context) {
    throw new Error('useAlertModal must be used within an AlertModalProvider');
  }
  return context;
};

export const AlertModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);
  const resolveRef = useRef(null);

  const showAlert = useCallback((message) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModal({ type: 'alert', message });
    });
  }, []);

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModal({ type: 'confirm', message });
    });
  }, []);

  const dismiss = useCallback((result) => {
    setModal(null);
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
  }, []);

  return (
    <AlertModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {modal && (
        <div className="alert-modal-overlay" onClick={() => dismiss(modal.type === 'confirm' ? false : undefined)}>
          <div className="alert-modal-container" onClick={(e) => e.stopPropagation()}>
            {modal.type === 'alert' && (
              <>
                <div className="alert-modal-icon alert-modal-icon-warning">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <p className="alert-modal-message">{modal.message}</p>
                <div className="alert-modal-buttons">
                  <button className="alert-modal-btn alert-modal-btn-primary" onClick={() => dismiss()}>
                    Continuar
                  </button>
                </div>
              </>
            )}
            {modal.type === 'confirm' && (
              <>
                <div className="alert-modal-icon alert-modal-icon-danger">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <p className="alert-modal-message">{modal.message}</p>
                <div className="alert-modal-buttons">
                  <button className="alert-modal-btn alert-modal-btn-cancel" onClick={() => dismiss(false)}>
                    Cancelar
                  </button>
                  <button className="alert-modal-btn alert-modal-btn-danger" onClick={() => dismiss(true)}>
                    Aceptar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AlertModalContext.Provider>
  );
};
