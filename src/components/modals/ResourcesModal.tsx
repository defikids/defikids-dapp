"use client";

import { useDisclosure, useBreakpointValue } from "@chakra-ui/react";
import {
  Heading,
  Image,
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
} from "@chakra-ui/react";

const resourcesInfo = (
  <>
    <p>
      <b>Engaging Learning Adventures:</b>
    </p>
    <p>
      Our app transforms the complex world of cryptocurrency and budgeting into
      exciting learning adventures for kids. Through interactive sandbox
      education, we make learning both educational and entertaining.
    </p>
    <br></br>
    <p>
      <b>Build Strong Financial Foundations:</b>
      <p>
        {`We're dedicated to building a strong financial foundation for the
        future. Our app introduces kids to the principles of budgeting and
        managing money wisely. With early exposure to these skills, children
        gain confidence in navigating their financial journeys.`}
      </p>
      <br></br>
    </p>
    <p>
      <b>Safety First:</b>
    </p>
    <p>
      {`Your child's safety is our priority. Our app provides a sandbox mode,
      which results in a secure environment for learning about cryptocurrencies
      without any real-world transactions. You can trust that your child is
      exploring and learning in a controlled, risk-free space.`}
    </p>
    <br></br>
    <p>
      <b>Parent-Child Collaboration:</b>
    </p>
    <p>
      {`We believe in the power of learning together. Our app encourages open
      conversations between parents and kids about finances. Engage in
      activities, track progress, and guide your child's learning journey to
      ensure they're equipped with valuable financial knowledge.`}
    </p>
  </>
);

const ResourcesModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  return (
    <>
      <Center>
        <Box mt="7rem" p={4} color="white">
          <Heading
            size={isMobileSize ? "2xl" : "xl"}
            justifyContent="center"
            mb={5}
            color="#90cdf4"
            textAlign="center"
          >
            Welcome to resources!
          </Heading>

          <Image
            borderRadius={20}
            src="/images/backgrounds/urban.svg"
            alt="DefiKids"
          />

          <Flex height={130} justifyContent="center">
            <Center>
              <Button variant="solid" colorScheme="blue" onClick={onOpen}>
                Why DefiKids?
              </Button>
            </Center>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent bg="white">
                <Heading>
                  <ModalHeader color="#90cdf4">Resources</ModalHeader>
                </Heading>

                <ModalCloseButton />
                <ModalBody bg="#f5f6f5">{resourcesInfo}</ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button variant="ghost">Secondary Action</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
        </Box>
      </Center>
    </>
  );
};

export default ResourcesModal;
