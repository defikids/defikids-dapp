import { Box } from "@chakra-ui/react";
import Navbar from "@/components/LandingNavbar";
import { TokenLockersMemberLayout } from "@/components/tokenLockers/TokenLockersMemberLayout";
import { tokenLockersContractInstance } from "@/blockchain/instances";

const getProps = async (context: any) => {
  const { memberAddress } = context.params || {};

  const tokenLockerContract = await tokenLockersContractInstance();

  const totalLockerOwned = await tokenLockerContract
    .getLockerCountByUser(memberAddress)
    .then((res: any) => res.toString());

  const totalLockerValue = await tokenLockerContract
    .getTotalValueLockedByUser(memberAddress)
    .then((res: any) => res.toString());

  return {
    memberAddress,
    totalLockerOwned,
    totalLockerValue,
  };
};

export default async function MemberLockerPage(context: any) {
  const { memberAddress, totalLockerOwned, totalLockerValue } = await getProps(
    context
  );
  console.log(memberAddress, totalLockerOwned);

  return (
    <Box height="100vh">
      <Navbar />
      <Box mt="8rem" />
      <TokenLockersMemberLayout
        memberAddress={memberAddress}
        totalLockerOwned={totalLockerOwned}
        totalLockerValue={totalLockerValue}
      />
    </Box>
  );
}
