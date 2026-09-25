import { useEffect, useState } from 'react'

export default function InstallApp({ compact = false }) {
    const [installPrompt, setInstallPrompt] = useState(null)
    const [installed, setInstalled] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault()
            setInstallPrompt(event)
        }
        const handleInstalled = () => {
            setInstalled(true)
            setInstallPrompt(null)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleInstalled)
        setInstalled(window.matchMedia('(display-mode: standalone)').matches || Boolean(window.navigator.standalone))

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleInstalled)
        }
    }, [])

    const installApp = async () => {
        if (!installPrompt) {
            setShowInstructions(true)
            return
        }
        installPrompt.prompt()
        await installPrompt.userChoice
        setInstallPrompt(null)
    }

    if (installed) return null

    return (
        <div className={`install-app-wrap ${compact ? 'compact' : ''}`}>
            <button type="button" className={`install-app-button ${compact ? 'compact' : ''}`} onClick={installApp}>
                <span aria-hidden="true">⇩</span> Install Neolit
            </button>
            {showInstructions && (
                <p className="install-app-help">Open your browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
            )}
        </div>
    )
}
