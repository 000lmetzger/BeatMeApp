import { FaCamera, FaUpload } from "react-icons/fa";
import { useState, useEffect } from "react";
import {API_URL} from "../config/config.js";

function Challenge() {
    const [challenge, setChallenge] = useState(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const cached = JSON.parse(localStorage.getItem("dailyChallenge") || "{}");

        if (cached.date === today) {
            setChallenge(cached.data);
        } else {
            fetch(API_URL + `/challenges/group/{groupId}/current`)
                .then(res => res.json())
                .then(json => {
                    setChallenge(json);
                    localStorage.setItem(
                        "dailyChallenge",
                        JSON.stringify({ date: today, data: json })
                    );
                })
                .catch(console.error);
        }
    }, []);

    if (!challenge) {
        return (
            <div className="flex justify-center items-center p-6">
                Lade Challenge...
            </div>
        );
    }

    return (
        <div className="bg-gray-100 flex pb-[25%] flex-1 flex-col justify-between items-center p-4">
            <h1 className="font-bold p-5">Challenge</h1>

            <h2 className="text-xl font-semibold mb-4">{challenge.header}</h2>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-md">
                <p className="text-gray-700">{challenge.description}</p>
            </div>

            {!completed ? (
                <div className="flex flex-row justify-center items-center w-full space-x-4 border-1 h-[50%]">
                    <button
                        className="flex flex-col items-center w-[45%] h-[50%] py-3 px-4 rounded-lg transition"
                        style={{ backgroundColor: "#11ff11" }}
                    >
                        <FaCamera />
                        <br />
                        Foto/Video aufnehmen
                    </button>
                    <button
                        className="flex flex-col items-center w-[45%] h-[50%] py-3 px-4 rounded-lg transition"
                        style={{ backgroundColor: "#6666ff" }}
                        onClick={() => setCompleted(true)}
                    >
                        <FaUpload />
                        <br />
                        Hochladen
                    </button>
                </div>
            ) : (
                <div className="flex flex-row justify-center items-center w-full space-x-4 border-1 h-[50%]">
                    Challenge done
                </div>
            )}
        </div>
    );
}

export default Challenge;
