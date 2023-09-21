const axios = require("axios");
const base64 = require("base-64");
const https = require("https");

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const instance = axios.create({ httpsAgent });

const adminXMPP = process.env.REACT_APP_XMPP_ADMIN
const passwordXMPP = process.env.REACT_APP_XMPP_PASSWORD
const host = process.env.REACT_APP_XMPP_HOST
const xmppPath = process.env.REACT_APP_XMPP_PATH

const tokenXMPP = `Basic ${base64.encode(`${adminXMPP}:${passwordXMPP}`)}`;

async function checkXmppStatus(username) {
  let bodyData = {
    user: username,
    host: host,
  };

  let result = await instance.post(`${xmppPath}/check_account`, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenXMPP,
    },
  });

  let isExists = result.data
  if (isExists == "0") {
    return true;
  }

  return false;
}

async function registerXmppuser(username, password) {
  let bodydata = {
    host: host,
    user: username,
    password: password,
  };

  return instance.post(
    `${xmppPath}/register`,
    {
      ...bodydata
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenXMPP,
      },
    }
  ); 
}

async function registered_users() {
  let bodydata = {
    host: host,
  };

  return instance.post(
    `${xmppPath}/registered_users`,
    {
      ...bodydata
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenXMPP,
      },
    }
  ); 
}

async function muc_online_rooms() {
  return instance.post(
    `${xmppPath}/muc_online_rooms`,
    {
      service: "conference.dev.dxmpp.com"
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenXMPP,
      },
    }
  ); 
}

async function get_room_history(name, serivce) {
  return instance.post(
    `${xmppPath}/get_room_history`,
    {
      name: name,
      service: "conference.dev.dxmpp.com"
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenXMPP,
      },
    }
  ); 
}

async function rooms_empty_list() {
  return instance.post(
    `${xmppPath}/rooms_empty_list`,
    {
      service: "conference.dev.dxmpp.com"
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenXMPP,
      },
    }
  ); 
}

async function get_room_options(name) {
  return instance.post(
    `${xmppPath}/get_room_options`,
    {
      name: name,
      service: "conference.dev.dxmpp.com"
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenXMPP,
      },
    }
  ); 
}

async function get_room_occupants(name) {
  return instance.post(
    `${xmppPath}/get_room_occupants`,
    {
      name: name,
      service: "conference.dev.dxmpp.com"
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenXMPP,
      },
    }
  ); 
}

async function get_room_affiliations(name) {
  return instance.post(
    `${xmppPath}/get_room_affiliations`,
    {
      name: name,
      service: "conference.dev.dxmpp.com"
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenXMPP,
      },
    }
  );
}

const main = async () => {
  const res2 = await registerXmppuser('u1', 'u1')
  console.log(res2.data)
}

main()

