type TimeLog = {
    id: number;
    workDate: string;
    timeIn: string;
    timeOut: string;
    totalMinutes: number;
    remarks: string | null;
  };
  
  export default function TimeLogTable({
    logs,
    onEdit,
    onDeleted,
  }: {
    logs: TimeLog[];
    onEdit: (log: TimeLog) => void;
    onDeleted: () => void;
  }) {
    function formatDate(date: string) {
      return new Date(date).toLocaleDateString();
    }
  
    function formatHours(minutes: number) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
  
      return `${hours}h ${mins}m`;
    }

    async function handleDelete(id: number) {
      const confirmed = confirm(
        "Are you sure you want to delete this time log?"
      );

      if (!confirmed) return;

      try {
        const response = await fetch(
          `/api/timelogs/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          alert("Failed to delete time log.");
          return;
        }

        onDeleted();
      } catch (error) {
        alert("Something went wrong while deleting.");
      }
    }
  
    return (
      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl">
        <div className="border-b border-zinc-700 px-6 py-5">
          <h2 className="text-2xl font-semibold text-orange-400">
            Time Logs
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Your recorded working hours
          </p>
        </div>
      
        {logs.length === 0 ? (
          <div className="p-6 py-12 text-center">
            <p className="text-gray-400">
              No time logs yet.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first time log above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-orange-500 text-black">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Time In
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Time Out
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Remarks
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
  
            <tbody className="divide-y divide-zinc-700">
              {logs.map((log) => (
                <tr 
                  key={log.id}
                  className="bg-zinc-900 text-white transition hover:bg-zinc-800"
                >
                  <td className="px-6 py-4">
                    {formatDate(log.workDate)}
                  </td>

                  <td className="px-6 py-4">
                    {log.timeIn}
                  </td>

                  <td className="px-6 py-4">
                    {log.timeOut}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full border border-orange-500 bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-400">
                      {formatHours(log.totalMinutes)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-zinc-300">
                    {log.remarks || "-"}
                  </td>

                  <td className="space-x-2 px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit(log)}
                      className="rounded-md bg-orange-500 px-3 py-1 text-sm font-medium text-black transition hover:bg-orange-400">
                        Edit
                    </button>

                    <button
                      onClick={() => handleDelete(log.id)}
                      className="rounded-md border border-red-500 bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-500">
                        Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    );
  }