import { render, screen, waitFor } from '@testing-library/react';
import { DatabaseConfig } from '../../pages/DatabaseConfig';
import { fetchDatabases } from '../api';
import { NotionProvider } from '../../context/NotionContext';

jest.mock('../api');
const mockedFetchDatabases = fetchDatabases as jest.MockedFunction<typeof fetchDatabases>;

describe('DatabaseConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    render(
      <NotionProvider>
        <DatabaseConfig />
      </NotionProvider>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays databases when loaded successfully', async () => {
    const mockDatabases = [
      {
        id: '1',
        title: 'Test Database',
        properties: [
          { id: 'prop1', name: 'Property 1', type: 'text', description: '' }
        ]
      }
    ];

    mockedFetchDatabases.mockResolvedValueOnce(mockDatabases);

    render(
      <NotionProvider>
        <DatabaseConfig />
      </NotionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Database')).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    mockedFetchDatabases.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <NotionProvider>
        <DatabaseConfig />
      </NotionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load databases')).toBeInTheDocument();
    });
  });
});