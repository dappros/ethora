import { TSelectedIds } from "../components/UsersTable/UsersTable"

export const getUniqueTagsFromUsers = (users: TSelectedIds[]) => {
  const uniqueTags = {}

  for (const user of users) {
    for (let index = 0; index < user.tags.length; index++) {
      const tag = user.tags[index]
      if (uniqueTags[tag]) {
        uniqueTags[tag] += 1
      } else {
        uniqueTags[tag] = 1
      }
    }
  }
  return Object.entries(uniqueTags).map((item) => ({
    tag: item[0],
    count: item[1],
  }))
}
