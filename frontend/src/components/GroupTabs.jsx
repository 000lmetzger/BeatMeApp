import React, { useState } from "react";
import Voting from "../pages/Voting";
import Challenge from "../pages/Challenge";
import Ranking from "../pages/Ranking";
import HeaderBarGroup from "./HeaderBarGroup.jsx";
import { useNavigate } from "react-router-dom";

// shadcn/ui
import { Badge } from "@/components/ui/badge";

export default function GroupTabs() {
    const [index, setIndex] = useState(1);
    const navigate = useNavigate();

    const handleTabChange = (newValue) => {
        setIndex(newValue);
    };

    const onBack = () => {
        navigate("/home");
    };

    const tabs = [
        { id: 0, label: "Voting" },
        { id: 1, label: "Challenge" },
        { id: 2, label: "Ranking" }
    ];

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex flex-col flex-1 h-full min-h-0 overflow-auto">
                <HeaderBarGroup onBack={onBack} />

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

            {/* Premium Tab Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-lg shadow-black/5">
                <div className="flex justify-center px-4 py-2">
                    <div className="flex bg-gray-100/60 rounded-2xl p-1 backdrop-blur-sm border border-white/20 shadow-inner">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`relative flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-out ${
                                    index === tab.id
                                        ? "text-white shadow-lg"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                                onClick={() => handleTabChange(tab.id)}
                            >
                                {/* Active tab background */}
                                {index === tab.id && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25" />
                                )}

                                {/* Tab content */}
                                <div className="relative flex items-center justify-center">
                                    <span>{tab.label}</span>
                                </div>

                                {/* Subtle glow effect for active tab */}
                                {index === tab.id && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-sm -z-10" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}