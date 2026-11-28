
import { useEffect, useState } from "react";

function useFetchData(apiUrl) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Used to trigger API fetching again
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {

        const controller = new AbortController();

        async function fetchData() {

            try {
                setLoading(true);
                setError("");

                const response = await fetch(apiUrl, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(
                        `API request failed: ${response.status}`
                    );
                }

                const result = await response.json();

                // Supports normal and paginated Django responses
                const records = Array.isArray(result)
                    ? result
                    : result.results || [];

                setData(records);

            } catch (err) {

                if (err.name !== "AbortError") {
                    console.error("API error:", err);
                    setError("Unable to load data.");
                }

            } finally {

                if (!controller.signal.aborted) {
                    setLoading(false);
                }

            }
        }

        fetchData();

        return () => {
            controller.abort();
        };

    }, [apiUrl, refreshKey]);

    // Function to fetch the API again
    const refetch = () => {
        setRefreshKey(previous => previous + 1);
    };

    return {
        data,
        loading,
        error,
        refetch
    };
}

export default useFetchData;
