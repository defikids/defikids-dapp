import { Box } from "@chakra-ui/react";
import Navbar from "@/components/LandingNavbar";
import { TokenLockersMemberLayout } from "@/components/tokenLockers/TokenLockersMemberLayout";
import TokenLockerContract from "@/blockchain/tokenLockers";

const getProps = async (context: any) => {
  const { memberAddress } = context.params || {};

  const TokenLockerInstance = await TokenLockerContract.fromProvider();

  const totalLockerOwned = await TokenLockerInstance.getLockerCountByUser(
    memberAddress
  );

  const totalLockerValue = await TokenLockerInstance.getTotalValueLockedByUser(
    memberAddress
  );

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
