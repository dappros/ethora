import pinataSDK from "@pinata/sdk"
import config from "../config"

export const pinata = new pinataSDK(config.pinataKey, config.pinataSecret)