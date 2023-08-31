import Parent from "@/pages/parent";

export enum SandboxFeatures {
  riskFree = "Risk Free",
  handsOn = "Hands On",
  educational = "Educational",
  realistic = "Realistic",
}

export enum StepperContext {
  AVATAR = "AVATAR",
  BACKGROUND = "BACKGROUND",
  DEFAULT = "DEFAULT",
}

export enum EtherscanContext {
  TRANSACTION = "tx",
  ADDRESS = "address",
}

export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,
}

export enum UserType {
  UNREGISTERED = "UNREGISTERED",
  PARENT = "PARENT",
  CHILD = "CHILD",
}

export enum AccountStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PENDING = "Pending",
}

export enum AccountPackage {
  BASIC = "Basic",
  PREMIUM = "Premium",
}
export enum Explaination {
  NONE = "NONE",
  FAMILY_ID = "FAMILY_ID",
}

export enum ParentDashboardTabs {
  DASHBOARD = "DASHBOARD",
  MEMBER_PROFILES = "MEMBER_PROFILES",
  SUPPORT = "SUPPORT",
  SETTINGS = "SETTINGS",
}
