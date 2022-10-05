export type TProfile = {
  firstName: string;
  lastName: string;
  description: string;
  profileImage: string;
};

export type TTransactions = {
  limit: number,
  offset: number,
  total: number,
  items: Record<string, string>[]
}