"use client";

import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Explaination } from "@/data-schema/enums";
import { data } from "@/data/explainations/defiDollars";

export const ExplainDefiDollars = ({
  explaination,
  setShowExplanation,
}: {
  explaination: Explaination;
  setShowExplanation: (show: boolean) => void;
}) => {
  return (
    <Box textAlign="left" px={3}>
      {explaination === Explaination.DEFI_DOLLARS && (
        <Box>
          <Heading fontSize="md" color="#82add9" mb={2}>
            {data.title}
          </Heading>
          {data.paragraphs.map((p, i) => (
            <Box key={i} overflowY="scroll">
              <Text fontSize="sm" color="black">
                {p.text}
              </Text>
              <br />
            </Box>
          ))}
        </Box>
      )}
      <Button
        mt="2rem"
        variant="solid"
        colorScheme="blue"
        onClick={() => setShowExplanation(false)}
        w="100%"
        _hover={{
          bgColor: "blue.600",
        }}
      >
        Close
      </Button>
    </Box>
  );
};
