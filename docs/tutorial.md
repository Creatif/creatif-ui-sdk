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

```tsx
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
```

We also need to create CSS for this form. Create a new `css` directory with a
file called `root.module.css` and copy/paste the code below:

```css
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
```

The last step is creating our app and configuration for the app. Create the `App.tsx`
and copy/paste this code:

```tsx
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
```

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
have to tell them 'No, we cannot make this feature since our **_insert CMS of your choice_** does not support it'.

The `Form` component is the component that tracks your form. It is a wrapper around [useForm](https://react-hook-form.com/docs/useform)
at it tracks if this structure needs to be created or updated.
Every new structure must use the Form component. Under the hood, Creatif uses `react-hook-form`
and it would be good to familiarize yourself with it, but for basic usage, it is ok to use this documentation.

`Form` is a generic component. In our example above, we specified the type for our form:

```tsx
<Form<{
    name: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
}>
```

In our example, we inlined it but you can create an interface if you wish.

Next, you can see the `formProps` property.

```tsx
formProps={{
    defaultValues: {
        name: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
    },
}}
```

`formProps` accepts all arguments that `useForm` hook from [react-hook-form](https://react-hook-form.com/docs/useform)
accepts. Remember, `Form` is just a wrapper around `useForm` but Creatif also uses it to track weather to create
or update this structure (in our example, an Account).

Next, there is the `bindings` prop. This prop is not part or `react-hook-form` but a special Creatif prop.
Since every _map_ or _list_ structure must have a _name_ field, `bindings` prop tells us what fields should we use
to name our structure. In case of a _map_, the _name_ must be unique.

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

We now have the `InputText` component. What form will not be complete without form components?
Under the hood, Creatif uses the awesome [Mantine UI library](https://mantine.dev/). Mantine provides a wide
range of beautiful components and Creatif implements most of them. If you need a textarea, Creatif exports it
as `InputTextarea`. If you need a slider component, Creatif exports it as `InputSliderControlled`. You can see
the full list of components that Creatif exports in the [UI components](ui-components) section.

Lastly, we have our `submitButton` component. This component is provided for you and is required in every Creatif
form that you create.

These components are nothing special. Since Creatif uses Mantine UI, it was important to keep the form components uniform
with its UI, therefor Creatif implements more components that you will ever need (but will also implement more in the future).
But you are not limited to using only these components. As I said, these components are nothing more but implementations
around `react-hook-form` and you can easily create your own. In fact, here is the entire source code form `InputText`
component:

```tsx
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
```

Nothing special. This is exactly what you would do If you were to create an abstraction around a text
input for your forms. Because of that, you are not limited to using Creatif components. You can use any UI
library or any exotic component that you can think of. All you need to do is wire it up with `react-hook-form`
and it will just work. There is a little gotcha, however but we will talk about custom components more in
[Custom components]() section.

# Setting up Properties form

Our properties form will represent actual properties for our fictional real estate agency. I intentionally made
it somewhat long so there will be quite amount of copy/pasting. Before we create the actual form, let's
break it down into multiple components right away so we don't get bogged down in the details of component management
and go straight to how Creatif works. For now, follow along and just create these components. After we make
everything work, I will explain what is going on.

Create a directory called `components`. We are going to create five components in this directory.

Create a file named `ApartmentForm.tsx` and put it into the `components` directory.

```tsx
import { InputCheckbox, InputNumberControlled } from 'creatif-ui-sdk';
import { useCreatifFormContext } from 'creatif-ui-sdk';
import css from '../css/root.module.css';

export function ApartmentForm() {
    const { watch } = useCreatifFormContext();
    const apartmentBalcony = watch('apartmentBalcony');

    return (
        <div>
            <h1 className={css.houseDetailsHeader}>APARTMENT DETAILS</h1>

            <div className={css.fieldGrid}>
                <div>
                    <InputNumberControlled
                        name="apartmentFloorNumber"
                        label="Floor number"
                        validation={{
                            required: 'Floor number is required',
                        }}
                    />
                </div>

                <div>
                    <InputNumberControlled
                        name="apartmentSize"
                        label="Size (in meters squared)"
                        validation={{
                            required: 'Size is required',
                        }}
                    />
                </div>

                <div>
                    <InputNumberControlled
                        name="apartmentLocalPrice"
                        label="Local price (in meters squared)"
                        validation={{
                            required: 'Local price is required',
                        }}
                    />
                </div>

                <div>
                    <InputCheckbox name="apartmentBalcony" label="Has balcony?" />
                </div>
            </div>

            <div className={css.fieldGrid}>
                {apartmentBalcony && (
                    <div>
                        <InputNumberControlled
                            name="apartmentBalconySize"
                            label="Balcony size"
                            validation={{
                                required: 'Balcony size is required',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
```

Create a file named `HouseForm.tsx` and put it in the `components` directory.

```tsx
import { InputCheckbox, InputNumberControlled, InputTextarea } from 'creatif-ui-sdk';
import { useCreatifFormContext } from 'creatif-ui-sdk';
import css from '../css/root.module.css';

export function HouseForm() {
    const { watch } = useCreatifFormContext();

    const backYard = watch('houseBackYard');
    const needsRepair = watch('houseNeedsRepair');

    return (
        <div>
            <h1 className={css.houseDetailsHeader}>HOUSE DETAILS</h1>

            <div className={css.fieldGrid}>
                <div>
                    <InputNumberControlled
                        name="numOfHouseFloors"
                        label="Number of floors"
                        validation={{
                            required: 'Number of floors is required',
                        }}
                    />
                </div>

                <div>
                    <InputNumberControlled
                        name="houseSize"
                        label="Size"
                        description="In meters squared"
                        validation={{
                            required: 'Size is required',
                        }}
                    />
                </div>

                <div>
                    <InputNumberControlled
                        name="houseLocalPrice"
                        label="Local price"
                        description="Per meters squared"
                        validation={{
                            required: 'Local price is required',
                        }}
                    />
                </div>

                <div>
                    <InputCheckbox name="houseBackYard" label="Has back yard?" />
                </div>

                <div>
                    <InputCheckbox name="houseNeedsRepair" label="Need repair?" />
                </div>
            </div>

            <div className={css.fieldGrid}>
                {backYard && (
                    <div>
                        <InputNumberControlled
                            name="houseBackYardSize"
                            label="Back yard size"
                            description="Size in meters squared"
                            validation={{
                                required: 'Back yard size is required',
                            }}
                        />
                    </div>
                )}

                {needsRepair && (
                    <div
                        style={{
                            gridColumn: 'span 2',
                        }}>
                        <InputTextarea
                            description="The description should be as detailed as possible"
                            resize="both"
                            autosize={true}
                            minRows={2}
                            maxRows={10}
                            name="houseRepairNote"
                            label="Describe the repairs"
                            options={{
                                required: 'Note is required',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
```

Create a component named `StudioForm.tsx` and put it into `components` directory.

```tsx
import { InputNumberControlled } from 'creatif-ui-sdk';
import css from '../css/root.module.css';

export function StudioForm() {
    return (
        <div>
            <h1 className={css.houseDetailsHeader}>STUDIO DETAILS</h1>

            <div className={css.fieldGrid}>
                <div>
                    <InputNumberControlled
                        name="studioFloorNumber"
                        label="Floor number"
                        validation={{
                            required: 'Floor number is required',
                        }}
                    />
                </div>

                <div>
                    <InputNumberControlled
                        name="studioSize"
                        label="Size (in meters squared)"
                        validation={{
                            required: 'Size is required',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
```

Create a component named `LandForm.tsx` and put it into `components` directory.

```tsx
import { InputCheckbox, InputNumberControlled } from 'creatif-ui-sdk';
import css from '../css/root.module.css';

export function LandForm() {
    return (
        <div>
            <h1 className={css.houseDetailsHeader}>APARTMENT DETAILS</h1>

            <div className={css.fieldGrid}>
                <div>
                    <InputNumberControlled
                        name="landSize"
                        label="Size (in meters squared)"
                        validation={{
                            required: 'Size is required',
                        }}
                    />
                </div>

                <div>
                    <InputCheckbox name="hasConstructionPermit" label="Has construction Permit?" />
                </div>
            </div>
        </div>
    );
}
```

Create a component named `RichTextEditor.tsx` and put it into `components` directory.

```tsx
import { useEffect, useRef, useTransition } from 'react';
import Quill from 'quill';
import type { QuillOptions } from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import type { Delta } from 'quill/core';
import { useCreatifFormContext, useCreatifController } from 'creatif-ui-sdk';

interface Props {
    name: string;
    placeholder?: string;
}

export function RichTextEditor({ name, placeholder }: Props) {
    const { control, setValue, getValues } = useCreatifFormContext();
    const containerRef = useRef();
    const deltaRef = useRef<typeof Delta>(Quill.import('delta'));
    const quillRef = useRef<Quill>(null);
    const [_, setTransition] = useTransition();

    const { field } = useCreatifController({
        name,
        control,
    });

    useEffect(() => {
        if (containerRef.current) {
            const options: QuillOptions = {
                debug: 'error',
                modules: {
                    toolbar: true,
                },
                placeholder: placeholder,
                theme: 'snow',
            };

            const quill = new Quill(containerRef.current, options);
            quillRef.current = quill;

            const defaultValue = getValues(name);
            if (defaultValue) {
                const delta = new deltaRef.current(defaultValue);
                quillRef.current.setContents(delta);
                setValue(name, delta);
            }

            quill.on('text-change', (delta) => {
                setTransition(() => {
                    field.onChange(delta);
                    setValue(name, quillRef.current.getContents());
                });
            });
        }
    }, []);

    return (
        <div>
            <label
                style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                }}>
                Account note
            </label>
            <div ref={containerRef} />
        </div>
    );
}
```

After you created all of these components, create `PropertyForm.tsx` and put it into the `src` directory
where `AccountForm.tsx` is.

> NOTE
>
> Just to note that so far, we have been putting components into `components` directory but
> the `PropertyForm.tsx` does not go into that directory but in the `src` directory.

```tsx
import { Form, InputText, InputSelectControlled, InputTextarea } from 'creatif-ui-sdk';
import { HouseForm } from './components/HouseForm';
import { ApartmentForm } from './components/ApartmentForm';
import css from './css/root.module.css';
import { StudioForm } from './components/StudioForm';
import { LandForm } from './components/LandForm';
import { RichTextEditor } from './components/RichTextEditor';
import type { Delta } from 'quill/core';

export function PropertyForm() {
    return (
        <Form<{
            address: string;
            city: string;
            postalCode: string;
            propertyStatus: 'Rent' | 'Sell' | 'Rent business' | '';
            propertyType: 'House' | 'Apartment' | 'Studio' | 'Land' | '';

            numOfHouseFloors: number | null;
            houseSize: number | null;
            houseLocalPrice: number | null;
            houseBackYard: boolean;
            houseNeedsRepair: boolean;
            houseBackYardSize: number;
            houseRepairNote: string;

            apartmentFloorNumber: number | null;
            apartmentSize: number | null;
            apartmentLocalPrice: number | null;
            apartmentBalcony: boolean;
            apartmentBalconySize: number | null;

            studioFloorNumber: number | null;
            studioSize: number | null;

            landSize: number | null;
            hasConstructionPermit: number | null;

            finalNote: Delta | null;
        }>
            formProps={{
                defaultValues: {
                    address: '',
                    city: '',
                    postalCode: '',
                    propertyStatus: '',
                    propertyType: '',

                    numOfHouseFloors: null,
                    houseSize: null,
                    houseLocalPrice: null,
                    houseBackYard: false,
                    houseNeedsRepair: false,
                    houseBackYardSize: null,
                    houseRepairNote: '',

                    apartmentFloorNumber: null,
                    apartmentSize: null,
                    apartmentLocalPrice: null,
                    apartmentBalcony: false,
                    apartmentBalconySize: null,

                    studioFloorNumber: null,
                    studioSize: null,

                    hasConstructionPermit: null,
                    landSize: null,

                    finalNote: null,
                },
            }}
            bindings={{
                name: (values) => `${values.address}-${values.city}-${values.postalCode}`,
            }}
            inputs={(submitButton, { watch, inputConnection, inputLocale }) => {
                const propertyType = watch('propertyType');

                return (
                    <>
                        <div>
                            {inputConnection({
                                structureName: 'Accounts',
                                name: 'accounts',
                                structureType: 'map',
                                label: 'Account',
                                validation: {
                                    required: 'Selecting an owner is required',
                                },
                            })}
                        </div>

                        <div className={css.spacing}>{inputLocale()}</div>

                        <div>
                            <div className={css.fieldGrid}>
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
                                            required: 'Postal code is required',
                                        }}
                                    />
                                </div>

                                <div>
                                    <InputSelectControlled
                                        data={['Rent', 'Sell', 'Rent business']}
                                        label="Property status"
                                        name="propertyStatus"
                                        validation={{
                                            required: 'Property status is required',
                                        }}
                                    />
                                </div>

                                <div>
                                    <InputSelectControlled
                                        data={['House', 'Apartment', 'Studio', 'Land']}
                                        label="Property type"
                                        name="propertyType"
                                        validation={{
                                            required: 'Property type is required',
                                        }}
                                    />
                                </div>
                            </div>

                            {propertyType === 'Apartment' && <ApartmentForm />}
                            {propertyType === 'House' && <HouseForm />}
                            {propertyType === 'Studio' && <StudioForm />}
                            {propertyType === 'Land' && <LandForm />}
                        </div>

                        <div className={css.accountNote}>
                            <RichTextEditor name="finalNote" />
                        </div>

                        <div className={css.submitButton}>{submitButton}</div>
                    </>
                );
            }}
        />
    );
}
```

All we have to do now is update the configuration. Add the property form configuration into
`App.tsx`. It should look like this

```tsx
import React from 'react';
import { CreatifProvider } from 'creatif-ui-sdk';
import { PropertyForm } from './PropertyForm';
import { AccountForm } from './AccountForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                logo: 'Real Estate Manager',
                projectName: 'project',
                items: [
                    {
                        structureType: 'list',
                        structureName: 'Properties',
                        form: <PropertyForm />,
                    },
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
```

# Let's examine what we created

We created four components: `ApartmentForm.tsx`, `HouseForm.tsx`, `StudioForm.tsx` and
`LandForm.tsx`. These four components are just abstraction components. I created them
simply because I didn't want to create one a massive form that would be hard to follow
so don't mind them.

The only special thing is the `useCreatifFormContext`. This is simply
an export of `useFormContext` from `react-hook-form` and the only reason that it exists is
because, if you would install `react-hook-form` locally and use its functions, it would not
now that it is inside its own context and would return null since the context is created from
another package (within Creatif itself).

You would also notice that `PropertyForm.tsx` is a `list` structure. List structure is
a type of structure that allows you to create multiple entries with the same name but with different
locale. If you create an entry that has the same locale and name, an error would be raised.

This means that, when you publish your API, you can have multiple equivalent entries but with different
locales. For example, if you are real estate renting agency that operates in France and Germany,
you could have the same property listed in French and German.

# Locale

In `PropertyForm.tsx`, there is an `inputLocale` property. This is a function that renders
a `Select` component to select a locale. Every structure entry has a locale associated with it.
The default locale is `eng`. But if you render the `inputLocale()` function, you will be able to
choose the locale specifically for this structure entry.

# RichTextEditor

If you remember, we said that `InputText` export is nothing more but an input property that works with
`react-hook-form` so there is nothing special that Creatif does with it. The only reason it is exported is
to make the UI feel uniform since Creatif is created with Mantine.

This means that you can create your own form components by just hooking it up with `react-hook-form`.
Since Creatif does not ship with a rich text editor, we can use any rich text editor out there.
For this example, I choose [Quill](https://quilljs.com/). If you look at the code of `RichTextEditor`,
it might seem daunting at first but none of the code is Creatif specific so you don't really have to understand it.
All I did is hook up Quill to work with `react-hook-form`.

This can be done with any component you want, no matter how complicated it is.

# inputConnection()

This part is a little bit tricky but is also a very important one.

After you create an Account, which represent a property owner, you have to link that
Account to a Property. You do that with `inputConnection()`.

```tsx
{
    inputConnection({
        structureName: 'Accounts',
        name: 'accounts',
        structureType: 'map',
        label: 'Account',
        validation: {
            required: 'Selecting an account is required',
        },
    });
}
```

`inputConnection()` is a function that renders an input with which you can connect
a structure entry with another structure entry. After the connection is made, Account will
become the parent of the Property.

> NOTE
>
> After you publish, these entries will be available in the public API as
> 'connections'. More on publishing and using the public API later on.

Properties `structureName`, `name` and `structureType` are required. The rest are there
for the actual input.

In our example, this field is required but if you remove the validation, it won't be.

# Try it out

Try creating a couple of accounts and properties. It should be intuitive how to do that but if you
are having trouble using the UI, visit [Using the UI section](using-the-ui) for a more
detailed explanations on how to use the UI.

# Publishing

In the upper right corner, you will see a `Publish` button. After you click on it,
you will be on the versioning screen.

![Publish button](_images/tutorial_publish_button.png 'Publish button')

Creatif support infinite versions. That means that you can toggle between versions freely
and create version for different environments.

Go ahead and create you first version. This version will not be enabled by default. You have
to enable it manually. Click on the `Enable` button.

![Creating a version](_images/tutorial_publish_version.gif 'Creating a version')

Your version is now live and accessible to the outside world. In the left corer, click
on the `API` button. On this screen, you can explore your public API. Using the API is explained
in separate section [Using API SDK](using-api-sdk)

# What next?

I would advise you to just start playing around. Most of the features are pretty intuitive and
easy to use. If you have any trouble, use this documentation to find out how a particular feature works.

-   [Using the UI](using-the-ui)
-   [Using groups](using-groups)
-   [Using API SDK](using-api-sdk)
