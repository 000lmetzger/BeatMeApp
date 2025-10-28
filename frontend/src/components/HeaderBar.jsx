import { useState, useRef, useEffect } from "react";
import BackwardsButton from "./BackwardsButton.jsx";
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
            console.log("Logout erfolgreich.");
            navigate("/login");
        } catch (error) {
            console.error("Fehler beim Logout:", error);
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
                className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#003366] to-[#0055aa] text-white flex items-center justify-between px-6 shadow-md"
                style={{ minHeight: "12vh", fontSize: "1.6rem" }}
            >
                <div className="flex items-center">
                    {enable_back && <BackwardsButton onBack={onBack} />}
                </div>

                <div className="text-center flex-1 font-semibold tracking-wide">
                    {user.username || "Guest"}
                </div>

                <div className="relative w-1/3 flex justify-end">
                    {user.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md cursor-pointer"
                            onClick={() => setIsModalOpen(!isModalOpen)}
                        />
                    ) : (
                        <div
                            className="h-14 w-14 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold border-2 border-white shadow-md cursor-pointer"
                            onClick={() => setIsModalOpen(!isModalOpen)}
                        >
                            ?
                        </div>
                    )}
                </div>
            </nav>

            {/* Spacer damit Content nicht abgeschnitten wird */}
            <div style={{ height: "12vh" }}></div>

            {isModalOpen && (
                <div
                    ref={modalRef}
                    className="fixed top-[12vh] right-0 bg-blue-100 text-black rounded-lg shadow-lg w-28 z-40"
                >
                    <button
                        className="w-full text-center text-sm px-2 py-2 hover:bg-gray-100 rounded-lg"
                        onClick={() => {
                            setIsModalOpen(false);
                            logout();
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </>
    );
}

export default HeaderBar;