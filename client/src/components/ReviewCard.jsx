import { useState } from "react";
import { deleteReview, updateReview } from "../api";

export default function ReviewCard({ review, onChange }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(review.content);
  const [score, setScore] = useState(review.score);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const critic = review.critic;
  const criticName = critic
    ? `${critic.preferred_name} ${critic.surname}`
    : "Unknown critic";

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const updated = await updateReview(review.review_id, {
        content,
        score: Number(score),
      });
      onChange(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this review?")) return;

    setSaving(true);
    setError("");

    try {
      await deleteReview(review.review_id);
      onChange(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="review-card">
      <div className="review-card__header">
        <div>
          <strong>{criticName}</strong>
          {critic?.organization_name && (
            <span className="review-card__org">{critic.organization_name}</span>
          )}
        </div>
        <span className="review-card__score">{review.score}/5</span>
      </div>

      {editing ? (
        <form className="review-card__form" onSubmit={handleSave}>
          <label>
            Score (1–5)
            <input
              type="number"
              min="1"
              max="5"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </label>
          <label>
            Review
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <div className="button-row">
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" className="secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="review-card__content">{review.content}</p>
          <div className="button-row">
            <button type="button" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button type="button" className="danger" onClick={handleDelete} disabled={saving}>
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
}
