import { useDispatch } from 'react-redux'
import { deleteCategory } from './categoriesSlice'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">' +
      '<rect width="320" height="200" fill="#d9efe4"/>' +
      '<text x="160" y="106" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#164e3c">No image</text>' +
      '</svg>'
  )

export default function CategoryList({ items, onEdit, editingId }) {
  const dispatch = useDispatch()

  const handleDelete = (category) => {
    if (window.confirm(`Delete category "${category.name}"?`)) {
      dispatch(deleteCategory(category._id))
    }
  }

  const handleImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = FALLBACK_IMAGE
  }

  return (
    <div className="category-grid">
      {items.map((category) => (
        <article
          key={category._id}
          className={category._id === editingId ? 'category-card editing' : 'category-card'}
        >
          <img
            src={category.imageSrc || FALLBACK_IMAGE}
            alt={category.name}
            onError={handleImageError}
            loading="lazy"
          />
          <div className="category-body">
            <h3>{category.name}</h3>
            <div className="card-actions">
              <button className="button button-secondary" type="button" onClick={() => onEdit(category)}>
                Edit
              </button>
              <button className="button button-danger" type="button" onClick={() => handleDelete(category)}>
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
