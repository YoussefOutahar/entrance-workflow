import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AppLayout } from "./layout/AppLayout";

import { authRoutes, routes } from "./routes/routes";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { Suspense } from "react";
import LoadingSpinner from "./components/layout/LoadingSpinner";
import AuthGuard from "./AuthGuard";
import { AuthProvider } from "./contexts/AuthContext";
import { PATHS } from "./routes/paths";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />

            <DarkModeProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            {authRoutes.map(({ path, element }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    element={
                                        <Suspense
                                            fallback={
                                                <LoadingSpinner
                                                    size="lg"
                                                    fullScreen
                                                    variant="primary"
                                                />
                                            }
                                        >
                                            {element}
                                        </Suspense>
                                    }
                                />
                            ))}

                            {routes.map(({ path, element, role }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    element={
                                        <AuthGuard>
                                            <AppLayout>
                                                <Suspense
                                                    fallback={
                                                        <LoadingSpinner
                                                            size="lg"
                                                            container
                                                            variant="primary"
                                                        />
                                                    }
                                                >
                                                    {element}
                                                </Suspense>
                                            </AppLayout>
                                        </AuthGuard>
                                    }
                                />
                            ))}

                            <Route
                                path="/"
                                element={
                                    <Navigate to={PATHS.DASHBOARD} replace />
                                }
                            />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </DarkModeProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
