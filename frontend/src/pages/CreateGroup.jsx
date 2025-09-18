import HeaderBar from "../components/HeaderBar.jsx";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";

function CreateGroup() {
    return (
        <div className="h-screen w-screen flex flex-col">
            <HeaderBar username={username}>
                <h1 className="mt-0 mb-0">Hello world</h1>
            </HeaderBar>
            <PageBelowHeaderBar>
                <div>Create new group</div>
            </PageBelowHeaderBar>
        </div>
    );
}

export default CreateGroup;