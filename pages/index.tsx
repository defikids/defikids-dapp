import { Center, Heading, Stack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center p={20} mt={10} flexDirection="column">
      <Stack spacing={4}>
        <Heading fontSize="6xl" align="center">
          Teach your kids
        </Heading>
        <Heading fontSize="6xl" align="center">
          to use crypto
        </Heading>
        <Heading fontSize="6xl" align="center">
          safely and confidently
        </Heading>
      </Stack>
    </Center>
  );
}
