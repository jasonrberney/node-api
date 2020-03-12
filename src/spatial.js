const { pgConnect, pgClose } = require('./conn/postgres/pgConnection');

getLocations = async () => {
    //const selectLocations = `SELECT * FROM ___`;
    try{
        // const client = await pgConnect();
        // const res = await client.query(selectLocations);
        // pgClose(client);
        const locations = [
            {
                name: 'portland',
                coordinates: ['45.5051', '122.6750']
            },
            {
                name: 'london',
                coordinates: ['51.5074', '0.1278']
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