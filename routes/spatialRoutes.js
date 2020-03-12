const { getLocations } = require('../src/spatial.js');

module.exports = function(app){

    app.get('/api/locations', async (request, response) => {
        const {success, result, error }  = await getLocations();
    
        if(success) return response.status(200).send(result);
        response.status(500).send({error: error});
    
    });
}