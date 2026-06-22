import { Route, Routes } from "react-router-dom";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import { AuthenticatedAppShell } from "@/components/layout/AuthenticatedAppShell";
import { About } from "@/pages/About";
import { Faq } from "@/pages/Faq";
import { Anomalies } from "@/pages/Anomalies";
import { Dashboard } from "@/pages/Dashboard";
import { Insights } from "@/pages/Insights";
import { InvestigationGraph } from "@/pages/InvestigationGraph";
import { InvestigationTimeline } from "@/pages/InvestigationTimeline";
import { JobDetail } from "@/pages/JobDetail";
import { Jobs } from "@/pages/Jobs";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { Login } from "@/pages/Login";
import { McpConnections } from "@/pages/McpConnections";
import { NotFound } from "@/pages/NotFound";
import { ResetPassword } from "@/pages/ResetPassword";
import { VerifyEmail } from "@/pages/VerifyEmail";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
import { Signup } from "@/pages/Signup";
import { Utilities } from "@/pages/Utilities";
import { UtilityDetail } from "@/pages/UtilityDetail";
import { DevIntegrationCheck } from "@/pages/DevIntegrationCheck";
import { RCAWithJira } from "@/pages/RCAWithJira";
import { RcaEvaluation } from "@/pages/RcaEvaluation";

export default function App() {
  return (
    <>
      <div data-ethereal-bg aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <EtherealShadow
          color="rgba(34, 211, 238, 0.18)"
          animation={{ scale: 45, speed: 55 }}
          noise={{ opacity: 0.25, scale: 1.2 }}
          sizing="fill"
          showTitle={false}
          style={{ position: "absolute", inset: 0 }}
        />
      </div>
      <div className="relative" style={{ zIndex: 1 }}>
    <AppErrorBoundary>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<AuthenticatedAppShell />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:jobId" element={<JobDetail />} />
          <Route path="jobs/:jobId/graph" element={<InvestigationGraph />} />
          <Route path="jobs/:jobId/timeline" element={<InvestigationTimeline />} />
          <Route path="anomalies" element={<Anomalies />} />
          <Route path="insights" element={<Insights />} />
          <Route path="reports" element={<Reports />} />
          <Route path="evaluation/rca" element={<RcaEvaluation />} />
          <Route path="rca" element={<RCAWithJira />} />
          <Route path="rca-jira" element={<RCAWithJira />} />
          <Route path="utilities" element={<Utilities />} />
          <Route path="utilities/:toolId" element={<UtilityDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/mcp-connections" element={<McpConnections />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<Faq />} />
          {import.meta.env.DEV ? (
            <Route
              path="dev/integration-check"
              element={<DevIntegrationCheck />}
            />
          ) : null}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
    </AppErrorBoundary>
      </div>
    </>
  );
}
