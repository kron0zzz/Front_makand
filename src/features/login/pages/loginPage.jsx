import "./loginPage.css";
import { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../shared/context/AuthContext";

const API_LOGIN_URL = "http://localhost:3000/api/auth/login";
const API_FORGOT_URL = "http://localhost:3000/api/auth/forgot-password";
const API_VERIFY_URL = "http://localhost:3000/api/auth/verify-code";

function LoginPage({ onLogin }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const [isCodeMode, setIsCodeMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeMessage, setCodeMessage] = useState("");

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

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(API_FORGOT_URL, { email: forgotEmail });
      setForgotMessage(response.data.message || "¡Correo enviado con éxito! Revisa tu bandeja.");
      setIsCodeMode(true);
    } catch (err) {
      console.error("Error en forgot password:", err);
      setError(err.response?.data?.error || "No se pudo enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setCodeMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(API_VERIFY_URL, {
        email: forgotEmail,
        code: verificationCode,
      });

      const { token } = response.data;

      window.location.href = `/reset-password?token=${token}`;
    } catch (err) {
      console.error("Error en verifyCode:", err);
      setError(err.response?.data?.error || "Código incorrecto o expirado.");
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
            <>
              <h2>Iniciar Sesión</h2>
              <form onSubmit={handleSubmit} autoComplete="off">
                {/* Truco para engañar al autocompletado de Opera/Chrome */}
                <input type="text" style={{ display: "none" }} aria-hidden="true" />
                <input type="password" style={{ display: "none" }} aria-hidden="true" />
                <div className="input-group">
                  <label>Correo Electrónico</label>
                  <div className="input-container">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      placeholder="tu-email@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Contraseña</label>
                  <div className="input-container">
                    <Lock size={20} className="input-icon" />
                    <input
                      type="password"
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

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
          ) : !isCodeMode ? (
            <>
              <h2>Recuperar Contraseña</h2>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                Ingresa el <strong>correo electrónico con el que estás registrado como usuario</strong> y te enviaremos un código de verificación.
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
                  {loading ? "Enviando..." : "Enviar Código"}
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
          ) : (
            <>
              <h2>Verificar Código</h2>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                Ingresá el código de 6 dígitos que enviamos a <strong>{forgotEmail}</strong>.
              </p>

              <form onSubmit={handleVerifyCode}>
                <div className="input-group">
                  <label>Código de Verificación</label>
                  <div className="input-container">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="text"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      required
                      style={{ letterSpacing: "4px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}
                    />
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {codeMessage && <div style={{ color: "green", fontSize: "13px", marginBottom: "10px" }}>{codeMessage}</div>}

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Verificando..." : "Verificar Código"}
                </button>

                <div style={{ textAlign: "center", marginTop: "15px" }}>
                  <button
                    type="button"
                    onClick={() => { setIsCodeMode(false); setError(""); setVerificationCode(""); }}
                    style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                  >
                    <ArrowLeft size={16} /> Volver atrás
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