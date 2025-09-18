function PageBelowHeaderBar({ children }) {
    return (
        <div className="relative flex-1 flex-col min-w-screen h-[88vh] text-black justify-between items-center m-0 p-0">
            {children}
        </div>
    );
}
export default PageBelowHeaderBar;
