// // import "./loginPage.css";
// // import { useState } from "react";
// // import { Mail, Lock } from "lucide-react";
// // import axios from "axios";
// // // Contexto para gestionar la sesión y permisos del usuario
// // import { useAuth } from "../../../shared/context/AuthContext"; 

// // const API_URL = "http://localhost:3000/api/auth/login";

// // function LoginPage({ onLogin }) {
// //   const { login } = useAuth();
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setLoading(true);

// //     try {
// //       const response = await axios.post(API_URL, {
// //         email,
// //         password,
// //       });

// //       const { token, user } = response.data;
// //       console.log("Datos del usuario recibidos:", user); // <--- AGREGA ESTO
      
// //       localStorage.setItem("token", token);
// //       localStorage.setItem("user", JSON.stringify({
// //         name: user.user_email, // El correo electrónico
// //         role: user.role_name   // El nombre real que viene de la BD (ej: "Asesor")
// //       }));
// //       login(user); 

// //       onLogin(); 
// //     } catch (err) {
// //       console.error(err);
// //       setError("Correo o contraseña incorrectos.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="login-page">
// //       <div className="login-wrapper">
// //         <div className="login-brand">
// //           <h1>MakandSMR</h1>
// //           <p>Sistema de Gestión de Alquiler</p>
// //         </div>

// //         <div className="login-card">
// //           <h2>Iniciar Sesión</h2>
// //           <form onSubmit={handleSubmit}>
// //             <div className="input-group">
// //               <label>Correo Electrónico</label>
// //               <div className="input-container">
// //                 <Mail size={20} className="input-icon" />
// //                 <input
// //                   type="email"
// //                   placeholder="tu-email@makandsmr.com"
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   required
// //                 />
// //               </div>
// //             </div>

// //             <div className="input-group">
// //               <label>Contraseña</label>
// //               <div className="input-container">
// //                 <Lock size={20} className="input-icon" />
// //                 <input
// //                   type="password"
// //                   placeholder="••••••••"
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   required
// //                 />
// //               </div>
// //             </div>

// //             {error && <div className="error-message">{error}</div>}

// //             <button
// //               type="submit"
// //               className="login-button"
// //               disabled={loading}
// //             >
// //               {loading ? "Ingresando..." : "Iniciar Sesión"}
// //             </button>

// //             <button type="button" className="forgot-password">
// //               ¿Olvidaste tu contraseña?
// //             </button>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default LoginPage;


// import "./loginPage.css";
// import { useState } from "react";
// import { Mail, Lock } from "lucide-react";
// import axios from "axios";
// // Contexto para gestionar la sesión y permisos del usuario
// import { useAuth } from "../../../shared/context/AuthContext"; 

// const API_URL = "http://localhost:3000/api/auth/login";

// function LoginPage({ onLogin }) {
//   const { login } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await axios.post(API_URL, {
//         email,
//         password,
//       });

//       const { token, user } = response.data;
      
//       // Mapeo de IDs de rol a nombres legibles
//       // Ajusta los números (1, 2) según lo que tengas en tu base de datos
//       const roleMapping = {
//         1: "Administrador",
//         2: "Asesor"
//       };

//       localStorage.setItem("token", token);
      
//       // Guardamos el usuario con el nombre y el rol traducido
//       localStorage.setItem("user", JSON.stringify({
//         name: user.user_email,
//         role: roleMapping[user.role_id] || "Usuario"
//       }));

//       // Guardamos el usuario en el contexto global
//       login(user); 

//       onLogin(); 
//     } catch (err) {
//       console.error(err);
//       setError("Correo o contraseña incorrectos.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-wrapper">
//         <div className="login-brand">
//           <h1>MakandSMR</h1>
//           <p>Sistema de Gestión de Alquiler</p>
//         </div>

//         <div className="login-card">
//           <h2>Iniciar Sesión</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <label>Correo Electrónico</label>
//               <div className="input-container">
//                 <Mail size={20} className="input-icon" />
//                 <input
//                   type="email"
//                   placeholder="tu-email@makandsmr.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="input-group">
//               <label>Contraseña</label>
//               <div className="input-container">
//                 <Lock size={20} className="input-icon" />
//                 <input
//                   type="password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             {error && <div className="error-message">{error}</div>}

//             <button
//               type="submit"
//               className="login-button"
//               disabled={loading}
//             >
//               {loading ? "Ingresando..." : "Iniciar Sesión"}
//             </button>

//             <button type="button" className="forgot-password">
//               ¿Olvidaste tu contraseña?
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;


import "./loginPage.css";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../shared/context/AuthContext"; 

const API_URL = "http://localhost:3000/api/auth/login";

function LoginPage({ onLogin }) {
  const { login } = useAuth();
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

      const { token, user } = response.data;
      
      // Mapeo para traducir el ID de rol a texto legible
      const roleMapping = {
        1: "Administrador",
        2: "Asesor"
      };

      // 1. Guardamos el token para futuras peticiones
      localStorage.setItem("token", token);
      
      // 2. Guardamos el objeto user formateado en localStorage
      const userData = {
        name: user.user_email,
        role: roleMapping[user.role_id] || "Usuario"
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // 3. Actualizamos el contexto y notificamos al componente padre (App.jsx)
      login(user); 
      onLogin(); 
      
    } catch (err) {
      console.error("Error en login:", err);
      setError("Correo o contraseña incorrectos.");
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

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>

            <button type="button" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;