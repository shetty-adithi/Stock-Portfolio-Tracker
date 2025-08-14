import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState({ symbol: '', quantity: '', buyPrice: '' });
  const [message, setMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchStocks = () => {
    fetch('http://localhost:8080/api/stocks')
      .then(res => res.json())
      .then(data => {
        setStocks(data);
        setLastUpdated(new Date().toLocaleString());
      })
      .catch(() => setMessage('❌ Backend error.'));
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.symbol || !form.quantity || !form.buyPrice) {
      setMessage('⚠️ All fields are required.');
      return;
    }

    fetch('http://localhost:8080/api/stocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: form.symbol.trim().toUpperCase(),
        quantity: parseInt(form.quantity),
        buyPrice: parseFloat(form.buyPrice),
      }),
    })
      .then(res => res.json())
      .then(() => {
        fetchStocks();
        setForm({ symbol: '', quantity: '', buyPrice: '' });
        setMessage('✅ Stock added!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(() => setMessage('❌ Failed to add stock.'));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/stocks/${id}`, {
      method: 'DELETE',
    }).then(() => fetchStocks());
  };

  const totalInvestment = stocks.reduce((sum, s) => sum + s.quantity * s.buyPrice, 0);

  return (
    <div className="dashboard">
      <h1>📊 Portfolio Dashboard</h1>

      {message && <div className="toast">{message}</div>}

      <div className="stats">
        <div className="card">
          <h3>Total Invested</h3>
          <p>${totalInvestment.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Stocks Tracked</h3>
          <p>{stocks.length}</p>
        </div>
        <div className="card">
          <h3>Last Updated</h3>
          <p>{lastUpdated}</p>
        </div>
      </div>

      <div className="add-form">
        <h2>Add New Stock</h2>
        <form onSubmit={handleSubmit}>
          <input name="symbol" placeholder="Symbol" value={form.symbol} onChange={handleChange} />
          <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
          <input name="buyPrice" type="number" step="0.01" placeholder="Buy Price" value={form.buyPrice} onChange={handleChange} />
          <button type="submit">Add Stock</button>
        </form>
      </div>

      <h2>📃 Stock List</h2>
      {stocks.length === 0 ? (
        <p>No stocks yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.id}>
                <td>{stock.symbol}</td>
                <td>{stock.quantity}</td>
                <td>${stock.buyPrice.toFixed(2)}</td>
                <td>${(stock.quantity * stock.buyPrice).toFixed(2)}</td>
                <td><button className="delete-btn" onClick={() => handleDelete(stock.id)}>❌</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Custom Bar-Style Graph */}
      <div className="graph-section">
        <h2>📊 Investment Overview</h2>
        {stocks.length > 0 ? (
          <div className="bars">
            {stocks.map((stock, index) => {
              const total = stock.quantity * stock.buyPrice;
              const percent = (total / totalInvestment) * 100;
              return (
                <div key={index} className="bar-wrapper">
                  <div className="bar-label">{stock.symbol} (${total.toFixed(2)})</div>
                  <div className="bar" style={{ width: `${percent}%` }}>
                    <span className="bar-value">{percent.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No data to visualize.</p>
        )}
      </div>
    </div>
  );
}

export default App;
