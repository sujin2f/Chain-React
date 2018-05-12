const required = value => (value ? undefined : 'Required');

export const number = (value) => {
  const result = value && Number.isNaN(Number(value)) ? 'Must be a number' : undefined;
  return result;
};

export const email = (value) => {
  const result = value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;
  return result;
};

export const phoneNumber = (value) => {
  const result = value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined;
  return result;
};

export default required;
