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
  }: {
    logs: TimeLog[];
  }) {
    function formatDate(date: string) {
      return new Date(date).toLocaleDateString();
    }
  
    function formatHours(minutes: number) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
  
      return `${hours}h ${mins}m`;
    }
  
    return (
      <div>
        <h2>Time Logs</h2>
  
        {logs.length === 0 ? (
          <p>No time logs yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Total</th>
                <th>Remarks</th>
              </tr>
            </thead>
  
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDate(log.workDate)}</td>
                  <td>{log.timeIn}</td>
                  <td>{log.timeOut}</td>
                  <td>{formatHours(log.totalMinutes)}</td>
                  <td>{log.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }