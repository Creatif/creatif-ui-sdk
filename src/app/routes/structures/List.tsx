import { Listing } from '@app/routes/structures/Listing';
import { useAddActivity } from '@app/systems/activity/useAddActivity';
import { useEffect } from 'react';

export default function List() {
    const { addVisitingActivity } = useAddActivity();

    useEffect(() => {
        addVisitingActivity({
            type: 'visit',
            subType: 'listStructures',
            title: 'Viewed all lists',
            path: location.pathname,
        });
    }, []);

    return (
        <>
            <Listing structureType="list" />
        </>
    );
}
