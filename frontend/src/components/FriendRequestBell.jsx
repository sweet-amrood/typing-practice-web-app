import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFriends } from '../services/friendService';

const FriendRequestBell = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getFriends();
        if (active) {
          setCount(data.incomingRequests?.length ?? 0);
        }
      } catch {
        if (active) setCount(0);
      }
    };

    load();
    const interval = setInterval(load, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (count === 0) return null;

  return (
    <Link
      to="/leaderboard#friend-requests"
      className="relative rounded-lg border border-theme-accent/40 bg-theme-accent/10 px-2.5 py-1.5 text-xs font-medium text-theme-accent hover:bg-theme-accent/20"
      title="Friend requests"
    >
      {count} friend request{count === 1 ? '' : 's'}
    </Link>
  );
};

export default FriendRequestBell;
