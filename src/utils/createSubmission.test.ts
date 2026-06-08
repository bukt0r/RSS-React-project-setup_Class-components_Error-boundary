import type { BasicFormValues } from '../validation/formSchema';
import { createSubmission } from './createSubmission';
import * as fileToBase64Module from './fileToBase64';

const formData: BasicFormValues = {
  name: 'Anna',
  age: 25,
  email: 'anna@example.com',
  gender: 'female',
  acceptedTerms: true,
  password: 'Strong123!',
  confirmPassword: 'Strong123!',
  country: 'Ukraine',
  imageFile: new File(['image-content'], 'avatar.png', { type: 'image/png' }),
};

describe('createSubmission', () => {
  it('builds a submission with base64 image and metadata', async () => {
    const uuidSpy = vi
      .spyOn(crypto, 'randomUUID')
      .mockReturnValue('00000000-0000-4000-8000-000000000001');
    const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
    const fileSpy = vi
      .spyOn(fileToBase64Module, 'fileToBase64')
      .mockResolvedValue('data:image/png;base64,abc');

    const submission = await createSubmission(formData, 'uncontrolled');

    expect(fileSpy).toHaveBeenCalledWith(formData.imageFile);
    expect(submission).toEqual({
      id: '00000000-0000-4000-8000-000000000001',
      source: 'uncontrolled',
      name: 'Anna',
      age: 25,
      email: 'anna@example.com',
      gender: 'female',
      acceptedTerms: true,
      country: 'Ukraine',
      imageBase64: 'data:image/png;base64,abc',
      submittedAt: 1_700_000_000_000,
    });

    uuidSpy.mockRestore();
    dateSpy.mockRestore();
    fileSpy.mockRestore();
  });
});
