function Submitted({ image, fileType }) {
    // Debug: Logge den gesamten image object
    console.log("Submitted image object:", image);
    console.log("FileType prop:", fileType);

    // Erweiterte Dateityp-Erkennung
    const determineFileType = () => {
        // Wenn fileType explizit übergeben wurde, verwende das
        if (fileType && fileType !== 'unknown') return fileType;

        // Prüfe verschiedene mögliche URL-Felder
        const url = image?.url || image?.fileUrl || image?.filename || image?.imageUrl || image?.submissionUrl || '';
        console.log("Detected URL:", url);

        if (!url) return 'unknown';

        // Extrahiere Dateiendung aus URL
        const urlWithoutParams = url.split('?')[0]; // Entferne Query-Parameter
        const extension = urlWithoutParams.split('.').pop()?.toLowerCase();
        console.log("Detected extension:", extension);

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic'];
        const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'm4v', '3gp'];

        if (imageExtensions.includes(extension)) return 'image';
        if (videoExtensions.includes(extension)) return 'video';

        return 'unknown';
    };

    const currentFileType = determineFileType();
    console.log("Final file type:", currentFileType);

    return (
        <div className="rounded-2xl p-[2px] bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#a855f7]
                        max-h-[90vh] overflow-y-auto">
            <div className="rounded-[14px] bg-white/90 backdrop-blur-xl p-4 sm:p-5 shadow-xl">
                <div className="text-center text-gray-900 font-semibold mb-3">
                    You have completed this challenge 🎉
                </div>

                {image && (
                    <div className="relative overflow-hidden rounded-xl">
                        {currentFileType === 'video' ? (
                            <video
                                controls
                                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-md"
                                autoPlay
                                muted
                            >
                                <source src={image.url || image.fileUrl || image.filename} type="video/mp4" />
                                <source src={image.url || image.fileUrl || image.filename} type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                        ) : currentFileType === 'image' ? (
                            <img
                                src={image.url || image.fileUrl || image.filename}
                                alt="Your submission"
                                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-md"
                                onError={(e) => {
                                    console.error("Failed to load media:", image.url || image.fileUrl || image.filename);
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="text-center p-8 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 mb-2">Unsupported file type</p>
                                <p className="text-gray-500 text-sm mb-2">URL: {image.url || image.fileUrl || image.filename || 'No URL found'}</p>
                                <a
                                    href={image.url || image.fileUrl || image.filename}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 underline text-sm"
                                >
                                    Try downloading the file
                                </a>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-center mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 font-medium text-sm">Successfully submitted!</span>
                </div>
            </div>
        </div>
    );
}

export default Submitted;