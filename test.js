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
        console.log(`${data}\n`);
        return this;
    }
}

cloudFunction.getAction({ query: { id: 5629499534213120 } }, new Response());

cloudFunction.getActions(null, new Response());

cloudFunction.getAction({ query: { id: 12345 } }, new Response());

cloudFunction.putAction({
    query: { id: 5629499534213120 },
    body: { type: "INIT_ROUTE_ADAPTATION", active: true } 
}, new Response());



