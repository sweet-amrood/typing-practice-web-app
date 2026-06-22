import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as itemService from '../services/itemService';

const ItemContext = createContext(null);

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await itemService.getItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = async (item) => {
    const created = await itemService.createItem(item);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const editItem = async (id, updates) => {
    const updated = await itemService.updateItem(id, updates);
    setItems((prev) => prev.map((item) => (item._id === id ? updated : item)));
    return updated;
  };

  const removeItem = async (id) => {
    await itemService.deleteItem(id);
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      fetchItems,
      addItem,
      editItem,
      removeItem,
    }),
    [items, loading, error, fetchItems]
  );

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

export const useItems = () => {
  const context = useContext(ItemContext);

  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }

  return context;
};
