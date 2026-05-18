import { useState, useEffect, useRef } from "react";

function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const reset = () => { setRunning(false); setElapsed(0); };

  return (
    <div className="stopwatch-card">
      <div className="stopwatch-label">Stopwatch</div>
      <div className="stopwatch-time">{fmt(elapsed)}</div>
      <div className="stopwatch-controls">
        <button className={`sw-btn ${running ? "sw-pause" : "sw-play"}`} onClick={() => setRunning(!running)}>
          {running ? "⏸ Pause" : "▶ Start"}
        </button>
        <button className="sw-btn sw-reset" onClick={reset}>↺ Reset</button>
      </div>
    </div>
  );
}

export default Stopwatch;