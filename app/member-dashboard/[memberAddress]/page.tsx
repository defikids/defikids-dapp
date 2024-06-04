import { Box } from "@chakra-ui/react";
import MemberDashboardClientLayout from "@/components/dashboards/memberDashboard/MemberDashboardClientLayout";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";
import { User } from "@/data-schema/types";

const getProps = async (context: any) => {
  const { memberAddress } = context.params || {};

  const user = await getUserByWalletAddress(memberAddress);

  return {
    user,
  };
};

export default async function MemberDashboard(context: any) {
  const { user } = (await getProps(context)) as {
    user: User;
  };

  return (
    <Box height="100vh">
      <MemberDashboardClientLayout user={user} />
    </Box>
  );
}
