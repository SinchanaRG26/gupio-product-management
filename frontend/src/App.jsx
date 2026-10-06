import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500';

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ search, category, sort }).toString();
      const res = await fetch(`${API_BASE_URL}?${queryParams}`);
      const data = await res.json();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.price === '' || formData.stock === '') {
      setError('Please fill out all required fields (*).');
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description || '',
      imageUrl: formData.imageUrl || ''
    };

    try {
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Error saving product. Check backend terminal.');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id || product.id);
    setFormData({
      name: product.name || '',
      category: product.category || 'Electronics',
      price: product.price ?? '',
      stock: product.stock ?? '',
      description: product.description || '',
      imageUrl: product.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Electronics',
      price: '',
      stock: '',
      description: '',
      imageUrl: ''
    });
  };

  // KPI Calculations
  const totalItems = products.length;
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <header className="top-nav">
        <div className="brand">
          <span className="logo-icon">📦</span>
          <h1>Gupio Product Studio</h1>
        </div>
        <span className="badge-live">Live Sync</span>
      </header>

      <main className="container">
        {/* KPI Stats Panel */}
        <section className="stats-grid">
          <div className="stat-card">
            <p className="stat-title">Total Products</p>
            <h3>{totalItems}</h3>
          </div>
          <div className="stat-card">
            <p className="stat-title">Low Stock Items</p>
            <h3 className={lowStockCount > 0 ? 'text-danger' : ''}>{lowStockCount}</h3>
          </div>
          <div className="stat-card">
            <p className="stat-title">Inventory Value</p>
            <h3>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
        </section>

        {/* Input Form Card */}
        <section className="card-panel">
          <div className="panel-header">
            <h2>{editingId ? 'Edit Product' : 'Add New Inventory Item'}</h2>
          </div>
          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                placeholder="e.g., Wireless Mechanical Keyboard"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Electronics">Electronics</option>
                <option value="Audio">Audio</option>
                <option value="Apparel">Apparel</option>
                <option value="Home & Office">Home & Office</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="99.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                placeholder="25"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <input
                type="text"
                placeholder="Brief feature overview..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-actions full-width">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Item' : 'Add to Inventory'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Filter Controls Bar */}
        <section className="filter-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Audio">Audio</option>
            <option value="Apparel">Apparel</option>
            <option value="Home & Office">Home & Office</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort by Price</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </section>

        {/* Product Cards Grid */}
        <section className="product-grid">
          {loading ? (
            <p className="loading-state">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="empty-state">No products found matching your filter criteria.</p>
          ) : (
            products.map((p) => (
              <div key={p._id || p.id} className="product-card">
                <div className="card-image-wrapper">
                  <img
                    src={p.imageUrl && p.imageUrl.trim() !== '' ? p.imageUrl : DEFAULT_IMAGE}
                    alt={p.name}
                    className="card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                  <span className={`stock-badge ${p.stock < 5 ? 'badge-danger' : 'badge-success'}`}>
                    {p.stock > 0 ? `${p.stock} left` : 'Out of Stock'}
                  </span>
                </div>

                <div className="card-body">
                  <div className="card-category">{p.category}</div>
                  <h3 className="card-title">{p.name}</h3>
                  <p className="card-desc">{p.description || 'No description provided.'}</p>

                  <div className="card-footer">
                    <span className="card-price">${Number(p.price).toFixed(2)}</span>
                    <div className="card-actions">
                      <button className="btn-icon" onClick={() => handleEdit(p)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDelete(p._id || p.id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}