import React, { useState } from "react";
import Voting from "../pages/Voting";
import Challenge from "../pages/Challenge";
import Ranking from "../pages/Ranking";
import HeaderBarGroup from "./HeaderBarGroup.jsx";
import {useNavigate} from "react-router-dom";

export default function GroupTabs() {
    const [index, setIndex] = useState(1);
    const navigate = useNavigate();

    const handleTabChange = (newValue) => {
        setIndex(newValue);
    };

    const onBack = () =>{
        navigate("/home");
    }

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <div className="flex flex-col flex-1 h-full min-h-0 overflow-auto">
                <HeaderBarGroup onBack={onBack}/>

                {index === 0 && (
                    <div className="flex flex-col flex-1 justify-between min-h-0">
                        <Voting />
                    </div>
                )}
                {index === 1 && (
                    <div className="flex flex-col flex-1 justify-between min-h-0">
                        <Challenge />
                    </div>
                )}
                {index === 2 && (
                    <div className="flex flex-col flex-1 justify-between min-h-0">
                        <Ranking />
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-gray-100 border-t border-gray-300 flex justify-center">
                <button
                    className={`flex-1 py-3 text-center ${
                        index === 0 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                    }`}
                    onClick={() => handleTabChange(0)}
                >
                    Voting
                </button>
                <button
                    className={`flex-1 py-3 text-center ${
                        index === 1 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                    }`}
                    onClick={() => handleTabChange(1)}
                >
                    Challenge
                </button>
                <button
                    className={`flex-1 py-3 text-center ${
                        index === 2 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                    }`}
                    onClick={() => handleTabChange(2)}
                >
                    Ranking
                </button>
            </div>
        </div>
    );
}
