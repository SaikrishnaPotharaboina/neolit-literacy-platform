import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const LearningPathPage = lazy(() => import('./pages/LearningPathPage'))
const UnitLessonPage = lazy(() => import('./pages/UnitLessonPage'))

function PageLoading() {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
}

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

function RootRedirect() {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>
    }

    return <Navigate to={user ? '/learning-path' : '/login'} replace />
}

function AppRoutes() {
    return (
        <Suspense fallback={<PageLoading />}>
            <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/learning-path"
                    element={
                        <ProtectedRoute>
                            <LearningPathPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lesson/:unit"
                    element={
                        <ProtectedRoute>
                            <UnitLessonPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/learning-path" replace />} />
            </Routes>
        </Suspense>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    )
}
