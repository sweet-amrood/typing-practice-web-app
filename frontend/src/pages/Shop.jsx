import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buyShopItem, getShop } from '../services/shopService';
import { useStats } from '../context/StatsContext';
import { useTheme } from '../context/ThemeContext';
import { CoinIcon } from '../components/RewardIcons';
import UserAvatar from '../components/UserAvatar';
import { playKeystrokeSound, warmSoundPack } from '../utils/keyboardSounds';
import { applyTheme } from '../utils/themes';
import '../styles/typing-trails.css';

const rarityClass = {
  rare: 'border-sky-500/40 text-sky-300',
  epic: 'border-purple-500/40 text-purple-300',
  legendary: 'border-amber-500/40 text-amber-300',
};

const CATEGORY_LABELS = {
  frame: 'Frames',
  title: 'Titles',
  badge: 'Badges',
  theme: 'Themes',
  sound: 'Sound Packs',
  trail: 'Typing Trails',
};

const CATEGORY_ORDER = ['theme', 'sound', 'trail', 'frame', 'title', 'badge'];

const TrailPreview = ({ style }) => {
  if (!style || style === 'normal') {
    return <span className="trail-preview text-emerald-400">abc</span>;
  }

  return (
    <span className="trail-preview">
      {['a', 'b', 'c'].map((char) => (
        <span key={char} className={`trail-preview__char trail-preview__char--${style}`}>
          {char}
        </span>
      ))}
    </span>
  );
};

const ShopItemCard = ({ item, buying, onBuy }) => (
  <div
    className={`rounded-xl border bg-theme-card/50 p-4 ${
      rarityClass[item.rarity] ?? 'border-theme-border'
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-xs uppercase tracking-wider opacity-80">{item.rarity ?? 'standard'}</p>
        <p className="mt-1 text-sm font-medium text-white">{item.label}</p>
      </div>
      {item.category === 'badge' && <span className="text-2xl">{item.emoji}</span>}
      {item.category === 'frame' && (
        <UserAvatar image={null} frameStyle={item.style ?? 'slate'} size="sm" />
      )}
      {item.category === 'title' && (
        <span className="rounded-md border border-theme-border bg-theme-bg/50 px-2 py-1 text-xs text-theme-accent">
          {item.name}
        </span>
      )}
      {item.category === 'theme' && item.preview && (
        <div className="theme-shop-preview">
          {item.preview.map((color) => (
            <span key={color} style={{ backgroundColor: color }} />
          ))}
        </div>
      )}
      {item.category === 'sound' && (
        <button
          type="button"
          className="sound-preview rounded-md border border-theme-border px-2 py-1 text-lg hover:bg-theme-hover"
          onClick={() => {
            void warmSoundPack(item.id);
            playKeystrokeSound(item.id);
          }}
          title="Preview sound"
        >
          🔊
        </button>
      )}
      {item.category === 'trail' && <TrailPreview style={item.style} />}
    </div>
    <p className="mt-2 text-xs text-theme-muted">{item.description}</p>
    <div className="mt-4 flex items-center justify-between">
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-300">
        <CoinIcon className="h-4 w-4" />
        {item.price}
      </span>
      <button
        type="button"
        disabled={item.owned || buying === item.id}
        onClick={() => onBuy(item.id)}
        className="rounded-md bg-theme-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-theme-accent-hover disabled:opacity-50"
      >
        {item.owned ? 'Owned' : buying === item.id ? 'Buying...' : 'Buy'}
      </button>
    </div>
  </div>
);

const Shop = () => {
  const { refreshStats } = useStats();
  const { setThemeData } = useTheme();
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const load = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const data = await getShop();
      setShopData(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const groupedShop = useMemo(() => {
    const groups = {
      frame: [],
      title: [],
      badge: [],
      theme: [],
      sound: [],
      trail: [],
    };
    for (const item of shopData?.shop ?? []) {
      if (groups[item.category]) {
        groups[item.category].push(item);
      }
    }
    return groups;
  }, [shopData?.shop]);

  const handleBuy = async (itemId) => {
    setBuying(itemId);
    setError(null);
    setMessage(null);

    try {
      const purchased = await buyShopItem(itemId);
      setMessage('Purchase successful!');

      setShopData((prev) => ({
        ...prev,
        coins: purchased.coins ?? prev?.coins,
        shop: purchased.shop ?? prev?.shop,
        cosmetics: purchased.cosmetics ?? prev?.cosmetics,
      }));

      const progress = await refreshStats();

      if (purchased?.item?.category === 'theme' && progress?.activeTheme) {
        applyTheme(progress.activeTheme);
        setThemeData({
          activeTheme: progress.activeTheme,
          unlockedThemes: progress.unlockedThemes,
          themes: progress.themes,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBuying(null);
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-sm text-theme-muted">Loading shop...</p>;
  }

  const cosmetics = shopData?.cosmetics;
  const equippedFrame = cosmetics?.frames?.find((item) => item.equipped);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Shop</h1>
          <p className="mt-1 text-sm text-theme-muted">
            Spend coins on themes, sound packs, typing trails, frames, titles, and badges.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-theme-border bg-theme-card/50 px-4 py-2">
          <CoinIcon className="h-5 w-5" />
          <span className="text-lg font-semibold tabular-nums text-white">
            {shopData?.coins ?? 0}
          </span>
        </div>
      </div>

      {cosmetics && (
        <div className="flex items-center gap-4 rounded-xl border border-theme-border bg-theme-card/50 p-4">
          <UserAvatar
            image={cosmetics.avatarImage}
            frameStyle={equippedFrame?.style ?? 'slate'}
            size="md"
          />
          <div>
            <p className="text-sm font-medium text-white">Your look</p>
            <p className="text-xs text-theme-muted">
              Customize avatars, frames, sounds, and trails in{' '}
              <Link to="/profile" className="text-theme-accent hover:underline">
                Profile
              </Link>
            </p>
          </div>
        </div>
      )}

      {message && <p className="text-sm text-emerald-400">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {CATEGORY_ORDER.map((category) => {
        const items = groupedShop[category];
        if (!items?.length) return null;

        return (
          <div key={category} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-theme-muted">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  buying={buying}
                  onBuy={handleBuy}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Shop;
