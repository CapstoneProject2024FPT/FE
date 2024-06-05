export const patternValidate = {
  password:
    /^(?=.*[a-zA-Z])(?=.*d)(?=.*[!@#$%^&*()_+])[A-Za-zd][A-Za-zd!@#$%^&*()_+]{7,19}$/,
  phone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  // eslint-disable-next-line no-useless-escape
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};
