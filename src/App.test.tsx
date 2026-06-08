import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderWithProviders } from './test-utils/renderWithProviders';

describe('App', () => {
  it('renders project title', () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'React Forms' }),
    ).toBeInTheDocument();
  });

  it('opens uncontrolled form modal from the main page', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Open uncontrolled form' }));

    expect(
      screen.getByRole('dialog', { name: 'Uncontrolled form' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Image (png/jpeg, max 2 MB)')).toBeInTheDocument();
    expect(screen.getByLabelText('I accept terms and conditions')).toBeInTheDocument();
  });

  it('opens react hook form modal from the main page', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Open React Hook Form' }));

    expect(
      screen.getByRole('dialog', { name: 'React Hook Form' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Image (png/jpeg, max 2 MB)')).toBeInTheDocument();
    expect(screen.getByLabelText('I accept terms and conditions')).toBeInTheDocument();
  });

  it('validates uncontrolled form on submit only', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Open uncontrolled form' }));
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit uncontrolled form' }));

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('You must accept terms and conditions')).toBeInTheDocument();
    expect(screen.getByText('Image is required')).toBeInTheDocument();
  });

  it('keeps RHF submit disabled until form is valid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Open React Hook Form' }));

    const submitButton = screen.getByRole('button', { name: 'Submit React Hook Form' });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.clear(screen.getByLabelText('Age'));
    await user.type(screen.getByLabelText('Age'), '20');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.click(screen.getByLabelText('Male'));
    await user.click(screen.getByLabelText('I accept terms and conditions'));
    await user.type(screen.getByLabelText('Password'), 'Strong123!');
    await user.type(screen.getByLabelText('Confirm password'), 'Strong123!');
    await user.type(screen.getByLabelText('Country'), 'Canada');
    const imageFile = new File(['image-content'], 'avatar.png', {
      type: 'image/png',
    });
    await user.upload(screen.getByLabelText('Image (png/jpeg, max 2 MB)'), imageFile);

    expect(submitButton).toBeEnabled();
  });

  it('shows submissions section on the main page', () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Submissions' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No submissions yet.');
  });
});
