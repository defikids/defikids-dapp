import { Box } from "@chakra-ui/react";
import ParentDashboardClientLayout from "@/components/dashboards/parentDashboard/ParentDashboardClientLayout";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";
import { User } from "@/data-schema/types";

const getProps = async (context: any) => {
  const { parentAddress } = context.params || {};

  const user = await getUserByWalletAddress(parentAddress);

  return {
    user,
  };
};

export default async function ParentDashboard(context: any) {
  const { user } = (await getProps(context)) as {
    user: User;
  };

  return (
    <Box height="100vh">
      <ParentDashboardClientLayout user={user} />
    </Box>
  );
}
