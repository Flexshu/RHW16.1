import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../auth/authSlice'
import CategoryForm from './CategoryForm'
import CategoryList from './CategoryList'
import { clearCategories, fetchCategories } from './categoriesSlice'

export default function CategoryDashboard() {
  const dispatch = useDispatch()
  const email = useSelector((state) => state.auth.email)
  const { items, status, error } = useSelector((state) => state.categories)
  const [search, setSearch] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(clearCategories())
    dispatch(logout())
  }

  const filteredItems = items.filter((category) =>
    category.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  const isUnauthorized = error?.status === 401

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Categories</h1>
          <p className="muted">Signed in as {email}</p>
        </div>
        <button className="button button-ghost" type="button" onClick={handleLogout}>
          Sign out
        </button>
      </header>

      {error && (
        <div className="alert alert-error" role="alert">
          <span>{isUnauthorized ? 'Your session has expired. Sign in again.' : error.message}</span>
          {isUnauthorized && (
            <button className="button button-secondary" type="button" onClick={handleLogout}>
              Back to sign in
            </button>
          )}
        </div>
      )}

      <div className="dashboard-grid">
        <section>
          <input
            className="search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name"
            aria-label="Search categories"
          />

          {status === 'loading' && (
            <div className="state-box">
              <span className="spinner" aria-hidden="true" />
              <p>Loading categories…</p>
            </div>
          )}

          {status === 'succeeded' && items.length === 0 && (
            <div className="state-box">
              <p>No categories yet. Create the first one using the form.</p>
            </div>
          )}

          {status === 'succeeded' && items.length > 0 && filteredItems.length === 0 && (
            <div className="state-box">
              <p>No categories match "{search.trim()}".</p>
            </div>
          )}

          {filteredItems.length > 0 && (
            <CategoryList
              items={filteredItems}
              onEdit={setEditingCategory}
              editingId={editingCategory?._id}
            />
          )}
        </section>

        <aside>
          <CategoryForm
            key={editingCategory?._id ?? 'new'}
            editingCategory={editingCategory}
            onFinish={() => setEditingCategory(null)}
          />
        </aside>
      </div>
    </div>
  )
}
