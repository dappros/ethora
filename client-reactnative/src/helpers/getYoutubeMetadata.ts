import axios from "axios"

export const getYoutubeMetadata = async (url: string) => {
  const metaUrl = `https://www.youtube.com/oembed?url=${url}&format=json`
  const config = {
    method: "get",
    url: metaUrl,
    headers: {},
  }
  return await axios(config).catch((err) => console.log(JSON.stringify(err)))
}
