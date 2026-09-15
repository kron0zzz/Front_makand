import { useState, useEffect, useRef } from "react";
import { Hash, Calendar, AlertCircle } from "lucide-react";
import "./MotorizedStockEditor.css";

const MotorizedStockEditor = ({ 
  quantity, 
  machineryId, 
  onTeamsChange, 
  onQuantityChange,
  onSubmitValidation
}) => {
  const [teams, setTeams] = useState([]);
  const [serialErrors, setSerialErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const prevQuantityRef = useRef(undefined);

  useEffect(() => {
    const qty = Math.max(0, Number(quantity) || 0);
    const prevQty = prevQuantityRef.current;

    if (prevQty === qty) {
      prevQuantityRef.current = qty;
      return;
    }

    if (qty === 0) {
      setTeams([]);
      setSerialErrors({});
      if (onTeamsChange) onTeamsChange([]);
      prevQuantityRef.current = qty;
      return;
    }

    setTeams((prev) => {
      const currentCount = prev.length;
      if (currentCount === qty) return prev;

      const newTeams = [...prev];

      if (qty > currentCount) {
        const additional = qty - currentCount;
        for (let i = 0; i < additional; i++) {
          newTeams.push({
            serial: "",
            is_owned: true,
            next_revision_date: "",
          });
        }
      } else {
        newTeams.splice(qty);
      }

      return newTeams;
    });

    prevQuantityRef.current = qty;
  }, [quantity, onTeamsChange]);

  useEffect(() => {
    if (onTeamsChange) onTeamsChange(teams);
  }, [teams, onTeamsChange]);

  const updateTeam = (index, field, value) => {
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], [field]: value };
    setTeams(newTeams);
    
    // Clear error for this serial when user types
    if (field === "serial") {
      setSerialErrors(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  // Validation function to check for duplicate serials
  const validateSerials = async () => {
    const serials = teams
      .map((team, idx) => ({ serial: (team.serial || "").trim(), index: idx }))
      .filter(({ serial }) => serial.length > 0);

    if (serials.length === 0) return { valid: true, errors: {} };

    // Check for duplicates within the form
    const seen = new Set();
    const duplicateIndices = new Set();
    serials.forEach(({ serial, index }) => {
      if (seen.has(serial)) {
        duplicateIndices.add(index);
      } else {
        seen.add(serial);
      }
    });

    // Check against backend for existing serials (GLOBAL - across all machinery)
    setIsValidating(true);
    try {
      const token = localStorage.getItem("token");
      const serialList = serials.map(s => s.serial).join(",");
      // Always use global check to validate against ALL machinery
      const url = `https://api-makand.onrender.com/api/stock/check-serials-global?serials=${encodeURIComponent(serialList)}`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const existingErrors = {};
        data.existingSerials?.forEach(({ serial }) => {
          const teamIdx = serials.findIndex(s => s.serial === serial);
          if (teamIdx >= 0) {
            existingErrors[serials[teamIdx].index] = `El serial "${serial}" ya está registrado en otra maquinaria`;
          }
        });
        
        const errors = { ...existingErrors };
        duplicateIndices.forEach(idx => {
          errors[serials[idx].index] = `Serial duplicado en el formulario: "${serials[idx].serial}"`;
        });
        
        setSerialErrors(errors);
        return { valid: Object.keys(errors).length === 0, errors };
      }
    } catch (err) {
      console.error("Error validating serials:", err);
    } finally {
      setIsValidating(false);
    }
    return { valid: Object.keys(serialErrors).length === 0, errors: serialErrors };
  };

  // Call validation when teams change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (teams.length > 0) validateSerials();
    }, 300);
    return () => clearTimeout(timer);
  }, [teams]);

  // Notify parent of validation state
  useEffect(() => {
    if (onSubmitValidation) {
      onSubmitValidation({ 
        isValid: Object.keys(serialErrors).length === 0 && !isValidating,
        isValidating,
        errors: serialErrors
      });
    }
  }, [serialErrors, isValidating, onSubmitValidation]);

  return (
    <div className="motorized-stock-editor">
      <div className="motorized-stock-editor-header">
        <h3>Equipos a Registrar</h3>
      </div>

      <div className="motorized-quantity-input">
        <label className="form-label">Cantidad de equipos</label>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="number"
            min="1"
            max="100"
            className="form-input"
            style={{ flex: 1, minWidth: "120px" }}
            value={quantity || ""}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              if (onQuantityChange) onQuantityChange(val);
            }}
            placeholder="Ej: 5"
          />
          {isValidating && (
            <span className="serial-hint validating">Validando seriales...</span>
          )}
          {Object.keys(serialErrors).length > 0 && !isValidating && (
            <span className="serial-hint error">
              <AlertCircle size={14} />
              {Object.values(serialErrors).join("; ")}
            </span>
          )}
          {Object.keys(serialErrors).length === 0 && !isValidating && teams.length > 0 && (
            <span className="serial-hint success">
              Todos los seriales son válidos
            </span>
          )}
        </div>
      </div>

      {quantity > 0 && (
        <div className="motorized-stock-cards">
          {teams.map((team, index) => (
            <div key={index} className="team-card">
              <div className="team-card-header">
                <span className="team-card-number">Equipo {index + 1}</span>
                {serialErrors[index] && (
                  <span className="team-card-error-badge">Error</span>
                )}
              </div>
              <div className="team-card-fields">
                <div className="team-field">
                  <label>Serial (máx. 6 dígitos)</label>
                  <div className="serial-input-wrapper">
                    <Hash size={14} />
                    <input
                      type="text"
                      value={team.serial}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                        updateTeam(index, "serial", numericValue);
                      }}
                      placeholder="Ej: 100001"
                      maxLength={6}
                      className={serialErrors[index] ? "input-error" : ""}
                    />
                    {serialErrors[index] && (
                      <span className="serial-error-msg">{serialErrors[index]}</span>
                    )}
                  </div>
                </div>
                {/* ¿Propio? field removed - automatically set to true for motorized machinery */}
                <div className="team-field">
                  <label>Próx. Revisión</label>
                  <div className="date-input-wrapper">
                    <Calendar size={14} />
                    <input
                      type="date"
                      value={team.next_revision_date}
                      onChange={(e) => updateTeam(index, "next_revision_date", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {quantity === 0 && (
        <div className="motorized-empty-state">
          <p>Ingresa la cantidad de equipos para generar las tarjetas de registro.</p>
        </div>
      )}

      {teams.length > 0 && (
        <div className="motorized-stock-summary">
          {teams.length} equipo{teams.length !== 1 ? "s" : ""} registrado{teams.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default MotorizedStockEditor;