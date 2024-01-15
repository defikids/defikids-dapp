import { Box } from "@chakra-ui/react";
import Navbar from "@/components/LandingNavbar";
import { WithdrawRequestsClientLayout } from "@/components/withdrawRequests/WithdrawRequestsClientLayout";

const getProps = async (context: any) => {
  const { memberAddress } = context.params || {};

  return {
    memberAddress,
  };
};

export default async function MemberLockerPage(context: any) {
  const { memberAddress } = await getProps(context);

  return (
    <Box height="100vh">
      <Navbar />
      <Box mt="8rem" />
      <WithdrawRequestsClientLayout memberAddress={memberAddress} />
    </Box>
  );
}
