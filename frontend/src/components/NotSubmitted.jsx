import React from 'react';

export default function NotSubmitted({
  error,
  successMessage,
  file,
  cameraInputRef,
  fileInputRef,
  handleFileChange,
  buttonStyle,
  openFileBrowser,
  outlineButtonStyle,
  loading,
  isMobile
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        {isMobile && (
          <button
            onClick={() => cameraInputRef.current?.click()}
            style={buttonStyle}
            disabled={loading}
          >
            📸 Open Camera
          </button>
        )}
        <button
          onClick={openFileBrowser}
          style={outlineButtonStyle}
          disabled={loading}
        >
          📂 Select from Storage
        </button>
      </div>

      {loading && <p style={{ color: 'blue' }}>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {file && !loading && !successMessage && (
        <div style={{ marginTop: '10px', padding: '10px', border: '1px dashed #ccc', borderRadius: '4px' }}>
          <p>File ready: <strong>{file.name}</strong></p>
        </div>
      )}

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
