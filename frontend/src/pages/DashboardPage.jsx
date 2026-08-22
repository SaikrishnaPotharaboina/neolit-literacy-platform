import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8 flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-primary-600">NeoLit</p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, {user?.name || 'Learner'}!</h1>
                    </div>
                    <button
                        onClick={logout}
                        className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Log out
                    </button>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">Current level</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{user?.level || 1}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">XP</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{user?.xp || 0}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">Streak</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">🔥 {user?.streak || 0} days</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
