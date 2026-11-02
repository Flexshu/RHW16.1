import { useSelector } from 'react-redux'
import AuthPanel from './features/auth/AuthPanel'
import CategoryDashboard from './features/categories/CategoryDashboard'

export default function App() {
  const token = useSelector((state) => state.auth.token)
  return token ? <CategoryDashboard /> : <AuthPanel />
}
