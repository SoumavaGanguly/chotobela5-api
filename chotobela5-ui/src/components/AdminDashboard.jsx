import { useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await API.get(
        `/rsvp/summary?password=${encodeURIComponent(password)}`
      );
      setStats(res.data);
      setError("");
    } catch {
      setError("Invalid password");
    }
  };

  const downloadCSV = async () => {
    const res = await API.get("/rsvp");
    const rows = res.data;

    const csv = [
      ["Name", "Mobile", "Adults", "Kids", "Food"],
      ...rows.map((r) => [
        r.guest_name,
        r.mobile,
        r.adults,
        r.kids,
        r.food_preference,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chotobela5_rsvp.csv";
    a.click();
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-3xl mb-4 text-center">🔐 Admin Dashboard</h2>

      {!stats && (
        <form
          onSubmit={(e) => {
            e.preventDefault();   // ⛔ prevent page reload
            fetchStats();         // ✅ call backend
          }}
        >
          <input
            type="password"
            placeholder="Admin Password"
            className="border p-2 w-full mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 gap-4 text-center mt-6">
            <div className="bg-white p-4 rounded shadow">
              <p>Total RSVPs</p>
              <p className="text-2xl">{stats.total_rsvps}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p>Adults</p>
              <p className="text-2xl">{stats.adults}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p>Kids</p>
              <p className="text-2xl">{stats.kids}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p>Veg</p>
              <p className="text-2xl">{stats.veg}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p>Non-Veg</p>
              <p className="text-2xl">{stats.nonveg}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p>Plates Needed</p>
              <p className="text-2xl">{stats.plates_required}</p>
            </div>
          </div>

          <button
            onClick={downloadCSV}
            className="mt-6 w-full bg-green-700 text-white py-2 rounded"
          >
            Download CSV for Caterer
          </button>
        </>
      )}
    </div>
  );
}