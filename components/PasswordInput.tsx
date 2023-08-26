import {
  Button,
  Container,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";

export const PasswordInput = ({
  onFamilyIdSubmit,
}: {
  onFamilyIdSubmit: (familyId: string, parentAddress: string) => void;
}) => {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [parentAddress, setParentAddress] = useState("");
  const handleClick = () => setShow(!show);

  return (
    <Flex direction="column" w="100%">
      <InputGroup size="lg">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          value={password}
          placeholder="Family Id"
          onChange={(e) => setPassword(e.target.value)}
        />

        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>

      <Input
        mt={2}
        py={5}
        type="text"
        value={parentAddress}
        placeholder="Parent address"
        onChange={(e) => setParentAddress(e.target.value)}
      />
      <Flex justify="center">
        <Button
          colorScheme="blue"
          mt={5}
          size="md"
          onClick={() => {
            onFamilyIdSubmit(password, parentAddress);
            setParentAddress("");
            setPassword("");
          }}
        >
          Submit
        </Button>
      </Flex>
    </Flex>
  );
};
