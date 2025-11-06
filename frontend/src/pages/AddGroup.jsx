import HeaderBar from "../components/HeaderBar.jsx";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";
import {useUser} from "../context/UserContext.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import {API_URL} from "../config/config.js";

function AddGroup() {
    const {user} = useUser();
    const [groupId, setGroupId] = useState("");
    const navigate = useNavigate();

    const handleJoin = async () => {
        try {
            const token = localStorage.getItem("firebaseToken");
            const url = new URL(`${API_URL}/groups/join`);
            url.searchParams.append("uid", user.uid);
            url.searchParams.append("inviteId", "#" + groupId);

            const response = await fetch(url.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData.error || `Join group failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log("Joined group successfully:", data);
            navigate('/home');
        } catch (err) {
            console.error("Error joining group:", err.message);
        }
    };

    const handleCreate = () => {
        navigate("/create-group");
    };

    return (
        <div className="h-screen w-screen flex flex-col">
            <HeaderBar enable_back={true}/>
            <PageBelowHeaderBar className="flex-1 p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <div className="max-w-md mx-auto pt-6 relative">
                    {/* Soft background glow */}
                    <div
                        className="pointer-events-none absolute inset-x-0 -top-8 mx-auto h-24 max-w-md rounded-3xl blur-2xl opacity-60 bg-gradient-to-r from-blue-300/30 via-indigo-300/30 to-purple-300/30"/>

                    <Card
                        className="relative rounded-2xl shadow-2xl shadow-black/10 border-0 bg-white/90 backdrop-blur-xl overflow-hidden">
                        {/* Accent gradient bar */}
                        <div
                            className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"/>

                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl tracking-tight">
                                Join or Create a Group
                            </CardTitle>
                            <CardDescription className="text-base">
                                Enter your invite ID or start a new group.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-4">
                            <div className="flex flex-col gap-3">
                                <label htmlFor="group-id" className="text-sm font-medium text-gray-700">Group-ID</label>
                                <div className="relative">
                                    <span
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none">#</span>
                                    <Input
                                        id="group-id"
                                        type="text"
                                        value={groupId}
                                        onChange={(e) => setGroupId(e.target.value)}
                                        maxLength={5}
                                        placeholder="ABCDE"
                                        className="h-12 pl-8 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Invite IDs are 5 characters long.{" "}
                                </p>
                                <p className="text-xs text-gray-500">
  <span className="font-medium text-gray-600">
    You can find your Invite ID by opening a group and looking at the top, right below the group name.
  </span>
                                </p>
                                <div className="flex flex-col gap-3 mt-2">
                                    <Button
                                        onClick={handleJoin}
                                        variant="default"
                                        className="h-11 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Join
                                    </Button>

                                    <Button
                                        onClick={handleCreate}
                                        variant="secondary"
                                        className="h-11 rounded-xl bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow transition-all"
                                    >
                                        Create new group
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageBelowHeaderBar>
        </div>
    );
}

export default AddGroup;