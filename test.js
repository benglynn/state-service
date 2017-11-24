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

// cloudFunction.getActions(null, new Response());
// cloudFunction.getAction({ query: { id: 5639445604728832 } }, new Response());
// cloudFunction.getAction({ query: { id: 12345 } }, new Response());

// cloudFunction.putAction({
//     query: { id: 5649391675244544 },
//     body: { type: "INIT_ROUTE_ADAPTATION", active: true } 
// }, new Response());


