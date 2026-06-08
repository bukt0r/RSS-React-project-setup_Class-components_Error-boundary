import { useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import Modal from './components/Modal/Modal';
import SubmissionList from './components/SubmissionList/SubmissionList';
import './App.css';

type FormVariant = 'uncontrolled' | 'react-hook-form';

interface BasicFormValues {
  name: string;
  age: number | '';
  email: string;
  gender: string;
  acceptedTerms: boolean;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variant, setVariant] = useState<FormVariant>('uncontrolled');

  const {
    register,
    handleSubmit,
    reset: resetHookForm,
  } = useForm<BasicFormValues>({
    defaultValues: {
      name: '',
      age: '',
      email: '',
      gender: '',
      acceptedTerms: false,
    },
  });

  const openModal = (nextVariant: FormVariant): void => {
    setVariant(nextVariant);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    resetHookForm();
  };

  const handleUncontrolledSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  const handleHookFormSubmit = (data: BasicFormValues): void => {
    void data;
  };

  return (
    <main className="app">
      <h1>React Forms</h1>
      <p>Open one modal and switch between two form implementations.</p>
      <div className="app__actions">
        <button type="button" onClick={() => openModal('uncontrolled')}>
          Open uncontrolled form
        </button>
        <button type="button" onClick={() => openModal('react-hook-form')}>
          Open React Hook Form
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={variant === 'uncontrolled' ? 'Uncontrolled form' : 'React Hook Form'}
        onClose={closeModal}
      >
        {variant === 'uncontrolled' ? (
          <form className="app-form" onSubmit={handleUncontrolledSubmit}>
            <div className="app-form__field">
              <label htmlFor="name-uncontrolled">Name</label>
              <input id="name-uncontrolled" name="name" type="text" />
            </div>

            <div className="app-form__field">
              <label htmlFor="age-uncontrolled">Age</label>
              <input id="age-uncontrolled" name="age" type="number" min={0} />
            </div>

            <div className="app-form__field">
              <label htmlFor="email-uncontrolled">Email</label>
              <input id="email-uncontrolled" name="email" type="email" />
            </div>

            <fieldset className="app-form__field">
              <legend>Gender</legend>
              <label htmlFor="gender-male-uncontrolled">
                <input
                  id="gender-male-uncontrolled"
                  name="gender"
                  type="radio"
                  value="male"
                />
                Male
              </label>
              <label htmlFor="gender-female-uncontrolled">
                <input
                  id="gender-female-uncontrolled"
                  name="gender"
                  type="radio"
                  value="female"
                />
                Female
              </label>
            </fieldset>

            <div className="app-form__field app-form__field--inline">
              <input id="terms-uncontrolled" name="acceptedTerms" type="checkbox" />
              <label htmlFor="terms-uncontrolled">I accept terms and conditions</label>
            </div>

            <button type="submit">Submit uncontrolled form</button>
          </form>
        ) : (
          <form className="app-form" onSubmit={handleSubmit(handleHookFormSubmit)}>
            <div className="app-form__field">
              <label htmlFor="name-hook-form">Name</label>
              <input id="name-hook-form" type="text" {...register('name')} />
            </div>

            <div className="app-form__field">
              <label htmlFor="age-hook-form">Age</label>
              <input id="age-hook-form" type="number" min={0} {...register('age')} />
            </div>

            <div className="app-form__field">
              <label htmlFor="email-hook-form">Email</label>
              <input id="email-hook-form" type="email" {...register('email')} />
            </div>

            <fieldset className="app-form__field">
              <legend>Gender</legend>
              <label htmlFor="gender-male-hook-form">
                <input
                  id="gender-male-hook-form"
                  type="radio"
                  value="male"
                  {...register('gender')}
                />
                Male
              </label>
              <label htmlFor="gender-female-hook-form">
                <input
                  id="gender-female-hook-form"
                  type="radio"
                  value="female"
                  {...register('gender')}
                />
                Female
              </label>
            </fieldset>

            <div className="app-form__field app-form__field--inline">
              <input id="terms-hook-form" type="checkbox" {...register('acceptedTerms')} />
              <label htmlFor="terms-hook-form">I accept terms and conditions</label>
            </div>

            <button type="submit">Submit React Hook Form</button>
          </form>
        )}
      </Modal>

      <SubmissionList />
    </main>
  );
}

export default App;
