import { lazy } from 'react';
import { PATHS } from './paths';

const Index = lazy(() => import('../pages/Index'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const NotFound = lazy(() => import('../pages/NotFound'));
const PassDetails = lazy(() => import('../pages/PassDetails'));
const PassManagement = lazy(() => import('../pages/PassManagement'));
const Profile = lazy(() => import('../pages/Profile'));

export const routes = [
    { path: PATHS.INDEX, element: <Index /> },
    { path: PATHS.DASHBOARD, element: <Dashboard /> },
    { path: PATHS.NOT_FOUND, element: <NotFound /> },
    { path: PATHS.PASS_DETAILS, element: <PassDetails /> },
    { path: PATHS.PASS_MANAGEMENT, element: <PassManagement /> },
    { path: PATHS.PROFILE, element: <Profile /> },
];

// Helper type for routes
export type AppRoute = {
    path: string;
    element: React.ReactNode;
};

