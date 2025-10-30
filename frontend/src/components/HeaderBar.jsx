import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

function HeaderBar({ enable_back }) {
    const navigate = useNavigate();
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);

    async function logout(setUser) {
        try {
            await signOut(auth);
            localStorage.clear();
            if (setUser) {
                setUser(null);
            }
            navigate("/login");
        } catch (error) {
            console.error("Error during Logout:", error);
        }
    }

    const onBack = () => {
        navigate("/home");
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
        }
        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 text-white flex items-center justify-between pl-2 sm:pl-4 pr-4 sm:pr-6 shadow-lg shadow-black/10"
                style={{ minHeight: "12vh", fontSize: "1.6rem",
                    background: "linear-gradient(135deg,#5b21b6 0%,#7c3aed 55%,#a855f7 100%)"
                }}
            >
                <div className="flex items-center">
                    {enable_back && (
                        <button
                            type="button"
                            onClick={onBack}
                            aria-label="Zurück"
                            className="ml-1 sm:ml-2 p-1 hover:opacity-90 active:opacity-80 transition-opacity"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5 text-white"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.53 4.47a.75.75 0 010 1.06L5.81 10.25H20a.75.75 0 010 1.5H5.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
                </div>


                <div className="text-center flex-1 font-semibold tracking-wide">
                    {user.username || "Guest"}
                </div>

                <div className="relative w-1/3 flex justify-end">
                    {user.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            className="h-14 w-14 rounded-full object-cover border-2 border-white/70 shadow-md cursor-pointer ring-2 ring-purple-200/40 hover:ring-purple-200/70 transition"
                            onClick={() => setIsModalOpen(!isModalOpen)}
                        />
                    ) : (
                        <div
                            className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold border-2 border-white/40 shadow-md cursor-pointer"
                            onClick={() => setIsModalOpen(!isModalOpen)}
                        >
                            ?
                        </div>
                    )}
                </div>
            </nav>

            <div style={{ height: "12vh" }}></div>

            {isModalOpen && (
                <div
                    ref={modalRef}
                    className="fixed top-[12vh] right-3 sm:right-4 z-40"
                >
                    <div className="min-w-[11rem] rounded-xl bg-white/90 backdrop-blur-xl shadow-2xl border border-purple-200/40 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="text-sm font-semibold text-gray-800 truncate">{user.username || "Guest"}</div>
                            <div className="text-xs text-gray-500 truncate">{user.email || ""}</div>
                        </div>
                        <button
                            className="w-full text-left text-sm px-4 py-3 hover:bg-gray-50 active:bg-gray-100 text-gray-800"
                            onClick={() => {
                                setIsModalOpen(false);
                                logout();
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default HeaderBar;