# Form events

You can react to events before and after a form is submitted/saved to the API. Those events are `beforeSave` and
`afterSave`. Both events are fired after the user submits the form and if validation is passed.

Consider this simple form that only has one field:

```typescript jsx
import { InputText, Form, Grid, Cell, File } from 'creatif';

export default function ImageForm() {
    return (
        <Form<{
            name: string;
        }>
            bindings={{
                name: (values) => values.name,
            }}
            beforeSave={(values, e) => {
                // 'e' is the Reacts syntetic submit event
            }}
            afterSave={(values, e) => {
                // 'e' is the Reacts syntetic submit event
            }}
            formProps={{
                defaultValues: {
                    name: '',
                },
            }}
            inputs={(submitButton, { inputFile }) => (
                <>
                    <Grid gap="24px">
                        <Cell span="span 6">
                            <InputText
                                label="Name"
                                name="name"
                                options={{
                                    required: 'Name is required',
                                }}
                            />
                        </Cell>
                    </Grid>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '3rem',
                        }}>
                        {submitButton}
                    </div>
                </>
            )}
        />
    );
}
```

`beforeSave` will have two parameters: `values` (which are submitted form values) and 'e' (which is Reacts syntetic event).
`afterSave` is the same expect `values` is the response that you get after the form has been saved.

Both events return nothing i.e. void. You can use these events to save parts of your data to some other platform like Firebase
or Supabase or some analytical platform.
