export const required = (message) => (val) => {
  if (!val) {
    return message;
  }

  return null;
};

export const min = (message, threshold) => (val) => {
  if (val.length <= threshold) {
    return message;
  }

  return null;
};

export const email = (message) => (val) => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (!emailRegex.test(val)) {
    return message;
  }

  return null;
};
