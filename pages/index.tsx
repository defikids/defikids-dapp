import { Flex, Text } from "@chakra-ui/react";

export default function Main() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="80vh"
      width="100vw"
      px={20}
    >
      <Text fontSize="5xl" fontWeight="bold">
        Earn, save, stake and invest your allowance.
      </Text>
      <Text fontSize="2xl" fontWeight="bold">
        DefiKids is a save and secure platform that allows kids to learn about
        crypto.
      </Text>
    </Flex>

    // <Flex
    //   direction="column"
    //   align="center"
    //   justify="center"
    //   height="80vh"
    //   width="100vw"
    //   px={20}
    // >
    //   <Text fontSize="4xl" fontWeight="bold">
    //     Kids can earn, save, stake and invest their allowance in a safe and
    //     secure way.
    //   </Text>
    //   <Text fontSize="4xl" fontWeight="bold">
    //     Teach your kids about crypto.
    //   </Text>
    //   <Text fontSize="2xl" fontWeight="bold">
    //     DefiKids is a platform that allows parents to teach their kids about
    //     crypto.
    //   </Text>
    // </Flex>
  );
}
