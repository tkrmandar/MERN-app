import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://mern-app-h17f.onrender.com/api';

function Home (props) {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.token) {
            navigate('/login');
        } else {
            fetchItems();
        }
    }, [props.token]);


    const fetchItems = async () => {
        const res = await fetch(`${API_BASE}/items`, {
            headers: { Authorization: `Bearer ${props.token}` },
        });
        const data = await res.json();
        setItems(data);
    };

    const addItem = async (e) => {
        e.preventDefault();
        const method = editId ? 'PUT' : 'POST';
        const url = editId
            ? `${API_BASE}/items/${editId}`
            : `${API_BASE}/items`;

        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${props.token}`,
            },
            body: JSON.stringify({ name, company }),
        });

        setName('');
        setCompany('');
        setEditId(null);
        fetchItems();
    };

    const deleteItem = async (id) => {
        await fetch(`${API_BASE}/items/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${props.token}` },
        });
        fetchItems();
    };

    const startEdit = (item) => {
        setName(item.name);
        setCompany(item.company);
        setEditId(item._id);
    };

    const handleLogout = () => {
        props.setToken('');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
            <h1>Item Manager</h1>
            <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
                Logout
            </button>

            <form onSubmit={addItem} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={name}
                    placeholder="Enter item name"
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '8px', width: '100%', marginBottom: '8px' }}
                />
                <input
                    type="text"
                    value={company}
                    placeholder="Enter company name"
                    onChange={(e) => setCompany(e.target.value)}
                    style={{ padding: '8px', width: '100%', marginBottom: '8px' }}
                />
                <button type="submit" style={{ padding: '8px' }}>
                    {editId ? 'Update' : 'Add'}
                </button>
            </form>

            <ul>
                {items.length === 0 && <li>No items found</li>}
                {items.map((item) => (
                    <li key={item._id} style={{ marginBottom: '0.5rem' }}>
                        {item.name} — {item.company}
                        <button onClick={() => startEdit(item)} style={{ marginLeft: '10px' }}>Edit</button>
                        <button onClick={() => deleteItem(item._id)} style={{ marginLeft: '5px' }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
