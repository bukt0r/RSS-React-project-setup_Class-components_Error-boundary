export type FormSource = 'uncontrolled' | 'react-hook-form';

export interface FormSubmission {
  id: string;
  source: FormSource;
  name: string;
  age: number;
  email: string;
  gender: string;
  acceptedTerms: boolean;
  country: string;
  imageBase64: string;
  submittedAt: number;
}
