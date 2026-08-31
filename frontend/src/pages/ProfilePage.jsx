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
            setProfile(await learningApi.updateProfile(profile))
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
                    <span className="profile-email">{user?.email}</span>
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

                    {profile && (
                        <form onSubmit={saveProfile} className="profile-form">
                            <div className="profile-grid">
                                <label className="field">
                                    <span>First name</span>
                                    <input value={profile.first_name || ''} onChange={(event) => updateField('first_name', event.target.value)} />
                                </label>
                                <label className="field">
                                    <span>Last name</span>
                                    <input value={profile.last_name || ''} onChange={(event) => updateField('last_name', event.target.value)} />
                                </label>
                                <label className="field">
                                    <span>Native language</span>
                                    <input value={profile.native_language || ''} onChange={(event) => updateField('native_language', event.target.value)} />
                                </label>
                                <label className="field">
                                    <span>Gender</span>
                                    <input value={profile.gender || ''} onChange={(event) => updateField('gender', event.target.value)} />
                                </label>
                                <label className="field">
                                    <span>Age</span>
                                    <input
                                        type="number"
                                        min="5"
                                        max="120"
                                        value={profile.age || ''}
                                        onChange={(event) => updateField('age', event.target.value ? Number(event.target.value) : null)}
                                    />
                                </label>
                                <label className="field">
                                    <span>Preferred language</span>
                                    <select value={profile.learning_language} onChange={(event) => updateField('learning_language', event.target.value)}>
                                        {languages.map((language) => (
                                            <option key={language.id} value={language.code}>{language.name}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="field full-width">
                                    <span>Current proficiency level</span>
                                    <select value={profile.current_level_id || levels[0]?.id} onChange={(event) => updateField('current_level_id', Number(event.target.value))}>
                                        {levels.map((level) => (
                                            <option key={level.id} value={level.id}>{level.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div className="profile-actions">
                                <button type="button" onClick={() => navigate('/dashboard')} className="secondary-btn">Cancel</button>
                                <button type="submit" className="primary-btn">Save changes</button>
                            </div>
                        </form>
                    )}
                </main>
            </div>
        </div>
    )
}
