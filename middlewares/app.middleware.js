const config = require("../config");

const appMiddleware = async(request, response, next) => {
    try {
        const validateHeader = request.headers.appvalidationtoken;
        if(!validateHeader || validateHeader !== config.appheader){
            return response.status(400).json({status: "failed", message: "Invalidated access"})
        }
        next();
    } catch (error) {
        return response.status(500).json({status: 'error', message: "Internal server error"})
    }
}

module.exports = appMiddleware;