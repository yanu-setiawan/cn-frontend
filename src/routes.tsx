import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
const Loader = lazy(() => import("@/components/Loader"));
const WelcomePage = lazy(() => import("@/pages/WelcomePage"));
const CallMonitoring = lazy(() => import("@/pages/CallMonitoring"));

export default function Router() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          index
          element={
            // <PublicRoute>
            <WelcomePage />
            // </PublicRoute>
          }
        />
        <Route
          path="/monitoring"
          element={
            // <PublicRoute>
            <CallMonitoring />
            // </PublicRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
