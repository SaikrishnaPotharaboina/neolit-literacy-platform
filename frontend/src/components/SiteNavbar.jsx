import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { learningApi } from '../services/learningApi'

const navigation = [
    { label: 'Home', to: '/learning-path' },
    { label: 'Learn', to: '/dashboard?section=learn' },
    { label: 'Letters', to: '/dashboard?section=letters' },
    { label: 'Leaderboard', to: '/dashboard?section=leaderboard' },
    { label: 'Quests', to: '/dashboard?section=quests' },
    { label: 'Games', to: '/games' },
    { label: 'Progress', to: '/dashboard?section=progress' },
    { label: 'Profile', to: '/profile' },
]

const supportedLanguageCodes = ['en', 'hi', 'kn', 'ta', 'te']

export default function SiteNavbar() {
    const { user, logout } = useAuth()
    const location = useLocation()
    const [languages, setLanguages] = useState([])
    const [profile, setProfile] = useState(null)
    const [selectedLanguageCode, setSelectedLanguageCode] = useState(localStorage.getItem('neolit_selected_language') || user?.learning_language || 'en')
    const [courseMenuOpen, setCourseMenuOpen] = useState(false)
    const [changingCourse, setChangingCourse] = useState(false)

    useEffect(() => {
        learningApi.getLanguages()
            .then((items) => setLanguages(items.filter((language) => supportedLanguageCodes.includes(language.code))))
            .catch(() => setLanguages([]))

        learningApi.getProfile()
            .then(setProfile)
            .catch(() => setProfile(null))
    }, [])

    useEffect(() => {
        if (user?.learning_language && supportedLanguageCodes.includes(user.learning_language)) {
            setSelectedLanguageCode(user.learning_language)
            localStorage.setItem('neolit_selected_language', user.learning_language)
        }
    }, [user?.learning_language])

    const selectedLanguageName = languages.find((language) => language.code === selectedLanguageCode)?.name || (selectedLanguageCode === 'en' ? 'English' : selectedLanguageCode.toUpperCase())
    const nativeLanguage = profile?.native_language || user?.native_language || 'English'

    const changeCourse = async (languageCode) => {
        if (languageCode === selectedLanguageCode) {
            setCourseMenuOpen(false)
            return
        }

        setChangingCourse(true)
        try {
            const profile = await learningApi.getProfile()
            await learningApi.updateProfile({
                ...profile,
                first_name: profile.first_name || user?.first_name || 'Learner',
                last_name: profile.last_name || user?.last_name || '',
                learning_language: languageCode,
            })
            localStorage.setItem('neolit_selected_language', languageCode)
            setSelectedLanguageCode(languageCode)
            setCourseMenuOpen(false)
            window.location.reload()
        } finally {
            setChangingCourse(false)
        }
    }

    return (
        <header className="site-navbar">
            <Link to="/learning-path" className="site-navbar-brand">NeoLit</Link>
            <nav className="site-navbar-links" aria-label="Main navigation">
                {navigation.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`site-navbar-link ${location.pathname + location.search === item.to ? 'active' : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="site-navbar-actions">
                <div className="site-language-pair">
                    <div className="site-language-card">
                        <small>NATIVE</small>
                        <strong>{nativeLanguage}</strong>
                    </div>
                    <div className="site-course-switcher">
                        <button type="button" className="site-course-button" onClick={() => setCourseMenuOpen((open) => !open)} aria-expanded={courseMenuOpen}>
                            <span className="site-course-icon">🌐</span>
                            <span><small>LEARNING</small><strong>{selectedLanguageName}</strong></span>
                            <span className="site-course-chevron">⌄</span>
                        </button>
                        {courseMenuOpen && (
                            <div className="site-course-menu">
                                <strong>MY COURSES</strong>
                                {languages.map((language) => (
                                    <button key={language.code} type="button" disabled={changingCourse} className={language.code === selectedLanguageCode ? 'selected' : ''} onClick={() => changeCourse(language.code)}>
                                        {language.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button type="button" className="site-navbar-logout" onClick={logout}>Logout</button>
            </div>
        </header>
    )
}
