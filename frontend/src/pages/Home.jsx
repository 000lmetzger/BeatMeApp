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
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const text = await response.text();
        console.error("Fetch failed:", response.status, text);
        throw new Error("Could not load data");
    }
    return response.json();
};

const fetchGroupStatuses = async (_key, groups) => {
    if (!groups || !Array.isArray(groups)) return [];

    const token = localStorage.getItem("firebaseToken");

    const results = await Promise.all(
        groups.map(async (g) => {
            const groupId = g.groupId;
            try {
                const currentRes = await fetch(
                    `${API_URL}/challenges/group/${groupId}/current/submission`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const currentSubmission = currentRes.ok ? await currentRes.json() : null;

                const yesterdayRes = await fetch(
                    `${API_URL}/groups/${groupId}/challenges/previous/submissions`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const yesterdayData = yesterdayRes.ok ? await yesterdayRes.json() : null;

                const yid = yesterdayData?.challenge?.challengeId;
                let votesData = null;
                if (yid) {
                    const votesRes = await fetch(
                        `${API_URL}/groups/${groupId}/challenges/${yid}/votes`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    votesData = votesRes.ok ? await votesRes.json() : null;
                }

                const challengeDone = currentSubmission?.submitted ?? false;
                const submissionCount = yesterdayData?.submissions?.length ?? 0;
                const votesGiven =
                    votesData && typeof votesData === "object"
                        ? Object.values(votesData).filter((v) => v != null).length
                        : 0;
                const votingDone = submissionCount === 0 ? true : votesGiven >= submissionCount;

                return {
                    groupId,
                    currentSubmission,
                    yesterdayData,
                    votesData,
                    challengeDone,
                    votingDone,
                    submissionCount,
                    votesGiven,
                };
            } catch (e) {
                console.error("Error fetching status for group", groupId, e);
                return {
                    groupId,
                    currentSubmission: null,
                    yesterdayData: null,
                    votesData: null,
                    challengeDone: false,
                    votingDone: true,
                    submissionCount: 0,
                    votesGiven: 0,
                    _error: true,
                };
            }
        })
    );

    return results;
};

function Home() {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/add-group");
    };
    const token = localStorage.getItem("firebaseToken");

    const { data: groups, error: groupsError, isLoading: groupsLoading } = useSWR(
        user?.uid && token ? `${API_URL}/groups/user` : null,
        fetcher
    );

    const { data: groupStatuses, error: statusesError, isLoading: statusesLoading } = useSWR(
        groups ? ["group-statuses", groups] : null,
        fetchGroupStatuses
    );

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Bitte einloggen...</div>;
    }

    if (groupsLoading) {
        return <div className="flex justify-center items-center h-screen">Lade Gruppen...</div>;
    }

    if (groupsError) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Fehler beim Laden der Gruppen: {groupsError.message}
            </div>
        );
    }

    const mergedGroups = (groups || []).map((g) => {
        const status = (groupStatuses || []).find((s) => s.groupId === g.groupId) || {};
        return {
            ...g,
            currentSubmission: status.currentSubmission ?? null,
            yesterdayData: status.yesterdayData ?? null,
            votesData: status.votesData ?? null,
            challengeDone: status.challengeDone ?? false,
            votingDone: status.votingDone ?? true,
            submissionCount: status.submissionCount ?? 0,
            votesGiven: status.votesGiven ?? 0,
            _statusError: status._error ?? false,
        };
    });

    const sortedGroups = (mergedGroups || []).slice().sort((a, b) => {
        if (a.challengeDone !== b.challengeDone) {
            return a.challengeDone ? 1 : -1;
        }
        if (a.votingDone !== b.votingDone) {
            return a.votingDone ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="h-screen w-screen flex flex-col">
            <HeaderBar enable_back={false} />
            <PageBelowHeaderBar className="flex-1 overflow-y-auto">
                <div className="flex flex-col w-full gap-3 p-3">
                    {sortedGroups?.map((group) => (
                        <DisplaySingleGroupInUserHome key={group.groupId} group_information={group} />
                    ))}
                </div>

                <button
                    className="fixed bottom-5 right-5 text-white h-16 w-16 rounded-full shadow-lg flex items-center justify-center bg-green-600 hover:bg-green-700"
                    onClick={handleClick}
                >
                    <span className="text-[3.5rem]">+</span>
                </button>
            </PageBelowHeaderBar>
        </div>
    );
}

export default Home;
