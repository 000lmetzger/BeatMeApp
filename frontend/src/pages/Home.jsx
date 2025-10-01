import HeaderBar from "../components/HeaderBar.jsx";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";
import DisplaySingleGroupInUserHome from "../components/DisplaySingleGroupInUserHome.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config.js";
import { useUser } from "../context/UserContext.jsx";

function Home() {
    const { user } = useUser(); // Firebase-User aus Context
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/add-group");
    };

    useEffect(() => {
        if (!user?.uid) return; // Lade erst, wenn User eingeloggt

        const fetchGroups = async () => {
            try {
                const response = await fetch(`${API_URL}/groups/user/${user.uid}`);
                if (!response.ok) {
                    console.error("Could not load group_data");
                    return;
                }
                const data = await response.json();
                setGroups(data);
            } catch (err) {
                console.error("Error fetching groups:", err);
            }
        };

        fetchGroups();
    }, [user?.uid]);

    // Optional: Fallback, wenn User noch nicht geladen
    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                Bitte einloggen...
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col">
            <HeaderBar enable_back={false} />
            <PageBelowHeaderBar className="flex-1 overflow-y-auto">
                <div className="flex flex-col w-full gap-3 p-3">
                    {groups.map((group, index) => (
                        <DisplaySingleGroupInUserHome
                            key={index}
                            group_information={group}
                        />
                    ))}
                </div>

                <button
                    style={{ backgroundColor: "green" }}
                    className="fixed bottom-5 right-5 text-white h-25 w-25 rounded-full shadow-lg flex items-center justify-center"
                    onClick={handleClick}
                >
                    <span className="text-[3.5rem]">+</span>
                </button>
            </PageBelowHeaderBar>
        </div>
    );
}

export default Home;
