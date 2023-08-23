export type FamilyDetails = {
  familyId: string;
  memberSince: number;
  avatarURI: string;
  username: string;
  owner: string;
  children: string[];
};

export type ChildDetails = {
  username: string;
  avatarURI: string;
  familyId: string;
  memberSince: number;
  wallet: string;
  sandboxMode: boolean;
  isActive: boolean;
};
