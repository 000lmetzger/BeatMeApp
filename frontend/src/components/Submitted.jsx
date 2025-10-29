function Submitted({ image }) {
    return (
        <div className="rounded-2xl p-[2px] bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#a855f7]
                        max-h-[90vh] overflow-y-auto">
            <div className="rounded-[14px] bg-white/90 backdrop-blur-xl p-4 sm:p-5 shadow-xl">
                <div className="text-center text-gray-900 font-semibold mb-3">
                    You have completed this challenge
                </div>

                {image && (
                    <div className="relative overflow-hidden rounded-xl">
                        <img
                            src={image.url}
                            alt="Could not load image"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Submitted;
