import Form from '../../../src/app/uiComponents/form/Form';
import { Grid, Group } from '@mantine/core';
import { Menus } from './Menus';

export interface FormValues {
    topLevelMenus: {
        topLevelName: string;
        href: string;
        newTab: boolean;
    }[];
}
export function NavigationForm() {
    return (
        <Form<FormValues>
            bindings={{
                name: () => 'Menu',
            }}
            formProps={{
                defaultValues: {
                    topLevelMenus: [],
                },
            }}
            inputs={(submitButton, { inputLocale }) => (
                <>
                    <Grid>
                        <Grid.Col span={12}>{inputLocale()}</Grid.Col>

                        <Grid.Col span={12}>
                            <Menus name="topLevelMenus" />
                        </Grid.Col>
                    </Grid>

                    <Group
                        align="center"
                        justify="flex-end"
                        style={{
                            marginTop: '1rem',
                        }}>
                        {submitButton}
                    </Group>
                </>
            )}
        />
    );
}
