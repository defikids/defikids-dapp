import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import CONTRACT_ADDRESS from "@/services/contract";

export function useGetUserType({ account }: { account: string }): {
  userType: number;
  refetch: () => void;
} {
  const { data, refetch } = useContractRead({
    address: `${CONTRACT_ADDRESS}` as `0x${string}`,
    abi: require("@/abis/contracts/Host.json"),
    functionName: "getUserType",
    args: [account],
    chainId: 80001,
  });

  return {
    userType: Number((data as unknown as BigNumber)?.toString?.()),
    refetch,
  };
}
