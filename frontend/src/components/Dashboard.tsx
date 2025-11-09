import React, { useEffect, useState } from 'react';
import { api, removeToken } from '../api';

type Task = {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  user: any;
};

export default function Dashboard({ onLogout }: { onLogout?: ()=>void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const load = async () => {
    try {
      const me = await api.getMe();
      setUser(me.data);
      const res = await api.getTasks();
      setTasks(res.data || []);
    } catch (err: any) {
      setMessage(err.message || 'Failed to load');
    }
  };

  useEffect(()=>{ load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createTask({ title, description });
      setTasks(prev=>[res.data, ...prev]);
      setTitle(''); setDescription('');
    } catch (err: any) { setMessage(err.message); }
  };

  const doDelete = async (id: string) => {
    if (!confirm('Delete task?')) return;
    try {
      await api.deleteTask(id);
      setTasks(prev=>prev.filter(t=>t._id!==id));
    } catch (err: any) { setMessage(err.message); }
  };

  const logout = () => {
    removeToken();
    if (onLogout) onLogout();
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome {user?.name} ({user?.role})</p>
      <button onClick={logout}>Logout</button>

      <h3>Create Task</h3>
      <form onSubmit={create}>
        <div>
          <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <button type="submit">Create</button>
      </form>

      <h3>Tasks</h3>
      {message && <p>{message}</p>}
      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <strong>{t.title}</strong> - {t.description}
            <div>
              <small>By: {(t.user && t.user.name) || (t.user?.toString && t.user.toString())}</small>
            </div>
            <div>
              {/* Only allow delete if admin or owner */}
              <button onClick={()=>doDelete(t._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
