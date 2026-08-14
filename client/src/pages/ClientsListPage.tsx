/* Signal Atelier: the overview makes system health scannable before the client table asks for action. */
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronRight, ExternalLink, Filter, Play, Plus, Search, Server, SlidersHorizontal, Sparkles, TimerReset, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { clientApi, getApiError, type ClientSummary, type Flow } from "@/api/client";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { TableSkeleton, PageLoader } from "@/components/Loading";
import { relativeTime } from "@/lib/format";

function Metric({ icon: Icon, label, value, tone, note }: { icon: typeof Users; label: string; value: string | number; tone?: string; note: string }) {
  return <div className={`metric-card ${tone || ""}`}><div className="metric-top"><span className="metric-icon"><Icon size={16} /></span><span className="metric-label">{label}</span></div><strong>{value}</strong><span className="metric-note">{note}</span></div>;
}

function RunModal({ client, open, onClose, onStarted }: { client: ClientSummary | null; open: boolean; onClose: () => void; onStarted: () => void }) {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [running, setRunning] = useState(false);
  useEffect(() => { if (open && client) { setLoading(true); clientApi.detail(client.id).then((response) => { setFlows(response.data.flows); setSelected(response.data.flows[0] ? String(response.data.flows[0].id) : ""); }).catch((error) => toast.error(getApiError(error))).finally(() => setLoading(false)); } }, [client, open]);
  async function run() { if (!client || !selected) return; setRunning(true); try { await clientApi.runFlow(client.id, Number(selected)); toast.success("Run started", { description: `${client.client_name} is now running the selected flow.` }); onStarted(); onClose(); } catch (error) { toast.error(getApiError(error)); } finally { setRunning(false); } }
  return <Modal open={open} onClose={onClose} title="Run a flow now" description={client ? `Start an asynchronous run for ${client.client_name}.` : undefined}>
    {loading ? <PageLoader /> : flows.length ? <><label className="field-label" htmlFor="run-flow">Flow to run</label><select id="run-flow" className="select-field" value={selected} onChange={(event) => setSelected(event.target.value)}>{flows.map((flow) => <option key={flow.id} value={flow.id}>{flow.flow_name}{flow.is_running ? " · already running" : ""}</option>)}</select><div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={run} disabled={!selected || running}>{running ? "Starting…" : "Start run"}<Play size={15} /></button></div></> : <div className="empty-state compact"><Sparkles size={20} /><strong>No flows available</strong><span>Add a flow in the client workspace before running it.</span><button className="secondary-button" onClick={onClose}>Close</button></div>}
  </Modal>;
}

export default function ClientsListPage({ overview = false }: { overview?: boolean }) {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "attention">("all");
  const [runClient, setRunClient] = useState<ClientSummary | null>(null);
  const navigate = useNavigate();

  async function load() { setLoading(true); try { const response = await clientApi.list(); setClients(response.data || []); } catch (error) { toast.error(getApiError(error, "Unable to load clients from the API.")); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  const visibleClients = useMemo(() => clients.filter((client) => { const matchesQuery = client.client_name.toLowerCase().includes(query.toLowerCase()) || client.base_url.toLowerCase().includes(query.toLowerCase()); const matchesFilter = filter === "all" || (filter === "active" && client.is_active) || (filter === "attention" && client.last_run_status === "FAIL"); return matchesQuery && matchesFilter; }), [clients, filter, query]);
  const activeCount = clients.filter((client) => client.is_active).length;
  const passingCount = clients.filter((client) => client.last_run_status === "PASS").length;
  const failingCount = clients.filter((client) => client.last_run_status === "FAIL").length;

  return <div className="content-stack">
    {overview && <section className="signal-hero"><div><div className="eyebrow accent-eyebrow"><span className="pulse-dot" />SYSTEM PULSE / 01</div><h2>Every client path,<br /><span>one clear signal.</span></h2><p>Monitor active environments, trigger flows, and move from a failed check to its cause without leaving the workspace.</p><div className="hero-actions"><Link className="primary-button" to="/clients/new"><Plus size={16} />Add client</Link><button className="ghost-button" onClick={load}><TimerReset size={16} />Refresh signal</button></div></div><div className="hero-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core"><ShieldGlyph /><span>API<br />READY</span></div><div className="orbit-chip chip-one">{activeCount} active</div><div className="orbit-chip chip-two">{passingCount} passing</div></div></section>}
    <section className="metric-grid"><Metric icon={Users} label="Total clients" value={clients.length} note="registered environments" /><Metric icon={Server} label="Active paths" value={activeCount} note={`${clients.length ? Math.round((activeCount / clients.length) * 100) : 0}% of workspace`} tone="metric-blue" /><Metric icon={Sparkles} label="Passing" value={passingCount} note="latest known signal" tone="metric-green" /><Metric icon={SlidersHorizontal} label="Needs attention" value={failingCount} note="failed latest run" tone={failingCount ? "metric-red" : ""} /></section>
    <section className="section-heading"><div><div className="eyebrow">CLIENT REGISTRY</div><h2>{overview ? "Your test environments" : "All clients"}</h2><p>{overview ? "A live index of the browser paths under observation." : "Search, inspect, and operate every registered client."}</p></div><Link className="secondary-button" to="/clients/new"><Plus size={16} />New client</Link></section>
    <section className="table-card"><div className="table-toolbar"><div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or URL" aria-label="Search clients" /></div><div className="toolbar-actions"><button className={`filter-button ${filter === "all" ? "selected" : ""}`} onClick={() => setFilter("all")}><Filter size={15} />All <span>{clients.length}</span></button><button className={`filter-button ${filter === "active" ? "selected" : ""}`} onClick={() => setFilter("active")}>Active <span>{activeCount}</span></button><button className={`filter-button ${filter === "attention" ? "selected" : ""}`} onClick={() => setFilter("attention")}>Attention <span>{failingCount}</span></button></div></div>
      {loading ? <TableSkeleton /> : visibleClients.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Client</th><th>Environment</th><th>Last signal</th><th>Last run</th><th className="align-right">Actions</th></tr></thead><tbody>{visibleClients.map((client) => <tr key={client.id} className="table-row" onClick={() => navigate(`/clients/${client.id}`)}><td><div className="client-cell"><span className={`client-dot ${client.is_active ? "online" : ""}`} /><div><strong>{client.client_name}</strong><span className="mono subtle">ID-{String(client.id).padStart(4, "0")}</span></div></div></td><td><div className="environment-cell"><span className="browser-tag">{client.browser}</span><span className="headless-tag">{client.headless ? "headless" : "headed"}</span></div><span className="url-line">{client.base_url}</span></td><td>{client.last_run_status === "PASS" ? <StatusBadge status="PASS" /> : client.last_run_status === "FAIL" ? <StatusBadge status="FAIL" /> : <StatusBadge status="NEVER" />}</td><td><span className="time-cell">{relativeTime(client.last_run_timestamp)}</span></td><td className="align-right"><div className="row-actions"><button className="run-button" onClick={(event) => { event.stopPropagation(); setRunClient(client); }}><Play size={13} />Run</button><Link to={`/clients/${client.id}`} className="icon-button row-detail" onClick={(event) => event.stopPropagation()} aria-label={`Open ${client.client_name}`}><ArrowUpRight size={16} /></Link></div></td></tr>)}</tbody></table></div> : <div className="empty-state"><Sparkles size={22} /><strong>{clients.length ? "No matching clients" : "No clients connected"}</strong><span>{clients.length ? "Try a different search or filter." : "The API returned an empty client registry. Add your first environment to begin."}</span>{!clients.length && <Link className="primary-button" to="/clients/new"><Plus size={15} />Add first client</Link>}</div>}
      {!loading && clients.length > 0 && <div className="table-footer"><span>Showing {visibleClients.length} of {clients.length} clients</span><span className="mono">SYNC / {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>}
    </section>
    <RunModal client={runClient} open={Boolean(runClient)} onClose={() => setRunClient(null)} onStarted={load} />
  </div>;
}

function ShieldGlyph() { return <svg width="42" height="48" viewBox="0 0 42 48" fill="none" aria-hidden="true"><path d="M21 2.5 38 9v13.1c0 10.8-6.8 19.3-17 23.4C10.8 41.4 4 32.9 4 22.1V9l17-6.5Z" stroke="currentColor" strokeWidth="1.4" /><path d="m12.5 23.8 5.7 5.5 11.3-12" stroke="#4C7DFF" strokeWidth="2.6" strokeLinecap="square" /></svg>; }
