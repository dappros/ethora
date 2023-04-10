// import pinataSDK from "@pinata/sdk";
// import fs from 'fs'

// import config from "../config";

// const pinata = new pinataSDK(config.pinataKey, config.pinataSecret);

// export async function uploadFileToIpfs(path: string, name: string) {
//   const rs = fs.createReadStream(path)
//   try {
//     const result = await pinata.pinFileToIPFS(rs, {pinataMetadata: {name: name}})
//     return result.IpfsHash

//   } catch (error) {
//     console.log(error)
//     return null
//   }
// }

// export async function uploadJsonToIpfs(json: string, name: string) {
//   try {
//     const result = await pinata.pinJSONToIPFS(json, {pinataMetadata: {name: name}})
//     return result.IpfsHash

//   } catch (error) {
//     console.log(error)
//     return null
//   }
// } 