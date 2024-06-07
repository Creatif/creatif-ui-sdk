# Locales

Creatif is internalized by default. Every entry you create is created with the
`eng` locale. You can change the locale in two ways

- Globally
- Locally in form

# Changing locale globally

In the upper right corner, there is a language list dropdown. Use it to change
the locale globally. 

![Changing locale](_images/locales_change_globally.png 'Changing locale')

This will change the locale globally and every new entry that you create will
be created with this locale.

> IMPORTANT
> 
> If you change the locale globally, but still create the inputLocale() field
> in you form, inputLocale() takes precedence. 

# Changing locale in form

To change to locale in form, render the `inputLocale()` function in your form.

`````tsx
// rest of form

inputs={submitButton, {inputLocale}}

//rest of form
`````

This will render a dropdown `select` component. If you choose this method, chosen locale
in form will be selected as the locale of this entry, not the globally selected locale.

# inputLocale() validation

Dropdown field rendered by `inputLocale()` is required by default. You can change that by providing
your on validation object

````tsx
inputLocale({
    validation: {
        required: null,
    }
})
````

This will disable validation. If you have any other validation requirements, 
you can use `react-hook-form` [documentation](https://react-hook-form.com/docs/useform/register). 
The field accepts the same arguments and `react-hook-form` for validation.