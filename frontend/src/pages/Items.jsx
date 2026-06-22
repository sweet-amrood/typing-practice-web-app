import ItemCard from '../components/ItemCard';
import ItemForm from '../components/ItemForm';
import { useItems } from '../context/ItemContext';

const Items = () => {
  const { items, loading, error, fetchItems } = useItems();

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Items</h1>
          <p className="mt-2 text-theme-muted">
            CRUD demo wired to the Express API.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchItems}
          className="rounded-lg border border-theme-border-strong px-4 py-2 text-sm font-medium text-theme-text-secondary hover:bg-theme-hover"
        >
          Refresh
        </button>
      </div>

      <ItemForm />

      {loading && (
        <p className="text-center text-theme-muted">Loading items...</p>
      )}

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="rounded-xl border border-dashed border-theme-border-strong p-8 text-center text-theme-muted">
          No items yet. Create your first one above.
        </p>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Items;
