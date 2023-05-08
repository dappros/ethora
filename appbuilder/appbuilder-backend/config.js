const endPoints = ['DEV', 'PROD'];

const currentEndpoint = endPoints[0];
const hostname = currentEndpoint === endPoints[0] ? 'localhost' : '0.0.0.0';

module.exports = {
    hostname
}