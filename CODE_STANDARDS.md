# Dr.Coffee Code Standards & Best Practices

This document outlines the coding standards and best practices used in the Dr.Coffee project.

## TypeScript Standards

### Type Safety
- ✅ Always use TypeScript types/interfaces instead of `any`
- ✅ Use shared types from `@/types/index.ts` for consistency
- ✅ Define interfaces for all API responses and requests
- ✅ Use proper error typing: `err: unknown` then type guard

### Example:
```typescript
// ❌ Bad
catch (err: any) {
  console.log(err.message)
}

// ✅ Good
catch (err: unknown) {
  const error = err as { message?: string }
  const errorMessage = error.message || 'Unknown error'
}
```

## Code Organization

### File Structure
```
dr.coffee/
├── types/              # Shared TypeScript types
├── services/           # API services
├── components/         # React components
├── contexts/           # React contexts
├── utils/              # Utility functions
└── app/                # Next.js pages
```

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Internal components
4. Types
5. Utils/services
6. Styles

### Example:
```typescript
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2 } from 'lucide-react'
import MenuItemCard from '@/components/MenuItemCard'
import type { ApiProduct } from '@/types'
import { apiService } from '@/services/api'
```

## Error Handling

### API Errors
- Always handle errors with try/catch
- Provide user-friendly error messages
- Show toast notifications for user feedback
- Log errors appropriately (avoid console.log in production)

### Example:
```typescript
try {
  await apiService.createProduct(data)
  setToast({ message: 'Success!', type: 'success' })
} catch (err: unknown) {
  const error = err as { response?: { data?: { message?: string } } }
  const errorMessage = error.response?.data?.message || 'Failed to create'
  setToast({ message: errorMessage, type: 'error' })
}
```

## Component Standards

### Function Components
- Use functional components with hooks
- Add JSDoc comments for complex functions
- Use `useCallback` for functions passed as props
- Use `useMemo` for expensive computations

### State Management
- Use `useState` for local component state
- Use React Context for global state (Cart, Auth)
- Keep state as close to where it's used as possible

## API Service Standards

### Method Documentation
- Add JSDoc comments for all public methods
- Document parameters and return types
- Include error cases in documentation

### Example:
```typescript
/**
 * Create a new product (admin endpoint)
 * @param productData - Product data
 * @returns Created product
 * @throws {ApiError} If validation fails or unauthorized
 */
async createProduct(productData: CreateProductRequest): Promise<ApiProduct>
```

## Naming Conventions

### Variables & Functions
- Use camelCase: `handleAddProduct`, `isLoading`
- Use descriptive names: `selectedProduct` not `prod`
- Boolean variables: prefix with `is`, `has`, `should`: `isLoading`, `hasError`

### Types & Interfaces
- Use PascalCase: `ApiProduct`, `MenuItem`
- Use descriptive names: `ProductFormData` not `FormData`
- Prefix API types with `Api`: `ApiProduct`, `ApiCategory`

### Constants
- Use UPPER_SNAKE_CASE: `API_BASE_URL`, `MAX_RETRIES`

## Code Comments

### When to Comment
- ✅ Complex business logic
- ✅ Non-obvious code decisions
- ✅ Public API methods
- ❌ Don't comment obvious code

### Example:
```typescript
// ❌ Bad - obvious
// Set loading to true
setIsLoading(true)

// ✅ Good - explains why
// Only show loading spinner on initial load, not on refresh
if (showLoading) {
  setIsLoading(true)
}
```

## Performance Best Practices

### React Optimization
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive calculations
- Avoid creating objects/arrays in render (use `useMemo`)

### API Calls
- Use `Promise.all` for parallel requests
- Implement proper loading states
- Cache data when appropriate

## Security Best Practices

### Authentication
- Never store sensitive data in localStorage
- Always validate tokens on the backend
- Clear auth data on logout/expiry

### Input Validation
- Validate all user inputs
- Sanitize data before sending to API
- Use TypeScript types for type safety

## Testing Considerations

### Testable Code
- Keep functions pure when possible
- Separate business logic from UI
- Use dependency injection for services

## Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] No `console.log` in production code
- [ ] Components are properly documented
- [ ] Code follows naming conventions
- [ ] No unused imports or variables
- [ ] Proper error messages for users
- [ ] Loading states are handled
- [ ] Accessibility considerations

## Common Patterns

### Loading States
```typescript
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [data, setData] = useState<DataType[]>([])

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await apiService.getData()
      setData(result)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }
  fetchData()
}, [])
```

### Form Handling
```typescript
const [formData, setFormData] = useState<FormDataType>(initialState)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    await apiService.create(formData)
    setToast({ message: 'Success!', type: 'success' })
    resetForm()
  } catch (err) {
    // Handle error
  }
}
```

