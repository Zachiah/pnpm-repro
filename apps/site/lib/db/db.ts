import React from 'react';
import {
  addRxPlugin,
  createRxDatabase,
  RxCollection,
  RxDatabase
} from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

import { 
  PageCollection,
  PageDocType,
  pageSchema,
  PageTreeCollectionMethods,
  pageTreeCollectionMethods,
  UserDocType,
  userSchema,
 } from './collections';

export type MyDatabaseCollections = {
  user: RxCollection<UserDocType>;
  // page: PageCollection
}

export type MyDatabase = RxDatabase<MyDatabaseCollections>;

let db: MyDatabase | null = null;



const createRxDb = async () => {

  if (process.env.NODE_ENV !== "production") {
    addRxPlugin(RxDBDevModePlugin);
  }

  db = await createRxDatabase<MyDatabaseCollections>({
    name: 'rxdb',
    storage: getRxStorageDexie(),
  });
};


const initializeRxDb = async (): Promise<MyDatabase> => {
  if(!db) {
    await createRxDb();
  }

  if (!db) {
    throw new Error('Database not initialized');
  }

  if(!db.collections.user) {
  await db.addCollections({
    user: {
      schema: userSchema,
    },
  });
}
// if(!db.collections.page) {
//   await db.addCollections({
//     page: {
//       schema: pageSchema,
//       statics: pageTreeCollectionMethods,
//     },
//   });
// }
return db;
}

export const RxDBContext = React.createContext<MyDatabase | null>(null);


export default initializeRxDb;
