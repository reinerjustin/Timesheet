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
    <main className="min-h-screen bg-black py-12 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-8 border-b border-zinc-700 pb-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-orange-400">
            Time Logger
          </h1>

          <p className="mt-2 text-gray-400">
            Track your daily working hours.
          </p>
        </header>
  
        <section className="mb-10 rounded-xl bg-orange-500 p-6 text-black shadow-xl">
          <h2 className="text-lg font-medium">
            Total Hours Worked
          </h2>

          <p className="mt-3 text-6xl font-extrabold tracking-tight">
            {totalHours}h {remainingMinutes}m
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-orange-400">
            Add Time Log
          </h2>

          <TimeLogForm 
            onSaved={loadLogs}
            editingLog={editingLog}
            onCancelEdit={() => setEditingLog(null)}
          />
        </section>

        <section className="rounded-xl border border-zinc-700 bg-zinc-90 p-6 shadow-lg">
          {loading ? (
            <div className="py-12 text-center text-gray-400">
              Loading time logs...
            </div>
          ) : (
            <TimeLogTable 
              logs={logs} 
              onEdit={setEditingLog}
              onDeleted={loadLogs}
            />
          )}
        </section>
      </div>
    </main>
  );
}