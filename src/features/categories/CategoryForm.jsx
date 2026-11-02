import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createCategory, updateCategory } from './categoriesSlice'

const emptyForm = { name: '', imageSrc: '' }

export default function CategoryForm({ editingCategory, onFinish }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState(
    editingCategory
      ? { name: editingCategory.name, imageSrc: editingCategory.imageSrc || '' }
      : emptyForm
  )
  const [validationError, setValidationError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setValidationError('Category name is required.')
      return
    }

    setValidationError(null)
    setIsSubmitting(true)

    const payload = { name: form.name.trim(), imageSrc: form.imageSrc.trim() }
    const action = editingCategory
      ? updateCategory({ ...editingCategory, ...payload })
      : createCategory(payload)

    const result = await dispatch(action)
    setIsSubmitting(false)

    if (result.meta.requestStatus === 'fulfilled') {
      setForm(emptyForm)
      onFinish()
    }
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h2>{editingCategory ? 'Edit category' : 'New category'}</h2>

      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        placeholder="Category name"
      />

      <label htmlFor="imageSrc">Image URL</label>
      <input
        id="imageSrc"
        name="imageSrc"
        type="url"
        value={form.imageSrc}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
      />

      {validationError && <p className="alert alert-error" role="alert">{validationError}</p>}

      <div className="form-actions">
        <button className="button button-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving…' : editingCategory ? 'Save changes' : 'Create category'}
        </button>
        {editingCategory && (
          <button className="button button-ghost" type="button" onClick={onFinish}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
