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

