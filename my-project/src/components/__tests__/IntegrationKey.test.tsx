import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { IntegrationKey } from '../IntegrationKey';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IntegrationKey Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates API key successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    render(<IntegrationKey />);
    
    const input = screen.getByPlaceholderText('Enter your Notion API Key');
    const submitButton = screen.getByRole('button', { name: /validate/i });

    await userEvent.type(input, 'test-api-key');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/API Key validated successfully/i)).toBeInTheDocument();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith('/api/validate-key', {
      apiKey: 'test-api-key'
    });
  });

  it('shows error message on validation failure', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Invalid API Key'));

    render(<IntegrationKey />);
    
    const input = screen.getByPlaceholderText('Enter your Notion API Key');
    const submitButton = screen.getByRole('button', { name: /validate/i });

    await userEvent.type(input, 'invalid-key');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to validate API Key/i)).toBeInTheDocument();
    });
  });

  it('disables submit button when input is empty', () => {
    render(<IntegrationKey />);
    
    const submitButton = screen.getByRole('button', { name: /validate/i });
    expect(submitButton).toBeDisabled();
  });
});