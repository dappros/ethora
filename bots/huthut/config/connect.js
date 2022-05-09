import botOptions from './config.js'

const connectData = () => {
    let data;
    if (botOptions.serverType === 'prod') {
        console.log('=> Bot launch on PROD server xmpp selected')
        data = {
            botName: '',
            botAddress: '',
            botPassword: '',
            conferenceAddress: '',
        }
    } else {
        console.log('=> Bot launch on DEV server xmpp selected')
        data = {
            botName: '',
            botAddress: '',
            botPassword: '',
            conferenceAddress: '',
        }
    }
    return data;
}
export default connectData();