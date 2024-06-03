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

# Setting up Properties form

