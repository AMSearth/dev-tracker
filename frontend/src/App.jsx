import { useState, useEffect } from 'react'

function App() {
  // State for our list of logs
  const [logs, setLogs] = useState([])
  
  // State for our form inputs
  const [topic, setTopic] = useState("")
  const [category, setCategory] = useState("Backend")

  // Fetch initial data
  useEffect(() => {
    fetch("http://127.0.0.1:8000/logs/")
      .then(response => response.json())
      .then(data => setLogs(data))
      .catch(error => console.error("Error fetching data:", error))
  }, [])

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault() // Prevents the browser from refreshing the page

    const newLog = {
      topic: topic,
      category: category,
      understood: false
    }

    fetch("http://127.0.0.1:8000/logs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLog),
    })
      .then(response => response.json())
      .then(data => {
        // Add the newly created log (returned from FastAPI) to our current list
        setLogs([...logs, data])
        // Clear the input field for the next entry
        setTopic("")
      })
      .catch(error => console.error("Error creating log:", error))
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>My Dev Tracker</h1>
      
      {/* --- ADD NEW LOG FORM --- */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          placeholder="What did you study?" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          style={{ flex: 1, padding: "8px" }}
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="Backend">Backend</option>
          <option value="Frontend">Frontend</option>
          <option value="Database">Database</option>
          <option value="Tooling">Tooling</option>
        </select>
        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
          Add Log
        </button>
      </form>
      {/* ------------------------ */}

      {logs.length === 0 ? (
        <p>No logs found. Go study something!</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {logs.map((log) => (
            <li key={log.id} style={{ 
              marginBottom: "10px", 
              padding: "10px", 
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}>
              <strong>{log.topic}</strong> ({log.category}) 
              <br />
              Status: {log.understood ? "✅ Understood" : "❌ Needs Review"}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
