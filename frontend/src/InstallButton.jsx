// InstallButton.jsx
import { useEffect, useState } from 'react'

export default function InstallButton() {
    const [promptEvent, setPromptEvent] = useState(null)

    useEffect(() => {
        const onBIP = (e) => { e.preventDefault(); setPromptEvent(e) }
        window.addEventListener('beforeinstallprompt', onBIP)
        return () => window.removeEventListener('beforeinstallprompt', onBIP)
    }, [])

    if (!promptEvent) return null
    return (
        <button
            style={{ position: 'fixed', right: 16, bottom: 16, padding: 12 }}
            onClick={async () => { await promptEvent.prompt(); setPromptEvent(null) }}
        >
            App installieren
        </button>
    )
}
