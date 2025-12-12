import { getAccessToken } from "../lib/actions";

const apiService = {
    get: async function (url: string): Promise<any> {
        console.log('get', url);

        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            const host = process.env.NEXT_PUBLIC_API_HOST;
            if (!host) {
                reject(new Error('NEXT_PUBLIC_API_HOST is not defined'));
                return;
            }
            const fullUrl = new URL(url, host).toString();

            fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            })
                .then(async (response) => {
                    const contentType = response.headers.get('content-type') || '';
                    if (!response.ok) {
                        const text = await response.text();
                        reject(new Error(`GET ${fullUrl} failed: ${response.status} ${response.statusText} - ${text.slice(0, 200)}`));
                        return;
                    }
                    if (contentType.includes('application/json')) {
                        const json = await response.json();
                        console.log('Response:', json);
                        resolve(json);
                    } else {
                        const text = await response.text();
                        reject(new Error(`Expected JSON but received Content-Type: ${contentType}. Body: ${text.slice(0, 200)}`));
                    }
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    post: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);

        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            const host = process.env.NEXT_PUBLIC_API_HOST;
            if (!host) {
                reject(new Error('NEXT_PUBLIC_API_HOST is not defined'));
                return;
            }
            const fullUrl = new URL(url, host).toString();

            fetch(fullUrl, {
                method: 'POST',
                body: data,
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            })
                .then(async (response) => {
                    const contentType = response.headers.get('content-type') || '';
                    if (!response.ok) {
                        const text = await response.text();
                        reject(new Error(`POST ${fullUrl} failed: ${response.status} ${response.statusText} - ${text.slice(0, 200)}`));
                        return;
                    }
                    if (contentType.includes('application/json')) {
                        const json = await response.json();
                        console.log('Response:', json);
                        resolve(json);
                    } else {
                        const text = await response.text();
                        reject(new Error(`Expected JSON but received Content-Type: ${contentType}. Body: ${text.slice(0, 200)}`));
                    }
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    postWithoutToken: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);

        return new Promise((resolve, reject) => {
            const host = process.env.NEXT_PUBLIC_API_HOST;
            if (!host) {
                reject(new Error('NEXT_PUBLIC_API_HOST is not defined'));
                return;
            }
            const fullUrl = new URL(url, host).toString();

            fetch(fullUrl, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(async (response) => {
                    const contentType = response.headers.get('content-type') || '';
                    if (!response.ok) {
                        const text = await response.text();
                        reject(new Error(`POST ${fullUrl} failed: ${response.status} ${response.statusText} - ${text.slice(0, 200)}`));
                        return;
                    }
                    if (contentType.includes('application/json')) {
                        const json = await response.json();
                        console.log('Response:', json);
                        resolve(json);
                    } else {
                        const text = await response.text();
                        reject(new Error(`Expected JSON but received Content-Type: ${contentType}. Body: ${text.slice(0, 200)}`));
                    }
                })
                .catch((error => {
                    reject(error);
                }))
        })
    }
}

export default apiService;