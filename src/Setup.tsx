import AuthPage from '@app/uiComponents/shell/AuthPage';
import Banner from '@app/uiComponents/shell/Banner';
import CreateAdmin from '@app/components/authentication/CreateAdmin';
import ShellContainer from '@app/uiComponents/shell/ShellContainer';
import React from 'react';
import type { CreatifApp } from '@root/types/shell/shell';
import { Login } from '@app/routes/login/Login';
import { Route, Routes } from 'react-router-dom';

interface Props {
    app: CreatifApp;
}

export function Setup({ app }: Props) {
    console.log(app);

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <AuthPage>
                            <Banner />
                            <CreateAdmin />
                        </AuthPage>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <AuthPage>
                            <Banner />
                            <Login config={app} />
                        </AuthPage>
                    }
                />
            </Routes>

            <Routes>
                <Route path="/dashboard/:projectId/*" element={<ShellContainer options={app} />} />
            </Routes>
        </>
    );
}
