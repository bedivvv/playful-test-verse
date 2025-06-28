
export * from './queries'
export * from './subscriptions'
export * from './mutations'

// Add uploadToken export - this should be defined in one of the mutation files
// For now, we'll add a placeholder that matches the expected structure
export const uploadToken = `
  mutation UploadToken($id: String!, $pushToken: String!) {
    uploadToken(id: $id, pushToken: $pushToken)
  }
`
