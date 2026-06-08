import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import Modal from './components/Modal/Modal';
import PasswordStrengthIndicator from './components/PasswordStrengthIndicator/PasswordStrengthIndicator';
import SubmissionList from './components/SubmissionList/SubmissionList';
import { addSubmission } from './store/formSubmissionsSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectCountries } from './store/selectors';
import type { FormSource } from './types/formSubmission';
import { createSubmission } from './utils/createSubmission';
import type { ZodIssue } from 'zod';
import {
  createBasicFormSchema,
  type BasicFormInput,
  type BasicFormValues,
} from './validation/formSchema';
import './App.css';

type FormVariant = 'uncontrolled' | 'react-hook-form';

type FormErrors = Partial<Record<keyof BasicFormValues, string>>;

const HIGHLIGHT_DURATION_MS = 3000;

function App() {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);
  const basicFormSchema = useMemo(() => createBasicFormSchema(countries), [countries]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variant, setVariant] = useState<FormVariant>('uncontrolled');
  const [uncontrolledErrors, setUncontrolledErrors] = useState<FormErrors>({});
  const [uncontrolledPassword, setUncontrolledPassword] = useState('');
  const [highlightedSubmissionId, setHighlightedSubmissionId] = useState<string | null>(null);
  const uncontrolledFormRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset: resetHookForm,
    control,
    formState: { errors: hookFormErrors, isValid },
  } = useForm<BasicFormInput, unknown, BasicFormValues>({
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
  const hookFormPassword = useWatch({ control, name: 'password', defaultValue: '' }) as string;

  useEffect(() => {
    if (!highlightedSubmissionId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHighlightedSubmissionId(null);
    }, HIGHLIGHT_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [highlightedSubmissionId]);

  const resetUncontrolledForm = (): void => {
    uncontrolledFormRef.current?.reset();
    setUncontrolledPassword('');
    setUncontrolledErrors({});
  };

  const openModal = (nextVariant: FormVariant): void => {
    setVariant(nextVariant);
    resetUncontrolledForm();
    resetHookForm();
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    resetHookForm();
    resetUncontrolledForm();
  };

  const mapSchemaErrors = (formError: ZodIssue[]): FormErrors =>
    formError.reduce<FormErrors>((result, issue) => {
      const key = issue.path[0];
      if (typeof key !== 'string' || !key || result[key as keyof BasicFormValues]) {
        return result;
      }

      result[key as keyof BasicFormValues] = issue.message;
      return result;
    }, {});

  const finishSubmission = async (
    data: BasicFormValues,
    source: FormSource,
  ): Promise<void> => {
    const submission = await createSubmission(data, source);
    dispatch(addSubmission(submission));
    setHighlightedSubmissionId(submission.id);
    setIsModalOpen(false);
    resetHookForm();
  };

  const handleUncontrolledSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageInput = form.elements.namedItem('imageFile') as HTMLInputElement | null;
    const parseResult = basicFormSchema.safeParse({
      name: formData.get('name'),
      age: formData.get('age'),
      email: formData.get('email'),
      gender: formData.get('gender'),
      acceptedTerms: formData.has('acceptedTerms'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      country: formData.get('country'),
      imageFile: imageInput?.files?.[0] ?? formData.get('imageFile'),
    });

    if (!parseResult.success) {
      setUncontrolledErrors(mapSchemaErrors(parseResult.error.issues));
      return;
    }

    await finishSubmission(parseResult.data, 'uncontrolled');
    resetUncontrolledForm();
  };

  const handleHookFormSubmit = async (data: BasicFormValues): Promise<void> => {
    await finishSubmission(data, 'react-hook-form');
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
          <form
            ref={uncontrolledFormRef}
            className="app-form"
            onSubmit={handleUncontrolledSubmit}
          >
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
              <PasswordStrengthIndicator password={uncontrolledPassword} />
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
              <PasswordStrengthIndicator password={hookFormPassword ?? ''} />
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

      <SubmissionList highlightedSubmissionId={highlightedSubmissionId} />
    </main>
  );
}

export default App;
