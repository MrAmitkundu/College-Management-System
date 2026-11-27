
import { useEffect, useState } from "react";

function useFetchData(apiUrl) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("API request failed");
                }

                return response.json();
            })
            .then(result => {
                setData(result);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [apiUrl]);

    return { data, loading, error };
}

export default useFetchData;
