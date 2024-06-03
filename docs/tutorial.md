# Tutorial

> NOTE
> 
> If you setted up Creatif with a starter project, everything in this
> tutorial is already setup. It is still better for you to follow this
> tutorial to familiarize yourself with the concepts of Creatif.
> 
> If you decided to not set up a starter project, you will 
> get a configuration error. This is normal
> since you don't have any structures yet. After you set up the first 
> structure, the error will disappear and you be able to login. 

In this tutorial, you will create a simple CMS for real estate agency. It will
consist of two structures: Accounts and Properties. Account will be an owner of the 
property and Property will be the real estate that the owner sells or rents.

For now, we will just set up the project. How and why it works this way and other
Creatif concepts will be explained later. 

# Setting up Accounts form

Let's create the Accounts form. Create a file named `AccountForm.tsx` and copy/paste this
code into it.

`````tsx
import { Form, InputText } from 'creatif-ui-sdk';
import css from './css/root.module.css';

export function AccountForm() {
    return (
        <Form<{
            name: string;
            lastName: string;
            address: string;
            city: string;
            postalCode: string;
        }>
            bindings={{
                name: (values) => `${values.name}-${values.lastName}-${values.address}`,
            }}
            formProps={{
                defaultValues: {
                    name: '',
                    lastName: '',
                    address: '',
                    city: '',
                    postalCode: '',
                },
            }}
            inputs={(submitButton) => (
                <>
                    <div className={css.fieldGrid}>
                        <div>
                            <InputText
                                label="Name"
                                name="name"
                                options={{
                                    required: 'Name is required',
                                }}
                            />
                        </div>

                        <div>
                            <InputText
                                label="Last name"
                                name="lastName"
                                options={{
                                    required: 'Last name is required',
                                }}
                            />
                        </div>

                        <div>
                            <InputText
                                label="Address"
                                name="address"
                                options={{
                                    required: 'Address is required',
                                }}
                            />
                        </div>

                        <div>
                            <InputText
                                label="City"
                                name="city"
                                options={{
                                    required: 'City is required',
                                }}
                            />
                        </div>

                        <div>
                            <InputText
                                label="Postal code"
                                name="postalCode"
                                options={{
                                    required: 'City is required',
                                }}
                            />
                        </div>
                    </div>

                    <div className={css.submitButton}>{submitButton}</div>
                </>
            )}
        />
    );
}
`````

We also need to create CSS for this form. Create a new `css` directory with a 
file called `root.module.css` and copy/paste the code below:

`````css
.fieldGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    align-content: center;
    gap: 1rem;

    margin-top: 1rem;
}

.houseDetailsHeader {
    margin: 2rem 0 1rem 0;
    padding-bottom: 0.5rem;
    font-size: 1rem;

    font-weight: bold;
    border-bottom: 1px solid lightgray;
}

.accountNote {
    margin-top: 2rem;
    padding-top: 1rem;

    border-top: 1px solid lightgray;
}

.submitButton {
    display: flex;
    justify-content: flex-end;

    margin-top: 3rem;
}
`````

The last step is creating our app and configuration for the app. Create the `App.tsx`
and copy/paste this code:

`````tsx
import React from 'react';
import { CreatifProvider } from 'creatif-ui-sdk';
import { AccountForm } from './AccountForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                logo: 'Real Estate Manager',
                projectName: 'project',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Accounts',
                        form: <AccountForm />,
                    },
                ],
            }}
        />
    );
}
`````

If you haven't already, head to `http://localhost:5173` and set up the admin user
and login. You should see something like this.

After login, you should be able to see this image

![Nesting navbar](_images/tutorial_account_form_created.png 'Accounts form')

Go ahead and create a new account. Using it should be intuitive. 

# Let's examine what we created

If you look at the `AccountForm.tsx`, you would notice that we import `InputText` and `Form`
components from `creatif-ui-sdk` package. This package **is** Creatif. Creatif allows you to 
create any form you want. When you are ready to save the form, Creatif saves it for you. The form
can contain 'everything UI'. You can use modals, sidebars, progress components, wizards... Basically any form
component that you can imagine and any form experience. As long as you tell Creatif how your form looks like trough form fields,
everything is possible. This creates a unique experience for you and your clients since you don't
have to tell them 'No, we cannot make this feature since our ***insert CMS of your choice*** does not support it'.

The `Form` component is the component that tracks your form. It is a wrapper around [useForm](https://react-hook-form.com/docs/useform)
at it tracks if this structure needs to be created or updated.
Every new structure must use the Form component. Under the hood, Creatif uses `react-hook-form`
and it would be good to familiarize yourself with it, but for basic usage, it is ok to use this documentation. 

`Form` is a generic component. In our example above, we specified the type for our form:

`````tsx
<Form<{
    name: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
}>
`````

In our example, we inlined it but you can create an interface if you wish. 

Next, you can see the `formProps` property. 

`````tsx
formProps={{
    defaultValues: {
        name: '', 
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
    },
}}
`````

`formProps` accepts all arguments that `useForm` hook from [react-hook-form](https://react-hook-form.com/docs/useform)
accepts. Remember, `Form` is just a wrapper around `useForm` but Creatif also uses it to track weather to create
or update this structure (in our example, an Account). 

Next, there is the `bindings` prop. This prop is not part or `react-hook-form` but a special Creatif prop. 
Since every *map* or *list* structure must have a *name* field, `bindings` prop tells us what fields should we use
to name our structure. In case of a *map*, the *name* must be unique.

> NOTE
> 
> Remember, maps and list structures in Creatif are similar to data structures in any programming language.
> If you use a map in a programming language, a key must be unique. If you assign a value to a key that already
> exists, that value would overwrite the previous value. Creatif will give you an error if you try to create/update
> a map item with a name that already exists. 
> 
> In case of list structures in Creatif, they are unique only if you have a name and locale that are equal.
> If you try to create a list item with name and locale that already exists, form will result in an error.
> But if you wish to create a list item with the same name but different locale, you can.

Practically, you can imagine the reason behind this feature. There can be only one Account in the system; one person;
one client or whatever represents an Account. What that account "has" or "can do" can be represented with other
structures. In this tutorial, you will see how one account (one person) can sell/rent multiple properties. 

Lastly, we have the `InputText` component. What form will not be complete without form components?
Under the hood, Creatif uses the awesome [Mantine UI library](https://mantine.dev/). Mantine provides a wide
range of beautiful components and Creatif implements most of them. If you need a textarea, Creatif exports it
as `InputTextarea`. If you need a slider component, Creatif exports it as `InputSliderControlled`. You can see
the full list of components that Creatif exports in the [UI components](ui-components) section. 

These components are nothing special. Since Creatif uses Mantine UI, it was important to keep the form components uniform
with its UI, therefor Creatif implements more components that you will ever need (but will also implement more in the future).
But you are not limited to using only these components. As I said, these components are nothing more but implementations
around `react-hook-form` and you can easily create your own. In fact, here is the entire source code form `InputText`
component:

````tsx
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { TextInput } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
import type { TextInputProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';

interface Props extends TextInputProps {
    name: string;
    options?: RegisterOptions;
}

export function InputText({ name, options, ...rest }: Props) {
    const { register } = useFormContext();

    return <TextInput error={useFirstError(name)} {...register(name, options)} {...rest} />;
}

````

Nothing special. This is exactly what you would do If you were to create an abstraction around a text
input for your forms. Because of that, you are not limited to using Creatif components. You can use any UI
library or any exotic component that you can think of. All you need to do is wire it up with `react-hook-form`
and it will just work. There is a little gotcha, however but we will talk about custom components more in
[Custom components]() section.

# Setting up Properties form

