import HeaderBar from "../components/HeaderBar.jsx";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";
import DisplaySingleGroupInUserHome from "../components/DisplaySingleGroupInUserHome.jsx";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { API_URL } from "../config/config.js";
import { useUser } from "../context/UserContext.jsx";

const fetcher = async (url) => {
    const token = localStorage.getItem("firebaseToken");
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Could not load group_data");
    }
    return response.json();
};

function Home() {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/add-group");
    };
    const token = localStorage.getItem("firebaseToken");
    const { data: groups, error, isLoading } = useSWR(
        user?.uid && token ? `${API_URL}/groups/user` : null,
        fetcher
    );

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                Bitte einloggen...
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Lade Gruppen...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Fehler beim Laden der Gruppen: {error.message}
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col">
            <HeaderBar enable_back={false} />
            <PageBelowHeaderBar className="flex-1 overflow-y-auto">
                <div className="flex flex-col w-full gap-3 p-3">
                    {groups?.map((group, index) => (
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
