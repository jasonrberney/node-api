const { pgConnect, pgClose } = require('./conn/postgres/pgConnection');

getLocations = async () => {
    //const selectLocations = `SELECT * FROM ___`;
    try{
        // const client = await pgConnect();
        // const res = await client.query(selectLocations);
        // pgClose(client);
        const locations = [
            {
                name: 'London',
                coordinates: ['51.5074', '0.1278'],
                latitude: 51.5074,
                longitude: 0.1278
            },
            {
                name: 'Portland',
                coordinates: ['45.5051', '-122.6750'],
                latitude: 45.5051,
                longitude: -122.6750
            },
            {
                name: 'Mexico City',
                coordinates: ['19.4326', '-99.1332'],
                latitude: 19.4326,
                longitude: -99.1332
            }
        ];
        return {success : true , result : locations };
    }
    catch(err){
        console.log(err);
        return {success : false , error : err };
    }
}

module.exports = { 
    getLocations
};