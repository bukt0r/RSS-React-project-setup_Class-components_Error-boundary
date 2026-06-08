import { useState, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Modal from './components/Modal/Modal';
import SubmissionList from './components/SubmissionList/SubmissionList';
import { basicFormSchema, type BasicFormValues } from './validation/formSchema';
import './App.css';

type FormVariant = 'uncontrolled' | 'react-hook-form';

type FormErrors = Partial<Record<keyof BasicFormValues, string>>;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variant, setVariant] = useState<FormVariant>('uncontrolled');
  const [uncontrolledErrors, setUncontrolledErrors] = useState<FormErrors>({});

  const {
    register,
    handleSubmit,
    reset: resetHookForm,
    formState: { errors: hookFormErrors, isValid },
  } = useForm<BasicFormValues>({
    resolver: zodResolver(basicFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      gender: '',
      acceptedTerms: false,
    },
  });

  const openModal = (nextVariant: FormVariant): void => {
    setVariant(nextVariant);
    setUncontrolledErrors({});
    resetHookForm();
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setUncontrolledErrors({});
    resetHookForm();
  };

  const mapSchemaErrors = (formError: { path: (string | number)[]; message: string }[]): FormErrors =>
    formError.reduce<FormErrors>((result, issue) => {
      const key = issue.path[0] as keyof BasicFormValues | undefined;
      if (!key || result[key]) {
        return result;
      }

      result[key] = issue.message;
      return result;
    }, {});

  const handleUncontrolledSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parseResult = basicFormSchema.safeParse({
      name: formData.get('name'),
      age: formData.get('age'),
      email: formData.get('email'),
      gender: formData.get('gender'),
      acceptedTerms: formData.has('acceptedTerms'),
    });

    if (!parseResult.success) {
      setUncontrolledErrors(mapSchemaErrors(parseResult.error.issues));
      return;
    }

    setUncontrolledErrors({});
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
              {uncontrolledErrors.name ? (
                <p className="app-form__error" role="alert">
                  {uncontrolledErrors.name}
                </p>
              ) : null}
            </div>

            <div className="app-form__field">
              <label htmlFor="age-uncontrolled">Age</label>
              <input id="age-uncontrolled" name="age" type="number" min={0} />
              {uncontrolledErrors.age ? (
                <p className="app-form__error" role="alert">
                  {uncontrolledErrors.age}
                </p>
              ) : null}
            </div>

            <div className="app-form__field">
              <label htmlFor="email-uncontrolled">Email</label>
              <input id="email-uncontrolled" name="email" type="email" />
              {uncontrolledErrors.email ? (
                <p className="app-form__error" role="alert">
                  {uncontrolledErrors.email}
                </p>
              ) : null}
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
            {uncontrolledErrors.gender ? (
              <p className="app-form__error" role="alert">
                {uncontrolledErrors.gender}
              </p>
            ) : null}

            <div className="app-form__field app-form__field--inline">
              <input id="terms-uncontrolled" name="acceptedTerms" type="checkbox" />
              <label htmlFor="terms-uncontrolled">I accept terms and conditions</label>
            </div>
            {uncontrolledErrors.acceptedTerms ? (
              <p className="app-form__error" role="alert">
                {uncontrolledErrors.acceptedTerms}
              </p>
            ) : null}

            <button type="submit">Submit uncontrolled form</button>
          </form>
        ) : (
          <form className="app-form" onSubmit={handleSubmit(handleHookFormSubmit)}>
            <div className="app-form__field">
              <label htmlFor="name-hook-form">Name</label>
              <input id="name-hook-form" type="text" {...register('name')} />
              {hookFormErrors.name ? (
                <p className="app-form__error" role="alert">
                  {hookFormErrors.name.message}
                </p>
              ) : null}
            </div>

            <div className="app-form__field">
              <label htmlFor="age-hook-form">Age</label>
              <input
                id="age-hook-form"
                type="number"
                min={0}
                {...register('age', { valueAsNumber: true })}
              />
              {hookFormErrors.age ? (
                <p className="app-form__error" role="alert">
                  {hookFormErrors.age.message}
                </p>
              ) : null}
            </div>

            <div className="app-form__field">
              <label htmlFor="email-hook-form">Email</label>
              <input id="email-hook-form" type="email" {...register('email')} />
              {hookFormErrors.email ? (
                <p className="app-form__error" role="alert">
                  {hookFormErrors.email.message}
                </p>
              ) : null}
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
            {hookFormErrors.gender ? (
              <p className="app-form__error" role="alert">
                {hookFormErrors.gender.message}
              </p>
            ) : null}

            <div className="app-form__field app-form__field--inline">
              <input id="terms-hook-form" type="checkbox" {...register('acceptedTerms')} />
              <label htmlFor="terms-hook-form">I accept terms and conditions</label>
            </div>
            {hookFormErrors.acceptedTerms ? (
              <p className="app-form__error" role="alert">
                {hookFormErrors.acceptedTerms.message}
              </p>
            ) : null}

            <button type="submit" disabled={!isValid}>
              Submit React Hook Form
            </button>
          </form>
        )}
      </Modal>

      <SubmissionList />
    </main>
  );
}

export default App;
