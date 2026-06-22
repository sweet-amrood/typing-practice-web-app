import { useItems } from '../context/ItemContext';

const ItemCard = ({ item }) => {
  const { editItem, removeItem } = useItems();

  const toggleComplete = async () => {
    await editItem(item._id, { completed: !item.completed });
  };

  const handleDelete = async () => {
    await removeItem(item._id);
  };

  return (
    <article className="rounded-xl border border-theme-border bg-theme-card p-5 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3
            className={`text-lg font-semibold ${
              item.completed ? 'text-theme-muted line-through' : 'text-white'
            }`}
          >
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-2 text-sm text-theme-muted">{item.description}</p>
          )}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            item.completed
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-amber-500/20 text-amber-400'
          }`}
        >
          {item.completed ? 'Done' : 'Pending'}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={toggleComplete}
          className="rounded-lg bg-theme-accent px-3 py-2 text-sm font-medium text-white hover:bg-theme-accent-hover"
        >
          {item.completed ? 'Mark Pending' : 'Mark Done'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg border border-theme-border-strong px-3 py-2 text-sm font-medium text-theme-text-secondary hover:bg-theme-hover"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default ItemCard;
