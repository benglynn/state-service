const cloudFunction = require('./index');

class Response {

    status(_status) {
        console.log(_status);
        return this;
    }

    setHeader(header) {
        console.log(header);
    }

    send(data) {
        console.log(data);
        return this;
    }
}

cloudFunction.get(null, new Response());

