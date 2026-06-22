import { useState } from 'react';
import { useItems } from '../context/ItemContext';

const ItemForm = () => {
  const { addItem } = useItems();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await addItem({ title, description });
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-theme-border bg-theme-card p-5"
    >
      <h2 className="mb-4 text-lg font-semibold text-white">Add Item</h2>

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm text-theme-muted">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="w-full rounded-lg border border-theme-border-strong bg-theme-bg px-3 py-2 text-white outline-none focus:border-theme-accent"
            placeholder="Enter a title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm text-theme-muted"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-theme-border-strong bg-theme-bg px-3 py-2 text-white outline-none focus:border-theme-accent"
            placeholder="Optional description"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-theme-accent px-4 py-2 text-sm font-medium text-white hover:bg-theme-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Create Item'}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;
