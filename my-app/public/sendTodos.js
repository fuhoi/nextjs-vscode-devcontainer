'use strict';

// simple helper for opening the same indexeddb used by the todo page
const DB_NAME = 'todo-db';
const STORE_NAME = 'todos';
const DB_VERSION = 1;

function openDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function postBatch(batch) {
    try {
        await fetch('/api/todo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(batch),
        });
    } catch (err) {
        console.error('failed to post batch', err);
        throw err; // propagate so caller knows it failed
    }
}

// delete a group of todos by id after they have been sent
async function deleteTodos(ids) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        ids.forEach(id => {
            if (id != null) store.delete(id);
        });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

/**
 * Reads all todos from the database in groups of 10 and POSTs
 * each group to `api/todo`.
 */
async function sendInBatches() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const cursorReq = store.openCursor();
        let batch = [];

        cursorReq.onsuccess = async () => {
            const cursor = cursorReq.result;
            if (cursor) {
                batch.push(cursor.value);
                if (batch.length >= 10) {
                    try {
                        await postBatch(batch);
                        const ids = batch.map(item => item.id).filter(id => id != null);
                        await deleteTodos(ids);
                    } catch (err) {
                        console.error('batch send failed, stopping', err);
                        reject(err);
                        return;
                    }
                    batch = [];
                }
                cursor.continue();
            } else {
                // flush remaining items
                if (batch.length) {
                    try {
                        await postBatch(batch);
                        const ids = batch.map(item => item.id).filter(id => id != null);
                        await deleteTodos(ids);
                    } catch (err) {
                        console.error('final batch send failed', err);
                        reject(err);
                        return;
                    }
                }
                resolve();
            }
        };
        cursorReq.onerror = () => reject(cursorReq.error);
    });
}

// export for usage from other modules
export { sendInBatches };
