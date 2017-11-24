const Datastore = require('@google-cloud/datastore');
const projectId = 'state-service';
const KEY = Datastore.KEY;
const datastore = Datastore({ projectId: projectId });

const getQuery = datastore.createQuery(['Action']);

const formatAction = (entity) => {
    return {
        type: entity.type,
        active: entity.active,
        id: entity[KEY].id
    }
}

const get = (req, res) => {
    datastore.runQuery(getQuery, (err, entities) => {
        if (err) { res.status(500).send(err); }
        else {
            const response = {
                actions: entities.map(formatAction)
            };
            const responseJSON = JSON.stringify(response, null, 2);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(responseJSON);
        }
    });
}

const actions = (req, res) => {
    switch (req.method) {
        case 'GET': {
            get(req, res);
            break;
        }
        default: {
            res.status(405).send(`${req.method} not allowed`);
            break
        }
    }
  };

exports.actions = actions;
exports.get = get;