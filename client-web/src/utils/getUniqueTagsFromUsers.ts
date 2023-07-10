import { TSelectedIds } from "../components/UsersTable/UsersTable";

export const getUniqueTagsFromUsers = (users: TSelectedIds[]) => {
  const uniqueTags = {};

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    for (let j = 0; j < user.tags.length; j++) {
      const tag = user.tags[j];
      if (!uniqueTags[tag]) {
        uniqueTags[tag] = 1;
      } else {
        uniqueTags[tag] += 1;
      }
    }
  }
  return Object.entries(uniqueTags).map((item) => ({
    tag: item[0],
    count: item[1],
  }));
};
