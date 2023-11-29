import { Box } from "@chakra-ui/react";
import MemberDashboardClientLayout from "@/components/dashboards/memberDashboard/MemberDashboardClientLayout";

const getProps = async (context: any) => {
  const { memberAddress } = context.params || {};

  return {
    memberAddress,
  };
};

export default async function MemberLockerPage(context: any) {
  const { memberAddress } = (await getProps(context)) as {
    memberAddress: string;
  };

  return (
    <Box height="100vh">
      <MemberDashboardClientLayout memberAddress={memberAddress} />
    </Box>
  );
}
