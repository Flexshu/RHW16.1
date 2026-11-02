import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthMessages, loginUser, registerUser } from './authSlice'

const emptyForm = { email: '', password: '', confirmPassword: '' }

export default function AuthPanel() {
  const dispatch = useDispatch()
  const { status, error, message } = useSelector((state) => state.auth)
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(emptyForm)
  const [validationError, setValidationError] = useState(null)

  const isLogin = mode === 'login'
  const isLoading = status === 'loading'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setForm(emptyForm)
    setValidationError(null)
    dispatch(clearAuthMessages())
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (form.password.length < 6) {
      setValidationError('Password must be at least 6 characters long.')
      return
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }

    setValidationError(null)
    const credentials = { email: form.email.trim(), password: form.password }
    dispatch(isLogin ? loginUser(credentials) : registerUser(credentials))
  }

  const visibleError = validationError || error

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Categories admin</h1>
        <p className="auth-lead">Sign in to manage your categories.</p>

        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={isLogin ? 'tab active' : 'tab'}
            onClick={() => handleModeChange('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={!isLogin ? 'tab active' : 'tab'}
            onClick={() => handleModeChange('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
          />

          {!isLogin && (
            <>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </>
          )}

          {visibleError && <p className="alert alert-error" role="alert">{visibleError}</p>}
          {message && <p className="alert alert-success" role="status">{message}</p>}

          <button className="button button-primary" disabled={isLoading} type="submit">
            {isLoading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}
