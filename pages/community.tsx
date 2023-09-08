import Link from "next/link";
import {
  Center,
  Heading,
  Box,
  Image,
  Container,
  useBreakpointValue,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";

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
      <Navbar />
      <Center mt={40}>
        <Heading
          size={isMobileSize ? "2xl" : "xl"}
          display="flex"
          alignItems="baseline"
          justifyContent="center"
          mb={5}
          color="#90cdf4"
        >
          Join our community of DefiKids!
        </Heading>
      </Center>
      <VStack mt={50}>
        <Container maxW="60%" centerContent mb={-90} mt={-58}>
          <Box padding="4" maxW="100%">
            <Image
              boxSize="100%"
              src="/images/defikids-community-graphic.gif"
              alt="Dan Abramov"
              mr={5}
            />
          </Box>
        </Container>
        <Grid templateColumns="repeat(2, 1fr)" gap={10} mt={20}>
          <GridItem>
            <Link href={twitterLink} passHref target="_blank">
              <Center fontSize={20} color="#90cdf4">
                <h1>Twitter</h1>
              </Center>
            </Link>
          </GridItem>

          <GridItem>
            <Link href={discordLink} passHref target="_blank">
              <Center fontSize={20} color="#90cdf4">
                <h1>Discord</h1>
              </Center>
            </Link>
          </GridItem>
        </Grid>
      </VStack>
    </>
  );
};

export default Community;
