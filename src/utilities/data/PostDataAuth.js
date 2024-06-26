import { BackendLink } from "../BackendLink";
import { retrieveTokens } from "../tokens/getToken";

function sanitizeData(data) {
    const sanitizedData = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            sanitizedData[key] = String(data[key])
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }
    }
    return sanitizedData;
}

const postDataAuth = async function postData(url, dataToSend, Method="POST") {
    try {
        // Assuming retrieveTokens() returns a promise that resolves to the token
        const token = await retrieveTokens();
        const sanitizedData = sanitizeData(dataToSend);

        const response = await fetch(BackendLink + url, {
            method: Method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.accessToken}`, // Adjust according to how retrieveTokens() provides the token
            },
            body: JSON.stringify(sanitizedData),
        });

        const data = await response.json(); // Try to parse response body

        if (!response.ok) {
            // Handle non-2xx responses by throwing an error with the server's message
            throw new Error(
                data.error || `HTTP error! status: ${response.status}`
            );
        }

        // If the response is ok, return the data
        return { success: true, data: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export default postDataAuth;
