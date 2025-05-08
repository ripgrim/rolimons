const axios = require('axios');

async function request(...args) {
    let config = {
        headers: args[1]
    }
    try {
        const response = await axios.get(args[0], config);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            return { rateLimited: true };
        }
        return null;
    }
}

module.exports = { 
    request
}
