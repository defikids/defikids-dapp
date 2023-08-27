import { Container, Heading, Image, Box } from "@chakra-ui/react";

const Resources = () => {
  return (
    <Container mt="10rem">
      <Box boxSize="m">
        <Image src="/images/defikids-placeholder.png" alt="DefiKids" />
      </Box>
      <Heading>
        <b>Welcome to our resources page</b>
      </Heading>
      <br></br>
      <p>
        <b>Engaging Learning Adventures:</b>
      </p>
      <p>
        Our app transforms the complex world of cryptocurrency and budgeting
        into exciting learning adventures for kids. Through interactive sandbox
        education, we make learning both educational and entertaining.
      </p>
      <br></br>
      <p>
        <b>Build Strong Financial Foundations:</b>
        <p>
          {" "}
          We're dedicated to building a strong financial foundation for the
          future. Our app introduces kids to the principles of budgeting and
          managing money wisely. With early exposure to these skills, children
          gain confidence in navigating their financial journeys.
        </p>
        <br></br>
      </p>
      <p>
        <b>Safety First:</b>
      </p>
      <p>
        Your child's safety is our priority. Our app provides a sandbox mode,
        which results in a secure environment for learning about
        cryptocurrencies without any real-world transactions. You can trust that
        your child is exploring and learning in a controlled, risk-free space.
      </p>
      <br></br>
      <p>
        <b>Parent-Child Collaboration:</b>
      </p>
      <p>
        {" "}
        We believe in the power of learning together. Our app encourages open
        conversations between parents and kids about finances. Engage in
        activities, track progress, and guide your child's learning journey to
        ensure they're equipped with valuable financial knowledge.
      </p>
    </Container>
  );
};

export default Resources;
