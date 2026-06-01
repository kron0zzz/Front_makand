import "./loginPage.css";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";

import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/login";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        email,
        password,
      });

      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      onLogin();

    } catch (err) {
      console.error(err);

      setError(
        "Correo o contraseña incorrectos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        <div className="login-brand">
          <h1>MakandSMR</h1>

          <p>
            Sistema de Gestión de Alquiler
          </p>
        </div>

        <div className="login-card">
          <h2>Iniciar Sesión</h2>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>
                Correo Electrónico
              </label>

              <div className="input-container">
                <Mail
                  size={20}
                  className="input-icon"
                />

                <input
                  type="email"
                  placeholder="tu-email@makandsmr.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>
                Contraseña
              </label>

              <div className="input-container">
                <Lock
                  size={20}
                  className="input-icon"
                />

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Ingresando..."
                : "Iniciar Sesión"}
            </button>

            <button
              type="button"
              className="forgot-password"
            >
              ¿Olvidaste tu contraseña?
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;