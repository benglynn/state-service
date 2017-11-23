const Datastore = require('@google-cloud/datastore');

const projectId = 'state-service';

const datastore = Datastore({
    projectId: projectId
});

const getActiveActions = datastore
    .createQuery(['Action'])
    .filter('active', '=', true);

exports.getState = function getState (req, res) {
    datastore.runQuery(getActiveActions, function(err, entities) {
        if (err) {
            res.status(500).send(err);
        } else {
            const typesOnly = entities.map(entity => entity.type);
            res.send(typesOnly);
        }
    })
  };

