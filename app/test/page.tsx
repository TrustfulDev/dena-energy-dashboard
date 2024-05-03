"use client"
import { useEffect, useState } from 'react';

async function getData() {
    // AccuEnergy meter set to 1 minute log intervals
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/accuenergy/testing`, { 
        next: { revalidate: 60, tags: ["accuenergy"] },
        method: "GET"
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    const data = await res.json();
    return data;
}

export default function Test() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/accuenergy/testing`, {
                method: "GET"
            });
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await res.json();
            setData(jsonData);
        };

        fetchData();
        const intervalId = setInterval(fetchData, 60000); // fetch data every minute

        return () => clearInterval(intervalId); // cleanup function to clear interval
    }, []);

    return (
        <div>
            <h1 className="text-4xl font-bold">TESTING ACCUENERGY</h1>
            {JSON.stringify(data)}
        </div>
    )
}