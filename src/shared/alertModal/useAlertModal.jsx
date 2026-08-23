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
  const [toasts, setToasts] = useState([]);
  const resolveRef = useRef(null);
  const timerRef = useRef(null);

  const clearAlertTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const dismiss = useCallback((result) => {
    clearAlertTimer();
    setModal(null);
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
  }, [clearAlertTimer]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showAlert = useCallback((message, title = 'Aviso', duration = 4000) => {
    clearAlertTimer();
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      const id = Date.now();
      setModal({ type: 'alert', message, title, id, duration });
      timerRef.current = setTimeout(() => {
        dismiss();
      }, duration);
    });
  }, [clearAlertTimer, dismiss]);

  const showConfirm = useCallback((message, title = 'Confirmar') => {
    clearAlertTimer();
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModal({ type: 'confirm', message, title });
    });
  }, [clearAlertTimer]);

  const showSuccess = useCallback((message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type: 'success', message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const showError = useCallback((message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type: 'error', message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <AlertModalContext.Provider value={{ showAlert, showConfirm, showSuccess, showError }}>
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
                {modal.title && <h3 className="alert-modal-title">{modal.title}</h3>}
                <p className="alert-modal-message">{modal.message}</p>
                <div className="alert-modal-progress" style={{ '--alert-duration': `${modal.duration / 1000}s` }}></div>
                <div className="alert-modal-buttons">
                  <button className="alert-modal-btn alert-modal-btn-primary" onClick={() => dismiss()}>
                    Aceptar
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
                {modal.title && <h3 className="alert-modal-title">{modal.title}</h3>}
                <p className="alert-modal-message">{modal.message}</p>
                <div className="alert-modal-buttons">
                  <button className="alert-modal-btn alert-modal-btn-cancel" onClick={() => dismiss(false)}>
                    Cancelar
                  </button>
                  <button className="alert-modal-btn alert-modal-btn-danger" onClick={() => dismiss(true)}>
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => dismissToast(toast.id)}
          >
            <div className="toast-icon">
              {toast.type === 'success' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={(e) => { e.stopPropagation(); dismissToast(toast.id); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </AlertModalContext.Provider>
  );
};

export const useAlert = () => {
  const { showAlert, showConfirm, showSuccess, showError } = useAlertModal();
  return { showAlert, showConfirm, showSuccess, showError };
};
