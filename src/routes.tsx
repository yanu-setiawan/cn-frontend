import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
const Loader = lazy(() => import("@/components/Loader"));
const WelcomePage = lazy(() => import("@/pages/WelcomePage"));

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
        {/* <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
         
        </Route> */}
      </Routes>
    </Suspense>
  );
}
