import { useState, useEffect } from 'react';
import useAuth from './useAuth';

const useStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(user?.streak || 0);

  useEffect(() => {
    setStreak(user?.streak || 0);
  }, [user?.streak]);

  return streak;
};

export default useStreak;
