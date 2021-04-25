<script>
  import createForm from '../src/index';
  import { required, email, min } from './validators';

  const DOCS_URL = 'https://github.com/vkhalikov/svelte-easy-form#svelte-easy-form';
  const NPM_URL = 'https://www.npmjs.com/package/@vkhalikov/svelte-easy-form';

  let options = {
    validateOnInput: true,
  };

  const schema = {
    username: {
      validators: [required('Username is required')],
      type: 'text',
    },
    email: {
      validators: [required('Email is required'), email('Invalid email')],
      type: 'email',
    },
    password: {
      validators: [required('Password is required'), min('Password must contain at least 5 characters', 5)],
      type: 'password',
    },
  };

  $: ({ values, errors, onInput, onSubmit } = createForm(schema, options));

</script>

<div class="app">
  <nav class="navbar navbar-light border-bottom shadow-sm">
    <div class="container">
      <a class="navbar-brand" href="#">Svelte Easy Form</a>
      <div class="navbar-nav">
<!--        <a href={NPM_URL} target="_blank" class="nav-link fs-4 text-center"><i class="fab fa-npm"></i></a>-->
        <a href={DOCS_URL} target="_blank" class="btn btn-outline-dark fs-6">DOCS</a>
      </div>
    </div>
  </nav>

  <main class="content container mt-2 mt-lg-5">
    <div class="row justify-content-center p-2">
      <div class="col-lg-2"></div>
      <div class="form col-lg-4 p-3 border border-dark border-2 rounded-3">
        <h2 class="mb-3">Form Example</h2>

        <form on:submit={onSubmit}>
          {#each Object.entries(schema) as [name, { type }]}
            <div class="mb-3">
              <label for={name} class="form-label text-capitalize">{name}</label>
              <input
                  {type}
                  {name}
                  class="form-control"
                  class:is-invalid={!!$errors[name]}
                  id={name}
                  value={$values[name]}
                  on:input={onInput}
              />

              {#if $errors[name]}
                <div class="form-text text-danger">{$errors[name]}</div>
              {/if}
            </div>
          {/each}

          <button class="btn btn-secondary" type="submit">SIGN UP</button>
        </form>
      </div>

      <div class="options col-lg-auto align-self-start border-start border-2 ms-lg-3 mt-4 mt-lg-0 p-3">
        <h2 class="mb-3">Options</h2>

        {#each Object.keys(options) as option}
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id={option} bind:checked={options[option]} />
            <label class="form-check-label" for={option}>
              {option}
            </label>
          </div>
        {/each}
      </div>
    </div>
  </main>
</div>


<style>
  :root {
    width: 100%;
    height: 100%;
    --clr-prime: hsl(15, 100%, 50%);
    --clr-text: 	hsl(0, 0%, 25%);
    --bg-light: hsl(0, 0%, 97%);
  }

  :global(body) {
    height: 100%;
    width: 100%;
    background-color: var(--bg-light);
  }

  .app {
    font-family: 'Roboto Condensed', sans-serif;
  }
</style>
