
import { useEffect, useState } from "react";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GET: Fetch existing notes when the app loads
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts?_limit=5"
        );
        setNotes(response.data);
      } catch (err) {
        setError("Failed to load notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // POST: Add a new note
  const addNote = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          title: title.trim(),
          body: "My new note",
          userId: 1,
        }
      );

      setNotes((previousNotes) => [
        {
          ...response.data,
          title: title.trim(),
          body: "My new note",
        },
        ...previousNotes,
      ]);

      setTitle("");
    } catch (err) {
      setError("Failed to add note.");
    } finally {
      setLoading(false);
    }
  };

  // DELETE: Remove a note
  const deleteNote = async (id) => {
    setLoading(true);
    setError("");

    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );

      setNotes((previousNotes) =>
        previousNotes.filter((note) => note.id !== id)
      );
    } catch (err) {
      setError("Failed to delete note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notes-container">
      <h1>Simple Notes App</h1>
      <p>Add, view, and delete your notes.</p>

      <form onSubmit={addNote} className="note-form">
        <input
          type="text"
          placeholder="Enter your note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button type="submit" disabled={loading || !title.trim()}>
          Add Note
        </button>
      </form>

      {loading && <p className="loading">Processing request...</p>}
      {error && <p className="error">{error}</p>}

      <div className="notes-list">
        {notes.map((note) => (
          <div className="note-card" key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>

            <button
              className="delete-button"
              onClick={() => deleteNote(note.id)}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}

        {!loading && notes.length === 0 && !error && (
          <p>No notes available. Add your first note!</p>
        )}
      </div>
    </div>
  );
}

export default Notes;
