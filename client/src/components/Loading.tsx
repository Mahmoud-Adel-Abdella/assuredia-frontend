/* Signal Atelier: loading state is a soft placeholder, not a blank page. */
export function TableSkeleton({ rows = 5 }: { rows?: number }) { return <div className="skeleton-table">{Array.from({ length: rows }).map((_, index) => <div className="skeleton-row" key={index}><span /><span /><span /><span /><span /></div>)}</div>; }
export function PageLoader() { return <div className="page-loader"><span className="loader-ring" /><span>Reading the signal…</span></div>; }
