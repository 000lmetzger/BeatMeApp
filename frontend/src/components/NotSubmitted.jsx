import React, { useRef } from 'react';

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
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const openPhotoCamera = () => {
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = 'image/*';
    tempInput.capture = 'environment';

    tempInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) handleFileChange({ target: { files: [file] } });
    };

    tempInput.click();
  };

  const openVideoCamera = () => {
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = 'video/*';
    tempInput.capture = 'environment';

    tempInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) handleFileChange({ target: { files: [file] } });
    };

    tempInput.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        {isMobile && (
          <>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={openPhotoCamera}
                style={buttonStyle}
                disabled={loading}
              >
                📸 Take Photo
              </button>
              <button
                onClick={openVideoCamera}
                style={buttonStyle}
                disabled={loading}
              >
                🎥 Record Video
              </button>
            </div>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
              This will open your camera directly
            </div>
          </>
        )}
        <button
          onClick={openFileBrowser}
          style={outlineButtonStyle}
          disabled={loading}
        >
          📂 Select from Gallery
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

      {/* Versteckte Inputs für Fallback */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}