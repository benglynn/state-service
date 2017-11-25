const Datastore = require('@google-cloud/datastore');
const projectId = 'state-service';
const KEY = Datastore.KEY;
const datastore = Datastore({ projectId: projectId });

const getAction = (req, res) => {
    const key = datastore.key(['StateService', 'Demo', 'Action', req.query.id]);
    datastore.get(key).then(results => {
        const action = results[0];
        if (action !== undefined) {
            jsonResponse(res, 200, formatAction(action));
        } else {
            jsonResponse(res, 404, {error: `${req.query.id} not found`});
        }
    }).catch(err => { jsonResponse(res, 500, {error: err.code }); });
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
        const key = datastore.key(['StateService', 'Demo', 'Action', req.query.id]);
        const action = { key: key, data: { active: active, type: type }};
        datastore.update(action).then(() => 
            jsonResponse(res, 200, { id: id, active: active, type: type })
        ).catch(err => 
            jsonResponse(res, 500, { error: err.code }));
        
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

const options = (req, res) => { res
    .set({'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT'})
    .status(200).end();
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

  // UTILS

const jsonResponse = (res, status, data) => {
    const responseJSON = JSON.stringify(data, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.status(status).send(responseJSON);
}

const formatAction = (entity) => {
    return {
        type: entity.type,
        active: entity.active,
        id: entity[KEY].id
    }
}

exports.actions = endpoint;

// TESTING

exports.getActions = getActions;
exports.getAction = getAction;
exports.putAction = putAction;