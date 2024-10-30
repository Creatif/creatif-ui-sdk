import { Listing } from '@app/routes/structures/Listing';
import { useEffect } from 'react';
import { useAddActivity } from '@app/systems/activity/useAddActivity';

export default function Map() {
    const { addVisitingActivity } = useAddActivity();

    useEffect(() => {
        addVisitingActivity({
            type: 'visit',
            subType: 'mapStructures',
            title: 'Viewed all maps',
            path: location.pathname,
        });
    }, []);

    return (
        <>
            <Listing structureType="map" />
        </>
    );
}
