// <iq xmlns="jabber:client" xml:lang="en" to="u1@dev.dxmpp.com/1533646998095169806296130"
//   from="u1@dev.dxmpp.com" type="result" id="getRooms">
//   <query xmlns="ns:getrooms">
//     <room room_background="none" room_thumbnail="none" users_cnt="2"
//       jid="zte@conference.dev.dxmpp.com" />
//     <room room_background="none" room_thumbnail="none" users_cnt="1"
//       jid="room789@conference.dev.dxmpp.com" />
//     <room room_background="none" room_thumbnail="none" users_cnt="2"
//       jid="room76@conference.dev.dxmpp.com" />
//     <room room_background="none" room_thumbnail="none" users_cnt="1"
//       jid="wend@conference.dev.dxmpp.com" />
//     <room room_background="none" room_thumbnail="none" users_cnt="1"
//       jid="testroom@conference.dev.dxmpp.com" />
//     <room room_background="none" room_thumbnail="none" name="Borys and Taras" users_cnt="4"
//       jid="0x615046ab4d89684289f96bf8e1fc1ba8773e37c3.0x80ff29dcd7e6dd7cc90b47fed45669cf021a0ec6@conference.dev.dxmpp.com" />
//     <room room_background="none" room_thumbnail="none" name="Borys Bo" users_cnt="3"
//       jid="0x615046a_b4d89684289_f96b_f8e1_fc1ba8773_e37_c3@conference.dev.dxmpp.com" />
//     <room room_background="none" room_thumbnail="none" name="Downtown South" users_cnt="141"
//       jid="03adb005b8c2cdbba33221f5677dc07908512f36e0c47c051df6e6907eeafd13@conference.dev.dxmpp.com" />
//     <room room_background="none" room_thumbnail="none" users_cnt="2"
//       jid="room_1243@conference.dev.dxmpp.com" />
//     <room room_background="none" room_thumbnail="none" users_cnt="1"
//       jid="yyyyyyyyyyyy@conference.dev.dxmpp.com" />
//     <room room_background="none"
//       room_thumbnail="https://etofs.com/ipfs/QmSMexq3bP9reoVma2MhpmwN9TezyzXNWr9S8o7rbCTtEB"
//       name="Technical support 🛠️" users_cnt="534"
//       jid="cc39004bf432f6dc34b47cd64251236c9ae65eadd890daef3ff7dbc94c3caecb@conference.dev.dxmpp.com" />
//     <room room_background="none"
//       room_thumbnail="https://etofs.com/ipfs/Qmf2WGvC5ew3jx52qpB9tMQzWYG9Ch8A9qdk9iRZdBJxx6"
//       name="NFT Factory" users_cnt="508"
//       jid="dc635d74fb77f53701d48899d86175c3a62a3e8a2a76e9f5ea0e9a3918cf6152@conference.dev.dxmpp.com" />
//     <room room_background="none"
//       room_thumbnail="https://etofs.com/ipfs/QmSr19Da4u8vmeE86DaDHfRTJ8gjwN1UccXn8He8Ugc6yx"
//       name="Random talks 💬☕" users_cnt="539"
//       jid="5dc237d5792e95ba96240223e14ee00b13d2548c5cdfcf2e27ca67a0b11f5b9d@conference.dev.dxmpp.com" />
//   </query>
// </iq>

export function nsGetrooms(stanza) {
  if (stanza.is("iq") && stanza.attrs.type === "result") {

  }
}