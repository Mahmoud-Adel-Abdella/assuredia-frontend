/* Signal Atelier dashboard: local error boundary prevents an isolated history render failure from blanking the workspace. */
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; resetKey: string | number };
type State = { hasError: boolean };

export default class RunHistoryBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(): State { return { hasError: true }; }
  componentDidUpdate(previous: Props) {
    if (previous.resetKey !== this.props.resetKey && this.state.hasError) this.setState({ hasError: false });
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <section className="table-card"><div className="empty-state"><AlertTriangle size={22} /><strong>Run history could not be displayed</strong><span>Refresh this client workspace and try again. Your run records remain unchanged.</span><button className="secondary-button" type="button" onClick={() => this.setState({ hasError: false })}><RotateCcw size={15} />Try again</button></div></section>;
  }
}
