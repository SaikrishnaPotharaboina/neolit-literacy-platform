import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { learningApi } from '../services/learningApi'
import { languages } from '../data/languages'

export default function ProfilePage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [levels, setLevels] = useState([])
    const [profile, setProfile] = useState(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const currentLevelName = levels.find((level) => level.id === (profile?.current_level_id || user?.current_level_id))?.name || 'Beginner'

    const safeProfile = profile || {
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        age: user?.age || '',
        native_language: user?.native_language || '',
        learning_language: user?.learning_language || 'en',
        gender: user?.gender || '',
        current_level_id: user?.current_level_id || levels[0]?.id || 1,
    }

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const [profileData, levelData] = await Promise.all([
                    learningApi.getProfile(),
                    learningApi.getLevels(),
                ])
                setProfile(profileData)
                setLevels(levelData)
            } catch (requestError) {
                setError(requestError.response?.data?.detail || 'Unable to load your profile')
            }
        }
        loadProfile()
    }, [])

    const updateField = (field, value) => {
        setProfile((current) => ({ ...current, [field]: value }))
    }

    const saveProfile = async (event) => {
        event.preventDefault()
        setError('')

        try {
            const updated = await learningApi.updateProfile({
                ...safeProfile,
                first_name: safeProfile.first_name || user?.first_name || '',
                last_name: safeProfile.last_name || user?.last_name || '',
                learning_language: safeProfile.learning_language || 'en',
                current_level_id: safeProfile.current_level_id || 1,
            })
            setProfile(updated)
            setMessage('Profile updated successfully.')
        } catch (requestError) {
            setError(requestError.response?.data?.detail || 'Unable to update your profile')
        }
    }

    return (
        <div className="profile-page">
            <div className="profile-shell">
                <header className="profile-header">
                    <Link to="/dashboard" className="profile-brand">
                        <span className="brand-mark">N</span>
                        <span>
                            <strong>NeoLit</strong>
                            <small>Learning Lab</small>
                        </span>
                    </Link>
                    <span className="profile-email">{user?.email || 'No email available'}</span>
                </header>

                <main className="profile-panel">
                    <div className="profile-panel-header">
                        <div>
                            <p className="eyebrow">Learner profile</p>
                            <h1>Your learning settings</h1>
                        </div>
                        <button type="button" onClick={() => navigate('/dashboard')} className="ghost-btn">Back to dashboard</button>
                    </div>

                    {message && <p className="profile-message success">{message}</p>}
                    {error && <p className="profile-message error">{error}</p>}

                    <div className="profile-summary">
                        <div className="profile-summary-avatar">
                            {(safeProfile.first_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-summary-copy">
                            <strong>{`${safeProfile.first_name || ''} ${safeProfile.last_name || ''}`.trim() || 'Learner'}</strong>
                            <span>{user?.email || 'No email available'}</span>
                        </div>
                        <div className="profile-pill-badge">{currentLevelName}</div>
                    </div>

                    {safeProfile && (
                        <form onSubmit={saveProfile} className="profile-form">
                            <div className="profile-grid">
                                <label className="field">
                                    <span>First name</span>
                                    <input value={safeProfile.first_name || ''} onChange={(event) => updateField('first_name', event.target.value)} />
                                </label>
                                <label className="field">
                                    <span>Last name</span>
                                    <input value={safeProfile.last_name || ''} onChange={(event) => updateField('last_name', event.target.value)} />
                                </label>
                                <label className="field">
                                    <span>Native language</span>
                                    <input value={safeProfile.native_language || ''} onChange={(event) => updateField('native_language', event.target.value)} />
                                </label>
                                <label className="field">
                                    <span>Gender</span>
                                    <input value={safeProfile.gender || ''} onChange={(event) => updateField('gender', event.target.value)} />
                                </label>
                                <label className="field">
                                    <span>Age</span>
                                    <input
                                        type="number"
                                        min="5"
                                        max="120"
                                        value={safeProfile.age || ''}
                                        onChange={(event) => updateField('age', event.target.value ? Number(event.target.value) : null)}
                                    />
                                </label>
                                <label className="field">
                                    <span>Preferred language</span>
                                    <select value={safeProfile.learning_language || 'en'} onChange={(event) => updateField('learning_language', event.target.value)}>
                                        {languages.map((language) => (
                                            <option key={language.code} value={language.code}>{language.name}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="field full-width">
                                    <span>Current proficiency level</span>
                                    <select value={safeProfile.current_level_id || levels[0]?.id || 1} onChange={(event) => updateField('current_level_id', Number(event.target.value))}>
                                        {levels.map((level) => (
                                            <option key={level.id} value={level.id}>{level.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div className="profile-actions">
                                <button type="submit" className="primary-btn">Save changes</button>
                            </div>
                        </form>
                    )}
                </main>
            </div>
        </div>
    )
}
