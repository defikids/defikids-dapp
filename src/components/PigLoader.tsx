import { Center, Flex, Image } from "@chakra-ui/react";

export const PigLoader = () => {
  return (
    <Center h="100vh" w="100vw">
      <Flex justifyContent="center" direction="column">
        <Center mt={5}>
          <Image src="/defi-kids-spinner.gif" alt="Piggy Bank" width={100} />
        </Center>
      </Flex>
    </Center>
  );
};
