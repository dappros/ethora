import xmpp from "@xmpp/client";
import { Element } from "ltx";

const xml = xmpp.xml;

type TWsClientOptions = {
  resource: string

}

class WsClient {
  constructor(options: TWsClientOptions) {
  }

  async init() {
    
  }
}

class WsClientSingletonLike {
  resources: Record<string, WsClient> = {}

  async createInstance(resource: string, ) {
    if (this.resources[resource]) {
      return this.resources[resource]
    } else {
      this.resources[resource] = new WsClient()
      await this.resources[resource].init()
      return this.resources[resource]
    }
  }
}
