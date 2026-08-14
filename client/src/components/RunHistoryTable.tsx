/* Signal Atelier dashboard: valid table structure for expandable run history rows. */
import { Fragment } from "react";
import { ChevronDown, Clock3, Download, RotateCcw, X } from "lucide-react";
import type { FailureRecord, RunRecord } from "@/api/client";
import StatusBadge from "@/components/StatusBadge";
import { duration, formatDate } from "@/lib/format";

type Props = {
  runs: RunRecord[];
  expandedRun: number | null;
  failures: Record<number, FailureRecord[]>;
  onToggle: (run: RunRecord) => void;
};

export default function RunHistoryTable({ runs, expandedRun, failures, onToggle }: Props) {
  async function refresh() { window.location.reload(); }
  function handleToggle(run: RunRecord) { onToggle(run); }
  function exportCsv() {
    const headers = ["Run ID", "Flow", "Status", "Environment", "Browser", "Total Tests", "Passed", "Failed", "Skipped", "Duration Seconds", "Timestamp", "AI Report", "Error Message"];
    const rows = runs.map((run) => [run.run_id, run.flow_name, run.status, run.env, run.browser, run.total, run.passed, run.failed, run.skipped, run.duration_seconds, run.timestamp, run.ai_report || "", run.error_message || ""]);
    const escapeCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `assuredia-run-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel-stack">
      <div className="section-heading"><div><div className="eyebrow">EVIDENCE LOG</div><h2>Run history</h2><p>The latest asynchronous results returned by the test engine.</p></div><div className="section-actions"><button className="secondary-button" onClick={exportCsv} type="button" disabled={!runs.length}><Download size={15} />Export CSV</button><button className="secondary-button" onClick={refresh} type="button"><RotateCcw size={15} />Refresh</button></div></div>
      <div className="table-card">
        {runs.length ? <div className="table-scroll"><table className="data-table runs-table"><thead><tr><th>Flow</th><th>Status</th><th>Coverage</th><th>Duration</th><th>Browser</th><th>Timestamp</th><th /></tr></thead><tbody>
          {runs.map((run) => <Fragment key={run.id}>
            <tr className={`table-row run-row ${expandedRun === run.id ? "expanded" : ""}`} onClick={() => void handleToggle(run)}>
              <td><strong>{run.flow_name}</strong><span className="mono subtle">RUN-{String(run.id).padStart(5, "0")}</span></td><td><StatusBadge status={run.status} /></td><td><span className="coverage"><strong>{run.passed}</strong>/{run.total}<small>{run.failed} failed · {run.skipped} skipped</small></span></td><td className="mono">{duration(run.duration_seconds)}</td><td><span className="browser-tag">{run.browser}</span></td><td className="time-cell">{formatDate(run.timestamp)}</td><td><ChevronDown size={16} className={expandedRun === run.id ? "rotate-180" : ""} /></td>
            </tr>
            {expandedRun === run.id && <tr className="run-detail-row"><td colSpan={7} className="run-expanded-cell"><div className="run-detail"><div className="run-detail-head"><div><span className="eyebrow">RUN REPORT / {run.env}</span><h3>{run.status === "FAIL" ? "Failure signal" : "All checks passed"}</h3></div>{run.ai_report && <div className="ai-report"><span className="sparkle-icon">✦</span><div><strong>AI report</strong><p>{run.ai_report}</p></div></div>}</div>{run.status === "FAIL" && <div className="failure-list">{failures[run.id]?.length ? failures[run.id].map((failure) => <div className="failure-item" key={failure.id}><X size={15} /><div><strong>{failure.test_name}</strong><span>{failure.error_message}</span></div></div>) : <div className="inline-loading"><span className="loader-ring small" />Loading failure details…</div>}</div>}</div></td></tr>}
          </Fragment>)}
        </tbody></table></div> : <div className="empty-state"><Clock3 size={22} /><strong>No run history</strong><span>Run a flow to create the first evidence record for this client.</span></div>}
      </div>
    </section>
  );
}
