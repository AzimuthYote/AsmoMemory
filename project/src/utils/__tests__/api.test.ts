import { validateApiKey, fetchDatabases, updateDatabaseDescription } from '../api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateApiKey', () => {
    it('returns true for valid API key', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
      
      const result = await validateApiKey('valid-key');
      expect(result).toBe(true);
    });

    it('returns false for invalid API key', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Invalid key'));
      
      const result = await validateApiKey('invalid-key');
      expect(result).toBe(false);
    });
  });

  describe('fetchDatabases', () => {
    it('returns list of databases', async () => {
      const mockDatabases = [
        { id: '1', name: 'Test DB 1' },
        { id: '2', name: 'Test DB 2' }
      ];
      
      mockedAxios.get.mockResolvedValueOnce({ data: mockDatabases });
      
      const result = await fetchDatabases();
      expect(result).toEqual(mockDatabases);
    });
  });

  describe('updateDatabaseDescription', () => {
    it('successfully updates database description', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { success: true } });
      
      const result = await updateDatabaseDescription('1', 'New description');
      expect(result).toBe(true);
    });
  });
});