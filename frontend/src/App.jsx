import { useState, useEffect } from 'react'

function App() {
  const [logs, setLogs] = useState([])
  const [topic, setTopic] = useState("")
  const [category, setCategory] = useState("Backend")

  // Fetch all logs when the page loads
  useEffect(() => {
    fetch("http://127.0.0.1:8000/logs/")
      .then(response => response.json())
      .then(data => setLogs(data))
      .catch(error => console.error("Error fetching data:", error))
  }, [])

  // Create a new log (POST)
  const handleSubmit = (e) => {
    e.preventDefault()
    const newLog = { topic, category, understood: false }

    fetch("http://127.0.0.1:8000/logs/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLog),
    })
      .then(response => response.json())
      .then(data => {
        setLogs([...logs, data])
        setTopic("")
      })
      .catch(error => console.error("Error creating log:", error))
  }

  // Toggle the Understood status (PUT)
 // Toggle the Understood status (PUT)
// Toggle the Understood status (Optimistic UI Update)
  const handleToggleUnderstood = (log) => {
    // 1. OPTIMISTIC UPDATE: Change the UI instantly
    const updatedLogs = logs.map(item => 
      item.id === log.id ? { ...item, understood: !item.understood } : item
    )
    setLogs(updatedLogs) // BOOM! Instant visual checkbox toggle.

    // 2. Prepare the clean payload for FastAPI
    const updatePayload = {
      topic: log.topic,
      category: log.category,
      understood: !log.understood 
    }

    // 3. Send the update to the backend in the background
    fetch(`http://127.0.0.1:8000/logs/${log.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Server rejected the update")
        }
        // We don't even need to parse the response data here because our UI is already updated!
      })
      .catch(error => {
        console.error("Error updating log:", error)
        // REVERT: If the server failed, put the old state back so the UI matches the database
        setLogs(logs) 
        alert("Network error: Could not save your change.")
      })
  }
  // Remove a log entirely (DELETE)
  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/logs/${id}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(() => {
        // Filter out the deleted item from our UI view state
        setLogs(logs.filter(item => item.id !== id))
      })
      .catch(error => console.error("Error deleting log:", error))
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>My Dev Tracker</h1>
      
      {/* FORM ELEMENT */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          placeholder="What did you study?" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          style={{ flex: 1, padding: "8px" }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "8px" }}>
          <option value="Backend">Backend</option>
          <option value="Frontend">Frontend</option>
          <option value="Database">Database</option>
          <option value="Tooling">Tooling</option>
        </select>
        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
          Add Log
        </button>
      </form>

      {/* DISPLAY LOGS LIST */}
      {logs.length === 0 ? (
        <p>No logs found. Go study something!</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {logs.map((log) => (
            <li key={log.id} style={{ 
              marginBottom: "10px", 
              padding: "15px", 
              border: "1px solid #ccc",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <strong style={{ textDecoration: log.understood ? "line-through" : "none" }}>
                  {log.topic}
                </strong> 
                <span style={{ marginLeft: "10px", fontSize: "0.85em", color: "#666" }}>
                  ({log.category})
                </span>
              </div>
              
              <div style={{ display: "flex", gap: "10px" }}>
                {/* Checkbox to toggle status */}
                <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={log.understood} 
                    onChange={() => handleToggleUnderstood(log)} 
                  />
                  {log.understood ? "Done" : "Review"}
                </label>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(log.id)}
                  style={{ 
                    padding: "4px 8px", 
                    backgroundColor: "#ff4d4d", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "3px", 
                    cursor: "pointer" 
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
