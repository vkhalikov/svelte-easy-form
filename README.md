# Svelte Easy Form
A simple, easy to use form state and validation handler for [Svelte](https://svelte.dev).

**Table of Content**
- [Installation](#installation)
- [Live example](#live-example)
- [Basic usage](#basic-usage)
- [API](#api)
    - [createForm](#createform)
        - [Schema](#schema)
            - [Field](#field)
    - [Validator](#validator)
    - [Options](#options)
        - [validateOnInput](#validateoninput)
        - [submitHandler](#submithandler)
    - [FormModel](#formmodel)
        - [values and errors](#values-and-errors)
        - [onInput](#oninput)
        - [onBlur](#onblur)
        - [onSubmit](#onsubmit)
- [Contributing](#contributing)
- [Current development state](#current-development-state)


## Installation

```sh
npm install @vkhalikov/svelte-easy-form
```

## Live Example

Live example with different options is available [here](https://vkhalikov.github.io/svelte-easy-form).

## Basic usage

1. Create a form model with `createForm`
    ```javascript
      import createForm from '@vkhalikov/svelte-easy-form';
    
      // Declare a schema with initial values and validators
      const schema = {
        username: {
          value: 'admin',
          validators: [required('Login is required')],
        },
        password: {
          validators: [required('Password is required')],
        },
      };
    
      const { values, errors, onInput, onSubmit } = createForm(schema);
    ```
    > NOTE: Validators are not included in the package. See [validator](#validator) for details.
2. Use it in your markup
    1. Create a form and pass it a submit handler. It will be called if all values are valid.
        ```html
         <form on:submit="{onSubmit}" action="https://myformhandler.com" method="post">
         </form>
        ```
       If you want a custom handler, you can use [`submitHandler`](#submithandler) option.
    2. Create inputs.
        ```html
          <form on:submit="{onSubmit}" action="https://myformhandler.com" method="post">
            <input type="text" name="username" value="{$values.username}" on:input="{onInput}" />
            <input type="password" name="password" value="{$values.password}" on:input="{onInput}" />
          </form>
        ```
        > NOTE: attributes `name`, `value`, `on:input` are required.

        > NOTE: `values` is a `svelte` store, therefore you can access it with a `$` prefix.
    3. Show validation errors.
        ```html
          <form on:submit="{onSubmit}" action="https://myformhandler.com" method="post">
            <input type="text" name="username" value="{$values.username}" on:input="{onInput}" />
            {#if $errors.username}
               {$errors.username}  // Render it as is
            {/if}
    
            <input type="password" name="password" value="{$values.password}" on:input="{onInput}" />
            <ValidationError error="{$errors.password}" /> // Or create a component
          </form>
        ```
       > NOTE: `errors` is a `svelte` store, therefore you can access it with a `$` prefix.

## API
### `createForm`
```typescript
type CreateForm = (schema: Schema, options?: Options) => FormModel;
```

---

### `Schema`
A schema is an object, that contains `Fields` which are used to construct a [`FormModel`](#formmodel).
```typescript
interface Schema {
  [fieldName: string]: Field;
}
```

### `Field`
```typescript
interface Field {
  value?: any; // Initial value
  validators?: [Validator];
}
```

> NOTE: If you don't need to set an initial value and validators for a field, you should still define a `Field` in `Schema` as an empty object:

```javascript
const schema = {
  name: {},
}
```

### `Validator`
Validator is a function that receives a field value and returns a validation error in any form if the value is invalid or `null`.
```typescript
type Validator = (value: any) => any;
```

---

### `Options`
```typescript
interface Options {
  validateOnInput?: boolean;
  submitHandler?: SubmitHandler;
}
```

#### `validateOnInput`
Defaults to `true`

Defines whether the field should be validated immediately after a change. As user types in a symbol for example.
If set to `false`, the field is validated on **blur** and **submit**.

#### `submitHandler`
Defaults to `undefined`

```typescript
type SubmitHandler = (values: Writable, event: Event) => void;
```

If provided, `SubmitHandler` will be used instead of a default browser submit handler.

---

### `FormModel`
A form model that is returned from [`createForm`](#createform) function.

```typescript
interface FormModel {
  values: Writable;
  errors: Writable;
  onInput: (e: Event) => void;
  onSubmit: (e: Event) => void;
}
```

#### `values` and `errors`
A `Writable` svelte stores, that contain current values and errors, that are accessible via `$` prefix.
 
If you are unfamiliar with svelte stores, see the [tutorial](https://svelte.dev/docs#svelte_store).

#### `onInput`
An event handler that updates and validates a value.

Should be passed to an input as `on:input` attribute.

>NOTE: A value is not validated on input if the `validateOnInput` option is set to `false`.

#### `onSubmit`
An event handler that does 2 things:

1. Validate all values for which validators were provided.
2. If all values are valid:
    - If a [`SubmitHandler`](#submithandler) is provided, it will be called with the following arguments: `(values, originalEvent)`
    - Otherwise a default browser submit handler will be called

`onSubmit` should be passed to a form as `on:submit` attribute.

## Contributing
Any feedback is welcomed. If you want to propose changes follow these steps:
1. [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) the repo
2. [Clone](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) the fork
3. Create a branch - `git checkout -b {prefix}/new-feature`
    
    Prefixes: `feat` for features, `fix` for fixes
4. Make your changes and commit `git commit -a - m "short description"`
5. Push changes `git push origin {prefix}/new-feature`
6. [Create](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork) new Pull Request
    > NOTE: Please provide a description to your changes and [link an issue](https://docs.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue) if it's a bugfix

## Current Development State
The project is in beta, therefore anything might be changed in the future
