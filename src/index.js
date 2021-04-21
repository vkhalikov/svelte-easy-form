import { writable, get } from 'svelte/store';

const createStore = (initialValue) => {
  const { subscribe, update } = writable(initialValue);

  const updateField = (name, value) => {
    update((state) => ({ ...state, [name]: value }));
  };

  return { subscribe, update, updateField };
};

const createErrorsStore = (schema) => {
  const initialState = {};

  Object.keys(schema).forEach((name) => {
    initialState[name] = null;
  });

  return createStore(initialState);
};

const createValuesStore = (schema) => {
  const initialState = {};

  Object.keys(schema).forEach((name) => {
    initialState[name] = schema[name].value || '';
  });

  return createStore(initialState);
};

function createForm(schema, { validateOnInput = true, submitHandler } = {}) {
  const values = createValuesStore(schema);
  const errors = createErrorsStore(schema);

  const dirtyFields = new Set();

  const isDirty = (name) => dirtyFields.has(name);

  const markDirty = (name) => {
    dirtyFields.add(name);
  };

  const hasValidators = (name) => !!schema[name].validators;

  const validate = (name, value) => {
    const validators = schema[name].validators;
    let invalid = false;

    for (let validator of validators) {
      const validationError = validator(value);

      if (validationError) {
        invalid = true;
        errors.updateField(name, validationError);
        break;
      }
    }

    if (!invalid) {
      errors.updateField(name, null);
    }

    return !invalid;
  };

  const validateAll = (values) => {
    let isFormInvalid = false;

    Object.entries(values).forEach(([name, value]) => {
      if (hasValidators(name)) {
        const isFieldValid = validate(name, value);

        if (!isFieldValid) {
          isFormInvalid = true;
        }
      }
    });

    return !isFormInvalid;
  };

  const onBlur = ({ target: { name, value } }) => {
    if (!isDirty(name)) {
      markDirty(name);
    }

    if (hasValidators(name)) {
      validate(name, value);
    }
  };

  const onInput = ({ target }) => {
    const { name, value } = target;

    if (!isDirty(name)) {
      target.addEventListener('blur', onBlur);
    }

    values.updateField(name, value);

    const shouldValidate = validateOnInput && hasValidators(name) && isDirty(name);

    if (shouldValidate) {
      validate(name, value);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const valuesState = get(values);
    const isFormValid = validateAll(valuesState);

    if (!isFormValid) return;

    if (submitHandler) {
      submitHandler(valuesState, e);
    } else {
      e.target.submit();
    }
  };

  return { values, errors, onInput, onSubmit };
}

export default createForm;
