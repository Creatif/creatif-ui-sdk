# Using groups

Groups are a way of groups entries with similar properties. In our tutorial, we created a property with the `PropertyForm`.
This form included a property type field. You can include create three groups: Rent and Sell. Depending on this properties
type, assign one of the groups or both of them. You can filter these properties in the _Filters_ side section and
using the public API.

Let's see it in action in our tutorial example.

> NOTE
>
> This example requires that you followed and setted up the [Tutorial](tutorial) application. It also requires
> that you create a single Account structure entry. If you haven't already, please do so.

Let's add the `inputGroups()` render function and render it in our `PropertyForm`. Find the `inputs` prop on your form
and make the `inputGroups()` render function available.

```tsx
// notice that we added inputGroups alongside inputLocale()
inputs={(submitButton, { watch, inputConnection, inputLocale, inputGroups }) => {
```

Render the group in your form right below the `inputLocale()`.

```tsx
<div className={css.spacing}>{inputGroups()}</div>
```

This now renders the groups dropdown.

![Groups dropdown](_images/groups_section_dropdown.png 'Groups dropdown')

This is how our `PropertyForm` looks like now.

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
            bindings={{
                name: (values) => `${values.address}-${values.city}-${values.postalCode}`,
            }}
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
            inputs={(submitButton, { watch, inputConnection, inputLocale, inputGroups }) => {
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

                        <div className={css.spacing}>{inputGroups()}</div>

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

But if you try to select a group, nothing happens. That is because we haven't selected any groups. Click on the `API`
section in the navigation on the right and create two groups: _Rent_ and _Sell_.

![Add groups](_images/using_groups_add_groups.gif 'Add groups')

After you do that, add those groups in the `Properties` structure entry.

![Add groups](_images/using_groups_add_groups_property_form.gif 'Add groups')

Maximum number of groups that you can create is 200 but you can add as many as you want to any structure.
For example, if you had created 200 groups, you can add all of them to `Properties` form.

Also notice that, after you create a Properties entry, those groups are highlighted in the listing. You can also change
them in the specific item screen but that is explained in detail in the [Using UI](using-the-ui) section.

You can filter by groups (and many other parameters) in the filters drawer component. While on listing,
click the _Filters_ button to open the drawer. Find the _Groups_ section and choose
one or more groups. You will see that the listing is updated based on chosen groups.

![Group filters](_images/using_groups_group_filters.gif 'Group filters')

Useful references:

-   [Using UI](using-the-ui.md)
-   [Using API SDK](using-api-sdk.md)
