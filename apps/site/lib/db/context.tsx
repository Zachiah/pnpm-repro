import {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import initializeRxDb, { MyDatabase, RxDBContext } from './db';


// create a react hook for the database
export const useRxDB = () => {
  const db = useContext(RxDBContext);
  if (!db) {
    throw new Error('no db found');
  }
  return db;
};

// create a provider component for the database
export const RxDBProvider = ({children}: {children: ReactNode}) => {

  const componentMounted = useRef(false);
  const [db, setDb] = useState<MyDatabase | null>(null);

  useEffect(() => {
  
    if (componentMounted.current) {
      return;
    }
    
    const init = async () => {
      await initializeRxDb().then(
        (_db) => {
          setDb(_db)}
      )
    };
    init();
    componentMounted.current = true;

    return () => {
      if(db) {
        db.destroy();
      }
    }
  }, []);

  return (
    <RxDBContext.Provider value={db}>
      {children}
    </RxDBContext.Provider>
  );
};

