import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '../Sidebar';

describe('Sidebar Component', () => {
  it('renders navigation links correctly', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Integration Key')).toBeInTheDocument();
    expect(screen.getByText('Database Config')).toBeInTheDocument();
  });

  it('applies correct styling to active link', () => {
    render(
      <MemoryRouter initialEntries={['/integration-key']}>
        <Sidebar />
      </MemoryRouter>
    );

    const activeLink = screen.getByText('Integration Key').closest('a');
    expect(activeLink).toHaveClass('bg-purple-900');
  });
});