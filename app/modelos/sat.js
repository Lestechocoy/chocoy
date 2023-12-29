/******************************************************************************************************
                 obtener nit del APi
 *****************************************************************************************************/

// Función para consultar el NIT
const https = require('https');

async function fetchNitData(valorInput) {
    return new Promise((resolve, reject) => {
        const server = `https://fel.eforcon.com/catalogosfel/cat/ConsultarNitReceptor?NitReceptor=${valorInput}`;
        const headers = {
            'CAT_KEY': 'TW06SL61LMAHBDWJS3F6DFR2A5JDRWEMG8ZCP9VPH2DK6QQ2B7'
        };

        const options = {
            headers
        };

        https.get(server, options, (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                if (response.statusCode !== 200) {
                    reject(new Error('Error al obtener la información del NIT'));
                } else {
                    const data = JSON.parse(responseData);
                    const result = [data.NitReceptor, data.RazonSocial]

                    resolve(result);
                }
            });
        }).on('error', (error) => {
            reject(new Error(error.message));
        });
    });
}

module.exports = {
    fetchNitData
};