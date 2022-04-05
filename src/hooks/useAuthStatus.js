import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

/*
  Implementation inspired by this thread
  (ReactRouterDom v6 + Firebase)
  https://stackoverflow.com/questions/6550665/protected-route-with-firebase
  
  Fix Memory Leak WA
  https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks
*/

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuthStatus, setCheckingAuthStatus] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();

      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        }
        setCheckingAuthStatus(false);
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return { loggedIn, checkingAuthStatus };
};
