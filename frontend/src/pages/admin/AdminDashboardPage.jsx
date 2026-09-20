import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { learningApi } from '../../services/learningApi'
import AdminCreateAccount from '../../components/AdminCreateAccount'
import AdminUserDialog from '../../components/AdminUserDialog'

const sidebarItems = [
    { label: 'Dashboard', target: 'admin-overview' },
    { label: 'Users', target: 'admin-users' },
    { label: 'Courses', target: 'admin-section-content' },
    { label: 'Lessons', target: 'admin-section-content' },
    { label: 'Games', target: 'admin-section-content' },
    { label: 'Rewards', target: 'admin-section-content' },
    { label: 'Analytics', target: 'admin-section-content' },
    { label: 'Settings', target: 'admin-section-content' },
]

const defaultUsers = []
const USERS_PER_PAGE = 6

function statusStyle(status) {
    if (status === 'Active') return 'admin-status active'
    if (status === 'Blocked') return 'admin-status blocked'
    return 'admin-status inactive'
}

export default function AdminDashboardPage() {
    const { user, logout } = useAuth()
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [users, setUsers] = useState(defaultUsers)
    const [overview, setOverview] = useState(null)
    const [activeSection, setActiveSection] = useState('Dashboard')
    const [showCreateAccount, setShowCreateAccount] = useState(false)
    const [deletingUserId, setDeletingUserId] = useState(null)
    const [userDialog, setUserDialog] = useState(null)
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [loadingOverview, setLoadingOverview] = useState(true)
    const [curriculum, setCurriculum] = useState([])
    const [loadingCurriculum, setLoadingCurriculum] = useState(true)
    const userName = user?.first_name || user?.name || 'Admin'

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await learningApi.getAdminUsers()
                setUsers(data)
            } catch (error) {
                setUsers([])
            } finally {
                setLoadingUsers(false)
            }
        }

        loadUsers()
    }, [])

    useEffect(() => {
        const loadCurriculum = async () => {
            try {
                setCurriculum(await learningApi.getCurriculum())
            } catch (error) {
                setCurriculum([])
            } finally {
                setLoadingCurriculum(false)
            }
        }

        loadCurriculum()
    }, [])

    useEffect(() => {
        const loadOverview = async () => {
            try {
                setOverview(await learningApi.getAdminOverview())
            } catch (error) {
                setOverview(null)
            } finally {
                setLoadingOverview(false)
            }
        }

        loadOverview()
    }, [])

    const filteredUsers = useMemo(() => {
        const term = search.toLowerCase().trim()
        if (!term) return users
        return users.filter((person) => person.name.toLowerCase().includes(term) || person.email.toLowerCase().includes(term))
    }, [search, users])

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE))
    const visibleUsers = useMemo(() => {
        const start = (currentPage - 1) * USERS_PER_PAGE
        return filteredUsers.slice(start, start + USERS_PER_PAGE)
    }, [currentPage, filteredUsers])

    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages))
    }, [totalPages])

    const statCards = [
        { label: 'New users today', value: overview?.new_users_today, tone: 'cyan' },
        { label: 'Active users', value: overview?.active_users, tone: 'green' },
        { label: 'Study time', value: overview ? `${Math.round(overview.study_time_seconds / 60)} min` : null, tone: 'purple', raw: true },
        { label: 'Lessons completed', value: overview?.lessons_completed, tone: 'gold' },
        { label: 'XP earned', value: overview?.xp_earned, tone: 'cyan' },
        { label: 'Game activity', value: overview?.game_activity, tone: 'green' },
    ]

    const activeLearners = users.filter((person) => person.status === 'Active').slice(0, 10)
    const topXpLearners = [...users].sort((first, second) => second.xp - first.xp).slice(0, 10)

    const handleDeleteUser = async (name, id) => {
        const confirmed = window.confirm(`Delete ${name}? This action cannot be undone.`)
        if (!confirmed) return

        setDeletingUserId(id)
        try {
            await learningApi.deleteAdminUser(id)
            setUsers((current) => current.filter((person) => person.id !== id))
        } catch (error) {
            window.alert(error.response?.data?.detail || 'The user could not be deleted.')
        } finally {
            setDeletingUserId(null)
        }
    }

    const handleSidebarNavigation = (item) => {
        setActiveSection(item.label)
        window.setTimeout(() => document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
    }

    const allLessons = curriculum.flatMap((course) => course.lessons.map((lesson) => ({
        ...lesson,
        courseTitle: course.title,
    })))

    const renderAdminSection = () => {
        if (activeSection === 'Dashboard' || activeSection === 'Users') return null

        if (activeSection === 'Courses') {
            return (
                <div className="admin-section-list">
                    {loadingCurriculum ? <p className="admin-section-empty">Loading courses...</p> : curriculum.map((course) => (
                        <article key={course.id} className="admin-section-item">
                            <div><strong>{course.title}</strong><small>{course.description || 'No description provided'}</small></div>
                            <span>{course.lessons.length} lessons</span>
                        </article>
                    ))}
                    {!loadingCurriculum && curriculum.length === 0 && <p className="admin-section-empty">No courses found in the database.</p>}
                </div>
            )
        }

        if (activeSection === 'Lessons') {
            return (
                <div className="admin-section-list">
                    {loadingCurriculum ? <p className="admin-section-empty">Loading lessons...</p> : allLessons.slice(0, 30).map((lesson) => (
                        <article key={lesson.id} className="admin-section-item">
                            <div><strong>{lesson.title}</strong><small>{lesson.courseTitle}</small></div>
                            <span>{lesson.lesson_type}</span>
                        </article>
                    ))}
                    {!loadingCurriculum && allLessons.length === 0 && <p className="admin-section-empty">No lessons found in the database.</p>}
                </div>
            )
        }

        if (activeSection === 'Games') {
            return <div className="admin-section-metrics"><strong>{overview?.game_activity || 0}</strong><span>Total game activity recorded from learners</span><strong>{overview?.game_activity_today || 0}</strong><span>Game activities today</span></div>
        }

        if (activeSection === 'Rewards') {
            return <div className="admin-section-metrics"><strong>{overview?.xp_earned || 0}</strong><span>Total XP earned by learners</span><strong>{users.reduce((total, person) => total + Number(person.xp || 0), 0)}</strong><span>Current learner XP</span></div>
        }

        if (activeSection === 'Analytics') {
            return <div className="admin-section-metrics"><strong>{overview?.active_users || 0}</strong><span>Active users today</span><strong>{overview?.average_completion || 0}%</strong><span>Average lesson completion</span><strong>{overview?.study_time_seconds ? `${Math.round(overview.study_time_seconds / 60)} min` : '0 min'}</strong><span>Validated study time</span></div>
        }

        return <div className="admin-section-settings"><strong>Admin account</strong><span>{user?.email}</span><strong>Access</strong><span>Administrator-only dashboard</span></div>
    }

    const handleAccountCreated = (createdUser) => {
        setUsers((current) => [
            {
                id: createdUser.id,
                name: `${createdUser.first_name} ${createdUser.last_name}`.trim(),
                email: createdUser.email,
                role: createdUser.role,
                is_active: true,
                xp: 0,
                status: 'Inactive',
            },
            ...current,
        ])
    }

    const handleUserSaved = (updatedUser) => {
        setUsers((current) => current.map((person) => person.id === updatedUser.id
            ? { ...person, name: `${updatedUser.first_name} ${updatedUser.last_name}`.trim(), email: updatedUser.email, role: updatedUser.role }
            : person))
    }

    const handleToggleUser = async (person) => {
        try {
            const result = await learningApi.updateAdminUserStatus(person.id)
            setUsers((current) => current.map((item) => item.id === person.id
                ? { ...item, is_active: result.is_active, status: result.is_active ? item.status : 'Inactive' }
                : item))
        } catch (error) {
            window.alert(error.response?.data?.detail || 'Could not update account status.')
        }
    }

    const handleResetPassword = async (person) => {
        const password = window.prompt(`Enter a new password for ${person.name} (minimum 8 characters):`)
        if (password === null) return
        if (password.length < 8) {
            window.alert('Password must be at least 8 characters long.')
            return
        }
        try {
            await learningApi.resetAdminUserPassword(person.id, password)
            window.alert('Password reset successfully.')
        } catch (error) {
            window.alert(error.response?.data?.detail || 'Could not reset password.')
        }
    }

    return (
        <div className="admin-dashboard-page">
            <aside className="admin-sidebar-shell">
                <div className="admin-sidebar-brand">
                    <div className="admin-logo-box">N</div>
                    <div>
                        <strong>NeoLit</strong>
                        <small>Admin panel</small>
                    </div>
                </div>

                <nav className="admin-sidebar-nav" aria-label="Admin navigation">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            className={`admin-side-item ${activeSection === item.label ? 'selected' : ''}`}
                            aria-current={activeSection === item.label ? 'page' : undefined}
                            onClick={() => handleSidebarNavigation(item)}
                        >
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="admin-main-shell">
                <header className="admin-top-header">
                    <div>
                        <p className="admin-kicker">Admin</p>
                        <h1>Platform Overview</h1>
                    </div>
                    <div className="admin-header-user">
                        <span className="admin-header-pill">Admin ▼</span>
                        <span className="admin-user-name">{userName}</span>
                        <button type="button" className="admin-create-account-button" onClick={() => setShowCreateAccount(true)}>+ Create account</button>
                        <button type="button" className="admin-logout-button" onClick={logout}>Log out</button>
                    </div>
                </header>

                {activeSection !== 'Dashboard' && activeSection !== 'Users' && (
                    <section id="admin-section-content" className="admin-section-panel">
                        <div className="admin-panel-header"><h2>{activeSection}</h2><span className="admin-section-badge">Live data</span></div>
                        {renderAdminSection()}
                    </section>
                )}

                <section id="admin-overview" className="admin-summary-grid">
                    {statCards.map((card) => (
                        <article key={card.label} className={`admin-summary-card ${card.tone}`}>
                            <strong>{loadingOverview ? '...' : card.raw ? card.value : Number(card.value || 0).toLocaleString()}</strong>
                            <span>{card.label}</span>
                        </article>
                    ))}
                </section>

                <section className="admin-activity-panel admin-activity-leaderboard">
                    <div className="admin-panel-header">
                        <div><p className="admin-kicker">Live learner data</p><h2>User Activity</h2></div>
                        <span className="admin-section-badge">Top 10</span>
                    </div>

                    <div className="admin-activity-columns">
                        <div className="admin-activity-column">
                            <h3>Active learners</h3>
                            {activeLearners.length ? activeLearners.map((person, index) => (
                                <div key={person.id} className="admin-activity-learner">
                                    <strong className="admin-rank-number">{index + 1}</strong>
                                    <span className="admin-learner-avatar">{person.name.charAt(0).toUpperCase()}</span>
                                    <span className="admin-activity-learner-name">{person.name}</span>
                                    <span className="admin-activity-learner-score">🔥 {person.streak_days || 0}</span>
                                </div>
                            )) : <p className="admin-section-empty">No learners active today.</p>}
                        </div>
                        <div className="admin-activity-column">
                            <h3>Top XP learners</h3>
                            {topXpLearners.length ? topXpLearners.map((person, index) => (
                                <div key={person.id} className="admin-activity-learner">
                                    <strong className="admin-rank-number">{index + 1}</strong>
                                    <span className="admin-learner-avatar">{person.name.charAt(0).toUpperCase()}</span>
                                    <span className="admin-activity-learner-name">{person.name}</span>
                                    <span className="admin-activity-learner-score">{person.xp} XP</span>
                                </div>
                            )) : <p className="admin-section-empty">No learner data available.</p>}
                        </div>
                    </div>
                </section>

                <section id="admin-users" className="admin-user-table-panel">
                    <div className="admin-table-head">
                        <h2>Recent Users</h2>
                        <div className="admin-search-box">
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search"
                                aria-label="Search users"
                            />
                        </div>
                    </div>

                    <div className="admin-user-table-wrap">
                        <table className="admin-user-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Learner</th>
                                    <th>XP</th>
                                    <th>Streak</th>
                                    <th>Study time</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingUsers ? (
                                    <tr>
                                        <td colSpan="8" className="admin-empty-row">Loading users...</td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="admin-empty-row">No users found.</td>
                                    </tr>
                                ) : visibleUsers.map((person, index) => (
                                    <tr key={person.id}>
                                        <td><strong className="admin-rank-number">{((currentPage - 1) * USERS_PER_PAGE) + index + 1}</strong></td>
                                        <td>
                                            <div className="admin-learner-cell">
                                                <span className="admin-learner-avatar">{person.name.charAt(0).toUpperCase()}</span>
                                                <span>
                                                    <strong>{person.name}</strong>
                                                    <small>{person.email}</small>
                                                </span>
                                            </div>
                                        </td>
                                        <td>{person.xp}</td>
                                        <td><span className="admin-streak-value">🔥 {person.streak_days || 0}</span></td>
                                        <td>{Math.round((person.study_time_seconds || 0) / 60)} min</td>
                                        <td>{person.role || 'user'}</td>
                                        <td><span className={statusStyle(person.status)}>{person.status}</span></td>
                                        <td>
                                            <div className="admin-row-actions">
                                                <button type="button" className="admin-action-link" onClick={() => setUserDialog({ user: person, mode: 'view' })}>View</button>
                                                <button type="button" className="admin-action-link" onClick={() => setUserDialog({ user: person, mode: 'edit' })}>Edit</button>
                                                <button type="button" className="admin-action-link" onClick={() => handleToggleUser(person)}>{person.is_active ? 'Disable' : 'Enable'}</button>
                                                <button type="button" className="admin-action-link" onClick={() => handleResetPassword(person)}>Reset password</button>
                                                <button type="button" className="admin-action-link" onClick={() => setUserDialog({ user: person, mode: 'progress' })}>Progress</button>
                                                <button type="button" className="admin-action-link" onClick={() => setUserDialog({ user: person, mode: 'history' })}>History</button>
                                                <button type="button" className="admin-action-link" onClick={() => setUserDialog({ user: person, mode: 'games' })}>Games</button>
                                                <button type="button" className="admin-action-danger" disabled={deletingUserId === person.id} onClick={() => handleDeleteUser(person.name, person.id)}>
                                                    {deletingUserId === person.id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {!loadingUsers && filteredUsers.length > 0 && (
                        <div className="admin-pagination" aria-label="User pages">
                            <span className="admin-pagination-range">
                                {(currentPage - 1) * USERS_PER_PAGE + 1}-{Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
                            </span>
                            <button
                                type="button"
                                className="admin-page-button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    className={`admin-page-button ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                className="admin-page-button"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </section>
            </main>
            {showCreateAccount && (
                <AdminCreateAccount
                    onClose={() => setShowCreateAccount(false)}
                    onCreated={handleAccountCreated}
                />
            )}
            {userDialog && (
                <AdminUserDialog
                    user={userDialog.user}
                    mode={userDialog.mode}
                    onClose={() => setUserDialog(null)}
                    onSaved={handleUserSaved}
                />
            )}
        </div>
    )
}
