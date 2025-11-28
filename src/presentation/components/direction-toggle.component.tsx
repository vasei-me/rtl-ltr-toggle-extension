import React from "react";
import { DirectionEntity } from "../../core/entities/direction.entity";

interface Props {
  config: DirectionEntity;
  onToggle: (configId: string) => void;
  onToggleEnabled: (configId: string) => void;
}

export const DirectionToggle: React.FC<Props> = ({
  config,
  onToggle,
  onToggleEnabled,
}) => {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        margin: "10px 0",
        backgroundColor: "#fafafa",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0", color: "#333" }}>Direction Control</h3>

      <div style={{ marginBottom: "8px" }}>
        <strong>Current Direction: </strong>
        <span
          style={{
            color: config.isRTL ? "#d32f2f" : "#1976d2",
            fontWeight: "bold",
          }}
        >
          {config.isRTL ? "RTL (Right-to-Left)" : "LTR (Left-to-Right)"}
        </span>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <strong>Status: </strong>
        <span
          style={{
            color: config.enabled ? "#388e3c" : "#f57c00",
            fontWeight: "bold",
          }}
        >
          {config.enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={() => onToggle(config.id)}
          style={{
            padding: "8px 16px",
            backgroundColor: config.isRTL ? "#4CAF50" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Switch to {config.isRTL ? "LTR" : "RTL"}
        </button>

        <button
          onClick={() => onToggleEnabled(config.id)}
          style={{
            padding: "8px 16px",
            backgroundColor: config.enabled ? "#ff9800" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {config.enabled ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
};
