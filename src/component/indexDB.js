const DB_NAME = "POI-DOC-DRAFT-DB";
const STORE = "poi-docs";
const VERSION = 1;

const openDB = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "uid" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

export const saveWarrantyFile = async (file) => {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(file);
};

export const getWarrantyFiles = async () => {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const req = tx.objectStore(STORE).getAll();

  return new Promise((res) => {
    req.onsuccess = () => res(req.result || []);
  });
};

export const deleteWarrantyFile = async (uid) => {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(uid);
};



export const deleteWarrantyFileOnload = async (uid) => {
  if (!uid) return;

  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  store.delete(uid);

  // Wait for transaction to complete
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = reject;
  });
};

export const saveWarrantyFileWithId = async (file, customUid) => {
  const db = await openDB();
  const fileToStore = {
    ...file,
    uid: customUid,
  };
  const tx = db.transaction("poi-docs", "readwrite");
  tx.objectStore("poi-docs").put(fileToStore);
  return tx.complete;
};