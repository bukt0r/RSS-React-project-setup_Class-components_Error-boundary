import { createBasicFormSchema } from './formSchema';

const countries = ['Ukraine', 'Canada'];
const schema = createBasicFormSchema(countries);

const validPayload = {
  name: 'Anna',
  age: 25,
  email: 'anna@example.com',
  gender: 'female',
  acceptedTerms: true,
  password: 'Strong123!',
  confirmPassword: 'Strong123!',
  country: 'Ukraine',
  imageFile: new File(['image'], 'avatar.png', { type: 'image/png' }),
};

describe('createBasicFormSchema', () => {
  it('accepts valid form data', () => {
    const result = schema.safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  it('requires an uppercase first letter in name', () => {
    const result = schema.safeParse({ ...validPayload, name: 'anna' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Name must start with an uppercase letter');
  });

  it('rejects negative age values', () => {
    const result = schema.safeParse({ ...validPayload, age: -1 });

    expect(result.success).toBe(false);
  });

  it('requires passwords to match', () => {
    const result = schema.safeParse({
      ...validPayload,
      confirmPassword: 'Different123!',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.message === 'Passwords must match')).toBe(
      true,
    );
  });

  it('validates country against stored list', () => {
    const result = schema.safeParse({ ...validPayload, country: 'Unknownland' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Country must be selected from the list');
  });

  it('validates image type and size', () => {
    const invalidType = schema.safeParse({
      ...validPayload,
      imageFile: new File(['image'], 'avatar.gif', { type: 'image/gif' }),
    });
    const tooLarge = schema.safeParse({
      ...validPayload,
      imageFile: new File([new Uint8Array(3 * 1024 * 1024)], 'avatar.png', {
        type: 'image/png',
      }),
    });

    expect(invalidType.success).toBe(false);
    expect(tooLarge.success).toBe(false);
  });
});
