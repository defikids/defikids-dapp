import { Center, Flex, Box } from "@chakra-ui/react";
import ResourcesModal from "@/components/Modals/ResourcesModal";
import Navbar from "@/components/navbar";

const Community = () => {
  return (
    <Box height="100vh" bgGradient={["linear(to-b, black,#4F1B7C)"]}>
      <Navbar />
      <Center mt="1rem">
        <Flex>
          <ResourcesModal />
        </Flex>
      </Center>
    </Box>
  );
};

export default Community;
