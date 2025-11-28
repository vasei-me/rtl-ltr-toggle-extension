import React, { useState } from "react";
import { DirectionEntity } from "../../core/entities/direction.entity";

interface Props {
  config: DirectionEntity;
  onAddUrl: (configId: string, url: string) => void;
  onRemoveUrl: (configId: string, url: string) => void;
}

export const UrlManager: React.FC<Props> = ({
  config,
  onAddUrl,
  onRemoveUrl,
}) => {
  const [newUrl, setNewUrl] = useState("");

  const handleAddUrl = () => {
    if (newUrl.trim()) {
      onAddUrl(config.id, newUrl.trim());
      setNewUrl("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddUrl();
    }
  };

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
      <h3 style={{ margin: "0 0 12px 0", color: "#333" }}>Managed URLs</h3>

      <div style={{ marginBottom: "12px" }}>
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter URL or domain (e.g., google.com)"
          style={{
            padding: "8px",
            marginRight: "8px",
            width: "200px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleAddUrl}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Add URL
        </button>
      </div>

      {config.targetUrls.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {config.targetUrls.map((url, index) => (
            <li
              key={index}
              style={{
                padding: "6px 8px",
                margin: "4px 0",
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "14px" }}>{url}</span>
              <button
                onClick={() => onRemoveUrl(config.id, url)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p
          style={{
            color: "#666",
            fontStyle: "italic",
            margin: "8px 0",
            fontSize: "14px",
          }}
        >
          No URLs added yet. Add URLs to manage their direction.
        </p>
      )}
    </div>
  );
};
