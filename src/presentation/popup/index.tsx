import React, { useState } from "react";
import { DirectionToggle } from "../components/direction-toggle.component";
import { UrlManager } from "../components/url-manager.component";
import { useDirection } from "../hooks/use-direction.hook";

const Popup: React.FC = () => {
  const {
    configs,
    currentConfig,
    loading,
    error,
    toggleDirection,
    toggleEnabled,
    addUrl,
    removeUrl,
    exportConfig,
    importConfig,
    clearConfigs,
  } = useDirection();

  const [exportData, setExportData] = useState<string>("");
  const [importData, setImportData] = useState<string>("");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleExport = async () => {
    const data = await exportConfig();
    if (data) {
      setExportData(data);
      navigator.clipboard.writeText(data);
      alert("Config exported to clipboard!");
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      alert("Please enter config data to import");
      return;
    }
    const success = await importConfig(importData);
    if (success) {
      alert("Config imported successfully!");
      setImportData("");
    } else {
      alert("Failed to import config");
    }
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear all configurations?")) {
      await clearConfigs();
      alert("All configurations cleared!");
    }
  };

  return (
    <div
      style={{
        width: "400px",
        padding: "16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>RTL-LTR Extension</h1>

      {currentConfig && (
        <DirectionToggle
          config={currentConfig}
          onToggle={toggleDirection}
          onToggleEnabled={toggleEnabled}
        />
      )}

      {currentConfig && (
        <UrlManager
          config={currentConfig}
          onAddUrl={addUrl}
          onRemoveUrl={removeUrl}
        />
      )}

      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
        }}
      >
        <h3>Configuration Management</h3>

        <div style={{ marginBottom: "12px" }}>
          <button
            onClick={handleExport}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "8px",
            }}
          >
            Export Config
          </button>
          <button
            onClick={handleClearAll}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <textarea
            placeholder="Paste config JSON here to import"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "12px",
            }}
          />
        </div>

        <button
          onClick={handleImport}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Import Config
        </button>

        {exportData && (
          <div style={{ marginTop: "12px" }}>
            <h4>Exported Config:</h4>
            <textarea
              value={exportData}
              readOnly
              style={{
                width: "100%",
                height: "150px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
