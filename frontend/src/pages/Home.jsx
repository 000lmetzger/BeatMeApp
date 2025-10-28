import HeaderBar from "../components/HeaderBar.jsx";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";
import DisplaySingleGroupInUserHome from "../components/DisplaySingleGroupInUserHome.jsx";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { API_URL } from "../config/config.js";
import { useUser } from "../context/UserContext.jsx";

// shadcn/ui
import { Button } from "@/components/ui/button";

const fetcher = async (url) => {
    const token = localStorage.getItem("firebaseToken");
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
            <div className="flex justify-center items-center h-screen text-sm text-muted-foreground">
                Bitte einloggen...
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-sm text-muted-foreground">
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
        <div className="h-screen w-screen flex flex-col bg-background">
            <HeaderBar enable_back={false} />
            <PageBelowHeaderBar className="flex-1 overflow-y-auto">
                <div className="flex flex-col w-full gap-3 p-3">
                    {groups?.map((group, index) => (
                        <DisplaySingleGroupInUserHome key={index} group_information={group} />
                    ))}
                </div>

                <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-6 right-6 h-14 w-14 md:h-16 md:w-16 rounded-full !bg-primary/80 !text-primary-foreground !shadow-lg hover:!bg-primary hover:!shadow-xl active:!shadow-md hover:!-translate-y-0.5 active:!translate-y-0 !transition-all focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-offset-2 focus-visible:!ring-primary !border-0"
                    onClick={handleClick}
                    aria-label="Gruppe hinzufügen"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </Button>
            </PageBelowHeaderBar>
        </div>
    );
}

export default Home;