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
        "Delete this time log?"
      );

      if (!confirmed) return;

      const response = await fetch(
        `/api/timelogs/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        alert("Failed to delete.");
        return;
      }

      onDeleted();
    }
  
    return (
      <div className="rounded-xl bg-white shadow-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Time Logs
          </h2>
        </div>
        
  
        {logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No time logs yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-blue-600 text-white">
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
  
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr 
                  key={log.id}
                  className="hover:bg-gray-50 transition-colors"
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
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      {formatHours(log.totalMinutes)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {log.remarks || "-"}
                  </td>

                  <td className="space-x-2 px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit(log)}
                      className="rounded-md bg-yellow-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-yellow-600">
                        Edit
                    </button>

                    <button
                      onClick={() => handleDelete(log.id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700">
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