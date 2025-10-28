import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext.jsx';
import { API_URL } from "../config/config.js";
import { useGroup } from "../context/GroupContext.jsx";
import Submitted from "../components/Submitted.jsx";
import NotSubmitted from "../components/NotSubmitted.jsx";
import useSWR from "swr";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const fetcher = async (url) => {
  const token = localStorage.getItem("firebaseToken");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error || `Fetch error (Status: ${res.status})`;
    throw new Error(message);
  }

  return res.json();
};

export function Challenge() {
  const { user } = useUser();
  const { group } = useGroup();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [dummyNotice, setDummyNotice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    setIsMobile(/android|iPad|iPhone|iPod/i.test(navigator.userAgent));
  }, []);

  const { data: challenge, error: challengeError, isLoading: challengeLoading } = useSWR(
      group?.groupId ? `${API_URL}/challenges/group/${group.groupId}/current` : null,
      fetcher
  );

  const { data: challengeDone, error: submissionError, isLoading: submissionLoading } = useSWR(
      group?.groupId ? `${API_URL}/challenges/group/${group.groupId}/current/submission` : null,
      fetcher
  );

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
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

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
    cursor: loading ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    backgroundColor: loading ? '#aaa' : '#007bff',
    color: 'white',
    flex: 1,
    textAlign: 'center'
  };

  const outlineButtonStyle = { ...buttonStyle, backgroundColor: 'white', border: '1px solid #007bff', color: '#007bff' };

  if (challengeLoading || submissionLoading) return <p>Loading...</p>;
  if (challengeError) return <p>Error loading challenge: {challengeError.message}</p>;
  if (submissionError) return <p>Error loading submission: {submissionError.message}</p>;

  return (
      <div className={cn("flex flex-col gap-6 max-w-md mx-auto mt-12 px-4")}>
        {dummyNotice && <p style={{ color: 'orange', fontWeight: 'bold' }}>No challenge found, using dummy data.</p>}

        {challenge && (
            <div>
              <h1 style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{challenge.challenge}</h1>
              <p style={{ fontSize: '0.95em', color: '#555' }}>{challenge.description}</p>
            </div>
        )}

        {challengeDone?.submitted ? (
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
