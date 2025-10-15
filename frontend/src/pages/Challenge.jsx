import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext.jsx';
import { API_URL } from "../config/config.js";
import { useGroup } from "../context/GroupContext.jsx";
import Submitted from "../components/Submitted.jsx";
import NotSubmitted from "../components/NotSubmitted.jsx";

const cn = (...classes) => classes.filter(Boolean).join(' ');

export function Challenge() {
  const { user } = useUser();
  const { group } = useGroup();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [dummyNotice, setDummyNotice] = useState(false);
  const [challengeDone, setChallengeDone] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(ua) || /iPad|iPhone|iPod/.test(ua)) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    checkMobile();
  }, []);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const token = localStorage.getItem("firebaseToken");
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const res = await fetch(`${API_URL}/challenges/group/${group.groupId}/current`, { headers });
        if (!res.ok) {
          setDummyNotice(true);
          setChallenge({ challenge: "No Challenge found", description: "" });
          return;
        }
        const data = await res.json();
        setChallenge(data);
      } catch (err) {
        setDummyNotice(true);
        setChallenge({ challenge: "No Challenge found", description: "" });
      }
      try {
        const token = localStorage.getItem("firebaseToken");
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const res = await fetch(`${API_URL}/challenges/group/${group.groupId}/current/submission`, { headers });
        if (!res.ok) {
          console.error("Error loading challenge");
        }
        const data = await res.json();
        setChallengeDone(data);
      } catch (err) {
        console.error("Error loading challenge");
      }
    }
    fetchChallenge();
  }, [group.groupId, challengeDone]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (fileToUpload) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const uid = user?.uid;
    if (!uid || !fileToUpload) {
      setError("Error: Please sign in and select a file.");
      setLoading(false);
      return;
    }

    const apiUrl = `${API_URL}/groups/${group.groupId}/challenges/${challenge.challengeId}/submit`;
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const token = localStorage.getItem("firebaseToken");
      const headers = { "Authorization": `Bearer ${token}` };

      const res = await fetch(`${apiUrl}?uid=${uid}`, {
        method: "POST",
        headers,
        body: formData
      });

      if (!res.ok) {
        let errorMessage = `Upload failed (Status: ${res.status})`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {}
        setError(errorMessage);
        console.error(errorMessage);
        return;
      }

      setSuccessMessage("Successfully submitted!");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "An unexpected upload error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: loading ? '#aaa' : '#007bff',
    color: 'white',
    flex: 1,
    textAlign: 'center'
  };

  const outlineButtonStyle = { ...buttonStyle, backgroundColor: 'white', border: '1px solid #007bff', color: '#007bff' };

  return (
    <div className={cn("flex flex-col gap-6 max-w-md mx-auto mt-12 px-4")}>
      {dummyNotice && <p style={{ color: 'orange', fontWeight: 'bold' }}>No challenge found, using dummy data.</p>}

      {challenge && (
        <div>
          <h1 style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{challenge.challenge}</h1>
          <p style={{ fontSize: '0.95em', color: '#555' }}>{challenge.description}</p>
        </div>
      )}

      {challengeDone.submitted ? (
        <Submitted image={challengeDone} />
      ) : (
        <NotSubmitted
          {...{
            error,
            successMessage,
            file,
            cameraInputRef,
            fileInputRef,
            handleFileChange,
            buttonStyle,
            openFileBrowser: () => fileInputRef.current?.click(),
            outlineButtonStyle,
            loading,
            isMobile
          }}
        />
      )}
    </div>
  );
}

export default Challenge;
