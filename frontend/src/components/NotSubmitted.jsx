import React, { useRef, useState } from 'react';

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
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
        const file = new File([blob], `camera-video-${Date.now()}.mp4`, { type: 'video/mp4' });
        handleFileChange({ target: { files: [file] } });

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

    } catch (err) {
      console.error('Error accessing camera:', err);
      // Fallback zu normalem File Input
      cameraInputRef.current?.click();
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFileChange({ target: { files: [file] } });
      }, 'image/jpeg');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Vereinfachte Version für normale Nutzung */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {isMobile && (
          <button
            onClick={() => {
              // Direkter Kamera-Zugriff versuchen
              const tempInput = document.createElement('input');
              tempInput.type = 'file';
              tempInput.accept = 'image/*,video/*';
              tempInput.capture = 'environment';

              tempInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) handleFileChange({ target: { files: [file] } });
              };

              tempInput.click();
            }}
            style={buttonStyle}
            disabled={loading}
          >
            📸 Open Camera Directly
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
        accept="image/*,video/*"
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