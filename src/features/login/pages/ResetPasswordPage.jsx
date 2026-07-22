import "./loginPage.css";
import { useState } from "react";
import { Lock } from "lucide-react";
import axios from "axios";

const API_RESET_URL = "http://localhost:3000/api/auth/reset-password";

function ResetPasswordPage() {
  // Obtenemos el token automáticamente de los parámetros de la URL (ej: ?token=xyz)
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      return setError("Las contraseñas no coinciden.");
    }

    if (!token) {
      return setError("El enlace de recuperación es inválido o falta el token.");
    }

    setLoading(true);

    try {
      const response = await axios.post(API_RESET_URL, {
        token,
        newPassword,
      });

      setSuccessMessage(response.data.message || "¡Contraseña actualizada con éxito!");
      
      // Opcional: Redirigir al login después de unos segundos
      setTimeout(() => {
        window.location.href = "/"; // O la ruta donde tengas tu login
      }, 3000);

    } catch (err) {
      console.error("Error al restablecer contraseña:", err);
      setError(err.response?.data?.error || "El enlace ha expirado o es inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-brand">
          <h1>MakandSMR</h1>
          <p>Sistema de Gestión de Alquiler</p>
        </div>

        <div className="login-card">
          <h2>Nueva Contraseña</h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
            Ingresa tu nueva contraseña para actualizar el acceso a tu cuenta.
          </p>

          <form onSubmit={handleResetSubmit}>
            <div className="input-group">
              <label>Nueva Contraseña</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Confirmar Contraseña</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div style={{ color: "green", fontSize: "13px", marginBottom: "10px" }}>{successMessage}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={loading || successMessage}
            >
              {loading ? "Actualizando..." : "Restablecer Contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;