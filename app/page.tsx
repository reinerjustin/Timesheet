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
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Time Logger
          </h1>

          <p className="mt-2 text-gray-500">
            Track your daily working hours.
          </p>
        </header>
  
        <section className="mb-8 rounded-xl bg-blue-600 p-6 text-white shadow-lg">
          <h2 className="text-lg font-medium">
            Total Hours Worked
          </h2>

          <p className="mt-3 text-5xl font-bold">
            {totalHours}h {remainingMinutes}m
          </p>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Add Time Log
          </h2>

          <TimeLogForm 
            onSaved={loadLogs}
            editingLog={editingLog}
            onCancelEdit={() => setEditingLog(null)}
          />
        </section>

        <section className="rounded-xl bg-white p-6 shadow-md">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
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