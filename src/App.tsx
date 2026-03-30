import { Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Anomalies } from "@/pages/Anomalies";
import { Dashboard } from "@/pages/Dashboard";
import { Insights } from "@/pages/Insights";
import { JobDetail } from "@/pages/JobDetail";
import { Jobs } from "@/pages/Jobs";
import { Login } from "@/pages/Login";
import { NotFound } from "@/pages/NotFound";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
import { Signup } from "@/pages/Signup";
import { Utilities } from "@/pages/Utilities";
import { UtilityDetail } from "@/pages/UtilityDetail";
import { DevIntegrationCheck } from "@/pages/DevIntegrationCheck";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        <Route path="anomalies" element={<Anomalies />} />
        <Route path="insights" element={<Insights />} />
        <Route path="reports" element={<Reports />} />
        <Route path="utilities" element={<Utilities />} />
        <Route path="utilities/:toolId" element={<UtilityDetail />} />
        <Route path="settings" element={<Settings />} />
        {import.meta.env.DEV ? (
          <Route
            path="dev/integration-check"
            element={<DevIntegrationCheck />}
          />
        ) : null}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
