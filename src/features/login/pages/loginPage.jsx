import "./loginPage.css";
import { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../shared/context/AuthContext"; 

const API_LOGIN_URL = "http://localhost:3000/api/auth/login";
const API_FORGOT_URL = "http://localhost:3000/api/auth/forgot-password";

function LoginPage({ onLogin }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Estados para el flujo de recuperación de contraseña
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(API_LOGIN_URL, {
        email,
        password,
      });

      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(user); 
      onLogin(); 
      
    } catch (err) {
      console.error("Error en login:", err);
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  // Manejar el envío de la solicitud de recuperación
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(API_FORGOT_URL, { email: forgotEmail });
      setForgotMessage(response.data.message || "¡Correo enviado con éxito! Revisa tu bandeja.");
    } catch (err) {
      console.error("Error en forgot password:", err);
      setError(err.response?.data?.error || "No se pudo enviar el correo.");
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
          {!isForgotMode ? (
            /* --- VISTA NORMAL DE LOGIN --- */
            <>
              <h2>Iniciar Sesión</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Correo Electrónico</label>
                  <div className="input-container">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      placeholder="tu-email@makandsmr.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Contraseña</label>
                  <div className="input-container">
                    <Lock size={20} className="input-icon" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Enlace para cambiar a modo recuperación */}
                <div style={{ textAlign: "right", marginBottom: "15px" }}>
                  <button
                    type="button"
                    onClick={() => { setIsForgotMode(true); setError(""); }}
                    style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer", fontSize: "13px", padding: 0 }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Ingresando..." : "Iniciar Sesión"}
                </button>
              </form>
            </>
          ) : (
            /* --- VISTA DE SOLICITAR RECUPERACIÓN --- */
            <>
              <h2>Recuperar Contraseña</h2>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                Ingresa el <strong>correo electrónico con el que estás registrado como usuario</strong> y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              
              <form onSubmit={handleForgotSubmit}>
                <div className="input-group">
                  <label>Correo Electrónico</label>
                  <div className="input-container">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      placeholder="tu-email@makandsmr.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {forgotMessage && <div style={{ color: "green", fontSize: "13px", marginBottom: "10px" }}>{forgotMessage}</div>}

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar Correo"}
                </button>

                <div style={{ textAlign: "center", marginTop: "15px" }}>
                  <button
                    type="button"
                    onClick={() => { setIsForgotMode(false); setError(""); setForgotMessage(""); }}
                    style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                  >
                    <ArrowLeft size={16} /> Volver al Login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;