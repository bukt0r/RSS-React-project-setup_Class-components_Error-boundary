import { useMemo, useState, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import Modal from './components/Modal/Modal';
import SubmissionList from './components/SubmissionList/SubmissionList';
import { useAppSelector } from './store/hooks';
import { selectCountries } from './store/selectors';
import { fileToBase64 } from './utils/fileToBase64';
import { getPasswordStrength } from './utils/passwordStrength';
import { createBasicFormSchema, type BasicFormValues } from './validation/formSchema';
import './App.css';

type FormVariant = 'uncontrolled' | 'react-hook-form';

type FormErrors = Partial<Record<keyof BasicFormValues, string>>;

function App() {
  const countries = useAppSelector(selectCountries);
  const basicFormSchema = useMemo(() => createBasicFormSchema(countries), [countries]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variant, setVariant] = useState<FormVariant>('uncontrolled');
  const [uncontrolledErrors, setUncontrolledErrors] = useState<FormErrors>({});
  const [uncontrolledPassword, setUncontrolledPassword] = useState('');

  const {
    register,
    handleSubmit,
    reset: resetHookForm,
    control,
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
      password: '',
      confirmPassword: '',
      country: '',
    },
  });
  const hookFormPassword = useWatch({ control, name: 'password', defaultValue: '' });

  const openModal = (nextVariant: FormVariant): void => {
    setVariant(nextVariant);
    setUncontrolledErrors({});
    setUncontrolledPassword('');
    resetHookForm();
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setUncontrolledErrors({});
    setUncontrolledPassword('');
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

  const handleUncontrolledSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parseResult = basicFormSchema.safeParse({
      name: formData.get('name'),
      age: formData.get('age'),
      email: formData.get('email'),
      gender: formData.get('gender'),
      acceptedTerms: formData.has('acceptedTerms'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      country: formData.get('country'),
      imageFile: formData.get('imageFile'),
    });

    if (!parseResult.success) {
      setUncontrolledErrors(mapSchemaErrors(parseResult.error.issues));
      return;
    }

    setUncontrolledErrors({});
    await fileToBase64(parseResult.data.imageFile);
  };

  const handleHookFormSubmit = async (data: BasicFormValues): Promise<void> => {
    await fileToBase64(data.imageFile);
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

            <div className="app-form__field">
              <label htmlFor="password-uncontrolled">Password</label>
              <input
                id="password-uncontrolled"
                name="password"
                type="password"
                onChange={(event) => setUncontrolledPassword(event.target.value)}
              />
              <p className="app-form__hint">
                Strength: {getPasswordStrength(uncontrolledPassword)}
              </p>
              {uncontrolledErrors.password ? (
                <p className="app-form__error" role="alert">
                  {uncontrolledErrors.password}
                </p>
              ) : null}
            </div>

            <div className="app-form__field">
              <label htmlFor="confirm-password-uncontrolled">Confirm password</label>
              <input
                id="confirm-password-uncontrolled"
                name="confirmPassword"
                type="password"
              />
              {uncontrolledErrors.confirmPassword ? (
                <p className="app-form__error" role="alert">
                  {uncontrolledErrors.confirmPassword}
                </p>
              ) : null}
            </div>

            <div className="app-form__field">
              <label htmlFor="country-uncontrolled">Country</label>
              <input
                id="country-uncontrolled"
                name="country"
                type="text"
                list="countries-list"
                autoComplete="off"
              />
              <datalist id="countries-list">
                {countries.map((country) => (
                  <option key={country} value={country} />
                ))}
              </datalist>
              {uncontrolledErrors.country ? (
                <p className="app-form__error" role="alert">
                  {uncontrolledErrors.country}
                </p>
              ) : null}
            </div>

            <div className="app-form__field">
              <label htmlFor="image-uncontrolled">Image (png/jpeg, max 2 MB)</label>
              <input id="image-uncontrolled" name="imageFile" type="file" accept="image/png,image/jpeg" />
              {uncontrolledErrors.imageFile ? (
                <p className="app-form__error" role="alert">
                  {uncontrolledErrors.imageFile}
                </p>
              ) : null}
            </div>

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

            <div className="app-form__field">
              <label htmlFor="password-hook-form">Password</label>
              <input id="password-hook-form" type="password" {...register('password')} />
              <p className="app-form__hint">Strength: {getPasswordStrength(hookFormPassword ?? '')}</p>
              {hookFormErrors.password ? (
                <p className="app-form__error" role="alert">
                  {hookFormErrors.password.message}
                </p>
              ) : null}
            </div>

            <div className="app-form__field">
              <label htmlFor="confirm-password-hook-form">Confirm password</label>
              <input
                id="confirm-password-hook-form"
                type="password"
                {...register('confirmPassword')}
              />
              {hookFormErrors.confirmPassword ? (
                <p className="app-form__error" role="alert">
                  {hookFormErrors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <div className="app-form__field">
              <label htmlFor="country-hook-form">Country</label>
              <input
                id="country-hook-form"
                type="text"
                list="countries-list"
                autoComplete="off"
                {...register('country')}
              />
              {hookFormErrors.country ? (
                <p className="app-form__error" role="alert">
                  {hookFormErrors.country.message}
                </p>
              ) : null}
            </div>

            <div className="app-form__field">
              <label htmlFor="image-hook-form">Image (png/jpeg, max 2 MB)</label>
              <input
                id="image-hook-form"
                type="file"
                accept="image/png,image/jpeg"
                {...register('imageFile')}
              />
              {hookFormErrors.imageFile ? (
                <p className="app-form__error" role="alert">
                  {hookFormErrors.imageFile.message as string}
                </p>
              ) : null}
            </div>

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
