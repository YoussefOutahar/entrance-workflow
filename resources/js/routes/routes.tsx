import { lazy } from 'react';
import { PATHS } from './paths';

const Auth = lazy(() => import('../pages/Auth/Auth'));

const Index = lazy(() => import('../pages/Index'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const PassManagement = lazy(() => import('../pages/PassManagement'));
const PassDetails = lazy(() => import('../pages/PassDetails'));
const CreatePass = lazy(() => import('../pages/CreatePass'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

export const authRoutes = [
    { path: PATHS.AUTH, element: <Auth /> },
];

export const routes: AppRoute[] = [
    { path: PATHS.INDEX, element: <Index /> },
    { path: PATHS.DASHBOARD, element: <Dashboard /> },
    { path: PATHS.PASS_MANAGEMENT, element: <PassManagement /> },
    { path: PATHS.PASS_DETAILS, element: <PassDetails /> },
    { path: PATHS.CREATE_PASS, element: <CreatePass /> },
    { path: PATHS.PROFILE, element: <Profile /> },
    { path: PATHS.NOT_FOUND, element: <NotFound /> },
];

// Helper type for routes
export type AppRoute = {
    path: string;
    element: React.ReactNode;
    role?: string;
};

