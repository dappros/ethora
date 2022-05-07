import botOptions from './config.js'

const connectData = () => {
    let data;
    if (botOptions.serverType === 'prod') {
        console.log('=> Bot launch on PROD server xmpp selected')
        data = {
            botName: '0xd_c997088_c118402_c8919e_df_c8_bfc3f8_d_d43_c_e33c',
            botAddress: 'dev.dxmpp.com',
            botPassword: 'rlndbzemfY',
            conferenceAddress: '@conference.dev.dxmpp.com',
        }
    } else {
        console.log('=> Bot launch on DEV server xmpp selected')
        data = {
            botName: 'haji',
            botAddress: 'jabber.sk',
            botPassword: 'hhkkjj',
            conferenceAddress: '@chat.jabb.im',
        }
    }
    return data;
}
export default connectData();