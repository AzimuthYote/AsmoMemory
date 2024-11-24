import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatabaseConfig } from '../DatabaseConfig';

describe('DatabaseConfig Component', () => {
  it('renders database list when loaded', async () => {
    render(<DatabaseConfig />);
    
    await waitFor(() => {
      expect(screen.getByText(/Connected Databases/i)).toBeInTheDocument();
    });
  });

  it('allows adding database description', async () => {
    render(<DatabaseConfig />);
    
    const addButton = screen.getByRole('button', { name: /add description/i });
    fireEvent.click(addButton);

    const textarea = screen.getByPlaceholderText(/Enter database description/i);
    await userEvent.type(textarea, 'Test database description');

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Test database description')).toBeInTheDocument();
    });
  });

  it('validates description length', async () => {
    render(<DatabaseConfig />);
    
    const addButton = screen.getByRole('button', { name: /add description/i });
    fireEvent.click(addButton);

    const textarea = screen.getByPlaceholderText(/Enter database description/i);
    await userEvent.type(textarea, 'a'.repeat(1001));

    expect(screen.getByText(/Description must be less than 1000 characters/i)).toBeInTheDocument();
  });
});