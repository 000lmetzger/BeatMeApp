import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import { API_URL } from "../config/config.js";
import {useGroup} from "../context/GroupContext.jsx";

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

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    console.log(group);

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
                setChallenge({ challenge: "Dummy Challenge", description: "This is a placeholder challenge because no active challenge was found." });
            }
        }

        fetchChallenge();
    }, [group.groupId]);

    const openCamera = () => cameraInputRef.current?.click();
    const openFileBrowser = () => fileInputRef.current?.click();

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
            setFile(null); // Optional: clear file after success
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={openCamera} style={buttonStyle} disabled={loading}>📸 Open Camera</button>
                    <button onClick={openFileBrowser} style={outlineButtonStyle} disabled={loading}>📂 Select from Storage</button>
                </div>

                {loading && <p style={{ color: 'blue' }}>Uploading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                {file && !loading && !successMessage && (
                    <div style={{ marginTop: '10px', padding: '10px', border: '1px dashed #ccc', borderRadius: '4px' }}>
                        <p>File ready: <strong>{file.name}</strong></p>
                    </div>
                )}

                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: 'none' }} />
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
        </div>
    );
}

export default Challenge;
