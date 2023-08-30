import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

interface CardProps {
  title: string;
  description: string;
  buttonTitle?: string;
  image?: string;
  link?: string;
}

export const CardGroup = ({
  data,
  columns,
}: {
  data: CardProps[];
  columns?: number;
}) => {
  return (
    <SimpleGrid
      columns={columns || 2}
      spacingX="40px"
      spacingY={columns > 1 ? "40px" : "20px"}
    >
      {data.map((item, i) => (
        <Card key={i}>
          <CardHeader>
            <Heading size="md">{item.title}</Heading>
          </CardHeader>
          <CardBody>
            <Text>{item.description}</Text>
          </CardBody>
          <Flex justify="flex-end" mr={5} mb={5}>
            <Button>{item.buttonTitle}</Button>
          </Flex>
        </Card>
      ))}
    </SimpleGrid>
  );
};
