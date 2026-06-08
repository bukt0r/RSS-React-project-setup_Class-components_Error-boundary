import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderWithProviders } from './test-utils/renderWithProviders';

const fillValidHookForm = async (
  user: ReturnType<typeof userEvent.setup>,
): Promise<void> => {
  await user.type(screen.getByLabelText('Name'), 'John');
  await user.clear(screen.getByLabelText('Age'));
  await user.type(screen.getByLabelText('Age'), '20');
  await user.type(screen.getByLabelText('Email'), 'john@example.com');
  await user.click(screen.getByLabelText('Male'));
  await user.click(screen.getByLabelText('I accept terms and conditions'));
  await user.type(screen.getByLabelText('Password'), 'Strong123!');
  await user.type(screen.getByLabelText('Confirm password'), 'Strong123!');
  await user.type(screen.getByLabelText('Country'), 'Canada');
  await user.upload(
    screen.getByLabelText('Image (png/jpeg, max 2 MB)'),
    new File(['image-content'], 'avatar.png', { type: 'image/png' }),
  );
};

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

    await fillValidHookForm(user);

    expect(submitButton).toBeEnabled();
  });

  it('submits RHF form, closes modal, and shows submission on main page', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Open React Hook Form' }));
    await fillValidHookForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit React Hook Form' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { level: 3, name: 'John' })).toBeInTheDocument();
    expect(screen.getByText('react-hook-form')).toBeInTheDocument();
    expect(container.querySelector('.submission-card--highlighted')).toBeInTheDocument();
  });

  it('submits uncontrolled form, closes modal, and shows submission on main page', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Open uncontrolled form' }));
    await user.type(screen.getByLabelText('Name'), 'Anna');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'anna@example.com');
    await user.click(screen.getByLabelText('Female'));
    await user.click(screen.getByLabelText('I accept terms and conditions'));
    await user.type(screen.getByLabelText('Password'), 'Strong123!');
    await user.type(screen.getByLabelText('Confirm password'), 'Strong123!');
    await user.type(screen.getByLabelText('Country'), 'Ukraine');
    const imageFile = new File(['image-content'], 'avatar.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Image (png/jpeg, max 2 MB)'), {
      target: { files: [imageFile] },
    });
    await user.click(screen.getByRole('button', { name: 'Submit uncontrolled form' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { level: 3, name: 'Anna' })).toBeInTheDocument();
    expect(screen.getByText('uncontrolled')).toBeInTheDocument();
    expect(container.querySelector('.submission-card--highlighted')).toBeInTheDocument();
  });

  it('shows submissions section on the main page', () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Submissions' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No submissions yet.');
  });
});
