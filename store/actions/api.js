import { baseUrl } from '../config.json';

const Fetch = async (url, method, controller, body) => {
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
        signal: controller.signal,
    };
    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(`${baseUrl}${url}`, options);
    return response;
};

export default Fetch;
