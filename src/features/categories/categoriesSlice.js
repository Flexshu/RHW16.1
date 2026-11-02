import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRequest } from '../../api/client'

const toRejection = (error) => ({ message: error.message, status: error.status })

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await apiRequest('/categories', {
        token: getState().auth.token
      })
    } catch (error) {
      return rejectWithValue(toRejection(error))
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/create',
  async (category, { getState, rejectWithValue }) => {
    try {
      return await apiRequest('/categories', {
        method: 'POST',
        token: getState().auth.token,
        body: JSON.stringify(category)
      })
    } catch (error) {
      return rejectWithValue(toRejection(error))
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/update',
  async (category, { getState, rejectWithValue }) => {
    try {
      return await apiRequest(`/categories/${category._id}`, {
        method: 'PATCH',
        token: getState().auth.token,
        body: JSON.stringify({ name: category.name, imageSrc: category.imageSrc })
      })
    } catch (error) {
      return rejectWithValue(toRejection(error))
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      await apiRequest(`/categories/${id}`, {
        method: 'DELETE',
        token: getState().auth.token
      })
      return id
    } catch (error) {
      return rejectWithValue(toRejection(error))
    }
  }
)

const isCategoriesAction = (suffix) => (action) =>
  action.type.startsWith('categories/') && action.type.endsWith(suffix)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearCategories(state) {
      state.items = []
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        )
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        )
      })
      .addMatcher(isCategoriesAction('/pending'), (state) => {
        state.error = null
      })
      .addMatcher(isCategoriesAction('/rejected'), (state, action) => {
        state.error = action.payload ?? { message: action.error.message }
      })
  }
})

export const { clearCategories } = categoriesSlice.actions
export default categoriesSlice.reducer
