import Link from "next/link";
import {
  Center,
  Heading,
  Box,
  Image,
  Stack,
  Container,
  useBreakpointValue,
} from "@chakra-ui/react";
import Head from "next/head";

const Community = () => {
  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const twitterLink = "https://twitter.com/defikids_";
  const discordLink = "https://discord.gg/bDGMYNa8Ng";
  return (
    <>
      <Center mt={150}>
        <Box>
          <Heading
            size={isMobileSize ? "2xl" : "xl"}
            display="flex"
            alignItems="baseline"
            justifyContent="center"
            mb={10}
            color="#90cdf4"
          >
            Join our communities!
          </Heading>

          <Stack direction="row">
            <Link href={twitterLink} passHref target="_blank">
              <Center fontSize={20}>
                <h1>Twitter</h1>
              </Center>
              <Image
                borderRadius="20px"
                boxSize="450px"
                src="/images/backgrounds/robot-to-human.svg"
                alt="Dan Abramov"
                mr={5}
              />
            </Link>

            <Link href={discordLink} passHref target="_blank">
              <Center fontSize={20}>
                <h1>Discord</h1>
              </Center>
              <Image
                borderRadius="20px"
                boxSize="450px"
                src="/images/backgrounds/robot-to-human.svg"
                alt="Dan Abramov"
              />
            </Link>
          </Stack>
        </Box>
      </Center>
    </>
  );
};

export default Community;
