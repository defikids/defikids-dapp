import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import { faq_list } from "@/data/faq";

export const FaqAccordian = () => {
  return (
    <Accordion>
      {faq_list.map(({ title, data }) => (
        <AccordionItem key={title}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Heading as="h3" size="lg" color="white">
                  {title}
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {data.map(({ question, answer }) => (
              <Box key={question}>
                <Heading as="h3" size="md" color="teal">
                  {question}
                </Heading>
                <Text mb={4}>{answer}</Text>
              </Box>
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
