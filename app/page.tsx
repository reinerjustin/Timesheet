"use client";

import { useEffect, useState } from "react";
import TimeLogForm from "./components/TimeLogForm";
import TimeLogTable from "./components/TimeLogTable";

type TimeLog = {
  id: number;
  workDate: string;
  timeIn: string;
  timeOut: string;
  totalMinutes: number;
  remarks: string | null;
};

export default function Home() {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLog, setEditingLog] = useState<TimeLog | null>(null);

  async function loadLogs() {
    try {
      const response = await fetch("/api/timelogs");
      const data = await response.json();

      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const totalMinutes = logs.reduce(
    (total, log) => total + log.totalMinutes,
    0
  );

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <main>
      <h1>Time Logger</h1>

      <section>
        <h2>Total Hours</h2>

        <p>
          {totalHours}h {remainingMinutes}m
        </p>
      </section>

      <section>
        <h2>Add Time Log</h2>

        <TimeLogForm 
          onSaved={loadLogs}
          editingLog={editingLog}
          onCancelEdit={() => setEditingLog(null)}
        />
      </section>

      <section>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TimeLogTable 
            logs={logs} 
            onEdit={setEditingLog}
            onDeleted={loadLogs}
          />
        )}
      </section>
    </main>
  );
}