'use client';

import React, { useState, useEffect } from 'react';

// ---------- types -----------------------------------------------------------
interface Todo {
    id?: number;
    title: string;
    completed: boolean;
}

// ---------- indexeddb helpers ------------------------------------------------
const DB_NAME = 'todo-db';
const STORE_NAME = 'todos';
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
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

async function browseTodos(): Promise<Todo[]> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const items: Todo[] = [];
        const req = store.openCursor();
        req.onsuccess = () => {
            const cursor = req.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            } else {
                resolve(items);
            }
        };
        req.onerror = () => reject(req.error);
    });
}

async function readTodo(id: number): Promise<Todo | undefined> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function addTodo(todo: Todo): Promise<number> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.add(todo);
        req.onsuccess = () => resolve(req.result as number);
        req.onerror = () => reject(req.error);
    });
}

async function editTodo(todo: Todo): Promise<void> {
    if (todo.id == null) return;
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(todo);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

async function deleteTodo(id: number): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

// ---------- component -------------------------------------------------------

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    useEffect(() => {
        loadTodos();
    }, []);

    async function loadTodos() {
        const items = await browseTodos();
        setTodos(items);
    }

    async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!newTitle.trim()) return;
        await addTodo({ title: newTitle.trim(), completed: false });
        setNewTitle('');
        loadTodos();
    }

    async function handleDelete(id: number) {
        await deleteTodo(id);
        loadTodos();
    }

    async function toggleComplete(todo: Todo) {
        const updated = { ...todo, completed: !todo.completed };
        await editTodo(updated);
        loadTodos();
    }

    function startEditing(todo: Todo) {
        setEditingId(todo.id ?? null);
        setEditingTitle(todo.title);
    }

    async function saveEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (editingId == null) return;
        await editTodo({ id: editingId, title: editingTitle.trim(), completed: todos.find(t => t.id === editingId)?.completed ?? false });
        setEditingId(null);
        setEditingTitle('');
        loadTodos();
    }

    return (
        <main className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">IndexedDB Todo</h1>
            <form onSubmit={editingId ? saveEdit : handleAdd} className="mb-4 flex gap-2">
                <input
                    type="text"
                    className="border p-2 flex-1"
                    placeholder="{editingId ? 'Edit todo' : 'New todo'}"
                    value={editingId ? editingTitle : newTitle}
                    onChange={e => {
                        editingId ? setEditingTitle(e.target.value) : setNewTitle(e.target.value);
                    }}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editingId ? 'Save' : 'Add'}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-300 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                )}
            </form>

            <ul className="space-y-2">
                {todos.map(todo => (
                    <li key={todo.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleComplete(todo)}
                            />
                            <span className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.title}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => startEditing(todo)}
                                className="text-blue-500 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => todo.id != null && handleDelete(todo.id)}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
                {todos.length === 0 && <li className="text-gray-500">No todos yet.</li>}
            </ul>
        </main>
    );
}
