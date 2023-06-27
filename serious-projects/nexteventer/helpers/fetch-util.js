export async function fetchData(url, method = 'GET', body = null) {
    if (method === 'GET') {
        let data;
        try {
            const response = await fetch(url);
            data = await response.json();
        } catch (error) {
            return 500;
        }

        return data;
    }

    try {
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return error;
    }

    return 200;
}

export function convertToArray(obj) {
    const arr = [];

    for (const key in obj) {
        arr.push({
            id: key,
            ...obj[key],
        });
    }

    return arr;
}
