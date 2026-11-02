import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRequest } from '../../api/client'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      return { token: data.token, email: credentials.email }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      await dispatch(loginUser(credentials)).unwrap()
      return 'Registration successful.'
    } catch (error) {
      return rejectWithValue(error.message ?? error)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('categoryAdminToken'),
    email: localStorage.getItem('categoryAdminEmail'),
    status: 'idle',
    error: null,
    message: null
  },
  reducers: {
    logout(state) {
      state.token = null
      state.email = null
      state.status = 'idle'
      state.error = null
      state.message = null
      localStorage.removeItem('categoryAdminToken')
      localStorage.removeItem('categoryAdminEmail')
    },
    clearAuthMessages(state) {
      state.error = null
      state.message = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.message = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.email = action.payload.email
        localStorage.setItem('categoryAdminToken', action.payload.token)
        localStorage.setItem('categoryAdminEmail', action.payload.email)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.message = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.message = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { logout, clearAuthMessages } = authSlice.actions
export default authSlice.reducer
