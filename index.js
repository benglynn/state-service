const Datastore = require('@google-cloud/datastore');
const projectId = 'state-service';
const datastore = Datastore({ projectId: projectId });

const getKeyForId = (id) => {
    const idInt = parseInt(id);
    return datastore.key(['StateService', 'Demo', 'Action', idInt ]);
}

const getAction = (req, res) => {
    const key = getKeyForId(req.query.id);
    datastore.get(key).then(results => {
        const action = results[0];
        if (action !== undefined) {
            jsonResponse(res, 200, formatAction(action));
        } else {
            jsonResponse(res, 404, {error: `${req.query.id} not found`});
        }
    }).catch(err => { 
        jsonResponse(res, 500, {error: err }); 
    });
}

const putAction = (req, res) => {
    const id = req.query.id;
    const type = req.body.type;
    const active = req.body.active;
    if (id === undefined || 
        type === undefined || typeof type !== 'string' ||
        active === undefined || typeof active !== 'boolean') {
        jsonResponse(res, 400, { error: 'malformed request' });
    } else {
        const key = getKeyForId(req.query.id);
        const action = { key: key, data: { active: active, type: type }};
        datastore.update(action).then(() => 
            jsonResponse(res, 200, { id: id, active: active, type: type })
        ).catch(err => 
            jsonResponse(res, 500, { error: err }));
        
    }
}

const getActions = (req, res) => {
    const ancestorKey = datastore.key(['StateService', 'Demo']);
    const query = datastore.createQuery('Action').hasAncestor(ancestorKey);
    datastore.runQuery(query, (err, entities) => {
        if (err) { jsonResponse(res, 500, {error: err.code }); }
        else {
            jsonResponse(res, 200, { actions: entities.map(formatAction) });
        }
    });
}

const options = (req, res) => {
    addCorsHeadersTo(res);
    res.status(200).end();
}

const endpoint = (req, res) => {
    switch (req.method) {
        case 'GET': {
            if (req.query.id === undefined) {
                getActions(req, res);
            } else {
                getAction(req, res);
            }
            break;
        }
        case 'PUT': {
            putAction(req, res);
            break;
        }
        case 'OPTIONS': {
            options(req, res);
            break;
        }
        default: {
            jsonResponse(res, 405, { error: `${req.method} not allowed` });
            break
        }
    }
  };

const jsonResponse = (res, status, data) => {
    addCorsHeadersTo(res);
    const responseJSON = JSON.stringify(data, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.status(status).send(responseJSON);
}

const addCorsHeadersTo = (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'PUT, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
}

const formatAction = (entity) => {
    return {
        type: entity.type,
        active: entity.active,
        id: entity[Datastore.KEY].id
    }
}

exports.actions = endpoint;

exports.getActions = getActions;
exports.getAction = getAction;
exports.putAction = putAction;