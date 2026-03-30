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
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
