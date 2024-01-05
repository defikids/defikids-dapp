import { Box } from "@chakra-ui/react";
import Navbar from "@/components/LandingNavbar";
import { getAllWithdrawRequestsByAccountId } from "@/services/mongo/routes/withdraw-request";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";
import { WithdrawRequestsClientLayout } from "@/components/withdrawRequests/WithdrawRequestsClientLayout";

const getProps = async (context: any) => {
  const { memberAddress } = context.params || {};

  const user = await getUserByWalletAddress(memberAddress);
  const requests = await getAllWithdrawRequestsByAccountId(user.accountId);

  console.log("requests", requests);

  return {
    requests,
    memberAddress,
  };
};

export default async function MemberLockerPage(context: any) {
  const { requests, memberAddress } = await getProps(context);

  return (
    <Box height="100vh">
      <Navbar />
      <Box mt="8rem" />
      <WithdrawRequestsClientLayout
        requests={requests}
        memberAddress={memberAddress}
      />
    </Box>
  );
}
