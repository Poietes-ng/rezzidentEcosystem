import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerEstate, fetchStructureTemplates  } from '../estate'
import type {EstateRegisterPayload} from '../estate';
import { apiClient } from '#/shared/lib/apiClient'

// Mock the apiClient
vi.mock('#/shared/lib/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('Estate Registration API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('registerEstate', () => {
    it('should call apiClient.post with the correct payload', async () => {
      const mockPayload: EstateRegisterPayload = {
        name: 'Test Estate',
        address: '123 Test St',
        state: 'Lagos',
        local_government: 'Ikeja',
        management_type: 'community',
        number_of_units: 50,
      }

      const mockResponse = {
        status: true,
        status_code: 201,
        message: 'Estate registered successfully.',
        data: {
          id: '123',
          estate_code: 'EST-123',
          schema_name: 'est_123',
          name: 'Test Estate',
          address: '123 Test St',
          city: null,
          state: 'Lagos',
          management_type: 'community',
          status: 'pending',
          onboarding_step: 'complete',
        },
      }

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse)

      const response = await registerEstate(mockPayload)

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/estates/register', mockPayload)
      expect(response).toEqual(mockResponse)
    })

    it('should throw an error if the network request fails', async () => {
      const mockPayload: EstateRegisterPayload = {
        name: 'Test Estate',
        address: '123 Test St',
        state: 'Lagos',
        local_government: 'Ikeja',
        management_type: 'community',
      }

      const mockError = new Error('Network Error')
      vi.mocked(apiClient.post).mockRejectedValueOnce(mockError)

      await expect(registerEstate(mockPayload)).rejects.toThrow('Network Error')
    })
  })

  describe('fetchStructureTemplates', () => {
    it('should call apiClient.get with correct params when levels is provided', async () => {
      const mockResponse = {
        status: true,
        status_code: 200,
        message: 'Success',
        data: [],
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      const response = await fetchStructureTemplates(2)

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/estates/structure-templates?levels=2')
      expect(response).toEqual(mockResponse)
    })

    it('should call apiClient.get without params when levels is not provided', async () => {
      const mockResponse = {
        status: true,
        status_code: 200,
        message: 'Success',
        data: [],
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      const response = await fetchStructureTemplates()

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/estates/structure-templates')
      expect(response).toEqual(mockResponse)
    })
  })
})
