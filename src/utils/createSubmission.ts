import type { FormSource, FormSubmission } from '../types/formSubmission';
import type { BasicFormValues } from '../validation/formSchema';
import { fileToBase64 } from './fileToBase64';

export const createSubmission = async (
  data: BasicFormValues,
  source: FormSource,
): Promise<FormSubmission> => {
  const imageBase64 = await fileToBase64(data.imageFile);

  return {
    id: crypto.randomUUID(),
    source,
    name: data.name,
    age: data.age,
    email: data.email,
    gender: data.gender,
    acceptedTerms: data.acceptedTerms,
    country: data.country,
    imageBase64,
    submittedAt: Date.now(),
  };
};
