import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Hash, Lock, Unlock, Calendar, Store } from "lucide-react";
import "./MotorizedStockEditor.css";

const MotorizedStockEditor = ({ quantity, machineryName, existingSerials = [], onTeamsChange, onQuantityChange }) => {
  const [autoSerial, setAutoSerial] = useState(true);
  const [teams, setTeams] = useState([]);
  const prevQuantityRef = useRef(undefined);

  const prefix = useMemo(() => {
    const match = existingSerials.find((s) => /^[A-Z]+-\d+$/i.test(s));
    if (match) {
      return match.split("-")[0].toUpperCase();
    }
    return machineryName
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 3)
      .toUpperCase();
  }, [existingSerials, machineryName]);

  const nextSerialNumber = useMemo(() => {
    if (existingSerials.length === 0) return 1;
    const numbers = existingSerials
      .map((s) => {
        const match = s.match(/-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => n > 0);
    if (numbers.length === 0) return 1;
    return Math.max(...numbers) + 1;
  }, [existingSerials]);

  const generateAutoSerials = useCallback(
    (count, startNum) => {
      const result = [];
      for (let i = 0; i < count; i++) {
        const num = startNum + i;
        const padded = String(num).padStart(3, "0");
        result.push(`${prefix}-${padded}`);
      }
      return result;
    },
    [prefix]
  );

  useEffect(() => {
    const qty = Math.max(0, Number(quantity) || 0);
    const prevQty = prevQuantityRef.current;

    if (prevQty === qty) {
      prevQuantityRef.current = qty;
      return;
    }

    if (qty === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTeams([]);
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
        const startNum = nextSerialNumber + currentCount;
        const newSerials = autoSerial
          ? generateAutoSerials(additional, startNum)
          : new Array(additional).fill("");

        for (let i = 0; i < additional; i++) {
          newTeams.push({
            serial: newSerials[i] || "",
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
  }, [quantity, autoSerial, nextSerialNumber, generateAutoSerials, onTeamsChange]);

  useEffect(() => {
    if (onTeamsChange) onTeamsChange(teams);
  }, [teams, onTeamsChange]);

  const updateTeam = (index, field, value) => {
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], [field]: value };
    setTeams(newTeams);
  };

  return (
    <div className="motorized-stock-editor">
      <div className="motorized-stock-editor-header">
        <h3>Equipos a Registrar</h3>
        <div className="motorized-serial-toggle">
          <span className="toggle-label">
            {autoSerial ? <Lock size={14} /> : <Unlock size={14} />}
            {autoSerial ? " Automático" : " Manual"}
          </span>
          <button
            type="button"
            className={`toggle-switch ${autoSerial ? "active" : ""}`}
            onClick={() => setAutoSerial(!autoSerial)}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      <div className="motorized-quantity-input">
        <label className="form-label">Cantidad de equipos</label>
        <input
          type="number"
          min="1"
          max="100"
          className="form-input"
          value={quantity || ""}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            if (onQuantityChange) onQuantityChange(val);
          }}
          placeholder="Ej: 5"
        />
      </div>

      {quantity > 0 && (
        <div className="motorized-stock-cards">
          {teams.map((team, index) => (
            <div key={index} className="team-card">
              <div className="team-card-header">
                <span className="team-card-number">Equipo {index + 1}</span>
                {autoSerial && team.serial && (
                  <span className="team-card-auto-badge">Auto</span>
                )}
              </div>
              <div className="team-card-fields">
                <div className="team-field">
                  <label>Serial</label>
                  <div className="serial-input-wrapper">
                    <Hash size={14} />
                    <input
                      type="text"
                      value={team.serial}
                      onChange={(e) => updateTeam(index, "serial", e.target.value)}
                      disabled={autoSerial}
                      placeholder={autoSerial ? "Generado automáticamente" : "Ej: TAL-001"}
                    />
                  </div>
                </div>
                <div className="team-field">
                  <label>¿Propio?</label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={team.is_owned}
                      onChange={(e) => updateTeam(index, "is_owned", e.target.checked)}
                    />
                    <Store size={14} />
                  </label>
                </div>
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