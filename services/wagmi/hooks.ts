import { useContractRead } from "wagmi";

const getUserTypeAbi = [
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getUserType",
    outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
    stateMutability: "view",
    type: "function",
  },
];

export function useGetUserType({ address }: { address: string }): number {
  const { data } = useContractRead({
    address: address as `0x${string}`,
    abi: getUserTypeAbi,
    functionName: "getUserType",
    args: [address],
  });

  return (data as number) || 0;
}
