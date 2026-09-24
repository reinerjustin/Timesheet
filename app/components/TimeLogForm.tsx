"use client";

import { useState, useEffect } from "react";

type TimeLog = {
  id: number;
  workDate: string;
  timeIn: string;
  timeOut: string;
  totalMinutes: number;
  remarks: string | null;
};

export default function TimeLogForm({
  onSaved,
  editingLog,
  onCancelEdit,
}: {
  onSaved: () => void;
  editingLog: TimeLog | null;
  onCancelEdit: () => void;
}) {
  const [workDate, setWorkDate] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingLog) {
      setWorkDate(editingLog.workDate.slice(0, 10));
      setTimeIn(editingLog.timeIn);
      setTimeOut(editingLog.timeOut);
      setRemarks(editingLog.remarks ?? "");
    }
  }, [editingLog]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!workDate || !timeIn || !timeOut) {
      alert("Please enter the date, time in, and time out.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        editingLog
          ? `/api/timelogs/${editingLog.id}`
          : "/api/timelogs",
        {
          method: editingLog ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workDate,
            timeIn,
            timeOut,
            remarks,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to save time log.");
        return;
      }

      setWorkDate("");
      setTimeIn("");
      setTimeOut("");
      setRemarks("");
      onCancelEdit();
      onSaved();

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label 
          htmlFor="workDate"
          className="mb-2 block text-sm font-medium text-white"
        >
          Date
        </label>

        <input
          id="workDate"
          type="date"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
          required
          disabled={saving}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="timeIn"
            className="mb-2 block text-sm font-medium text-white"
          >
            Time In
          </label>

        <input
          id="timeIn"
          type="time"
          value={timeIn}
          onChange={(e) => setTimeIn(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
          required
          disabled={saving}
        />
        </div>

        <div>
          <label
            htmlFor="timeOut"
            className="mb-2 block text-sm font-medium text-white"
          >
            Time Out
          </label>

          <input
            id="timeOut"
            type="time"
            value={timeOut}
            onChange={(e) => setTimeOut(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
            required
            disabled={saving}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="remarks"
          className="mb-2 block text-sm font-medium text-white"
        >
          Remarks
        </label>

        <textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3}
          placeholder="Optional"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none" 
          disabled={saving}
        />
      </div>

      <button 
        type="submit" 
        disabled={saving}
        className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-black transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving 
          ? "Saving..."
          : editingLog
          ? "Update Time Log" 
          : "Save Time Log"}
      </button>

      {editingLog && (
        <button
          type="button"
          onClick={onCancelEdit}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 font-medium text-white transition hover:bg-zinc-700"
        >
            Cancel
        </button>
      )}

    </form>
  );
}