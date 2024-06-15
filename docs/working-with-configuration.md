# Working with configuration

Configuration is the core of Creatif. With configuration, you create your
form and your forms are the CMS. To create Creatif, use `CreatifProvider`.

```tsx
import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';

export default function App() {
    return <CreatifProvider app={} />;
}
```

> NOTE
>
> Configuration in the above example will raise an error since
> required configuration is not present and JSX does not allow
> passing non-empty expressions. This is an error that JSX will
> raise, not Creatif.

This is the interface that the `app` prop accepts

```ts
interface CreatifApp {
    logo: React.ReactNode;
    projectName: string;
    items: AppShellItem[];
}

interface AppShellItem {
    menuText?: string;
    menuIcon?: React.ReactNode;
    structureName: string;
    structureType: StructureType;
    form: React.ReactNode;
}
```

Configuration is validated and putting the wrong configuration will not crash
your app but show a modal that will tell you what in the configuration is wrong
and what should be corrected.

If you create a Creatif app without the required configuration (an empty object, for example),
you will not be able to log in. The screen might look something like this

![Configuration error on login screen](_images/configuration_login_config_error_screen.png 'Configuration error on login screen')

The same errors will be raised if you created your project, logged in but while changing configuration,
a configuration error is raised. It might look something like this

![Configuration runtime error](_images/configuration_runtime_error.png 'Configuration runtime error')

After you resolve all errors, the error modal should disappear.

> VERY IMPORTANT
>
> Once chosen and created, project name **cannot** be changed. Project is created
> after first login. For now, Creatif does not support multiple projects.

Updating, removing or adding new structures will automatically update the UI but removed
structure will not be deleted. You have to delete them manually. Creatif does not decide
for you when something is ready for deletion.

> NOTE
>
> If you published your API, none of the API versions are affected by deleting, adding or removing
> structures or structure entries. When you publish an API version, this version
> becomes a point in time snapshot and is not affected by changing anything in the UI.
> To find out more, checkout [Using API SDK](using-api-sdk).

After you removed a structure, you have two possibilities: truncate the structure or remove it.

# Truncating and deleting a structure

Truncating a structure will remove all the structure entries but not the structure
itself. This means that the structure will still exist and you can use it again by adding
it back to configuration, but it will have not data. Just to reiterate, this does not affect
already published API versions.

Before you can truncate, you have to remove the structure from configuration. If you don't do that,
the UI will not allow you to delete or remove a structure.

To truncate a structure, go to _Structure -> {You structure type}_, choose the structure to truncate and
click the truncate button.

![Truncating a structure](_images/configuration_truncate_structure.gif 'Truncating a structure')

As you can see, the structure, after truncating does not have any data but its the same structure.
If you do the same as in the image but instead of truncating, you delete, the entire structure along with the
data will be deleted but if you add the structure back to configuration, the structure will be
created again. Both, truncating and deleting looks the same in the UI but the difference is very important.
