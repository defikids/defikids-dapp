import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const Admin = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [setterValue, setSetterValue] = useState("");
  const [setterKey, setSetterKey] = useState("");

  const flushAll = async () => {
    const confirmFlush = window.confirm("Are you sure you want to flush all?");
    if (!confirmFlush) {
      return;
    }

    const res = await fetch(`/api/vercel/flush-all`);
    const data = await res.json();
    console.log(data);
  };

  const getAllKeys = async () => {
    const res = await fetch(`/api/vercel/get-all-keys`);
    const data = await res.json();
    console.log(data);
  };

  const getJsonData = async () => {
    const res = await fetch(`/api/vercel/get-json?key=${inputValue}`);
    const data = await res.json();
    console.log(data);
  };

  const getData = async () => {
    const res = await fetch(`/api/vercel/get-data?key=${inputValue}`);
    const data = await res.json();
    console.log(data);
  };

  const setData = async () => {
    const res = await fetch(
      `/api/vercel/set-data?key=${setterKey}&value=${setterValue}`
    );
    const data = await res.json();
    console.log(data);
  };

  const deleteJSONData = async () => {
    const confirmFlush = window.confirm("Are you sure you want to delete?");
    if (!confirmFlush) {
      return;
    }

    const res = await fetch(`/api/vercel/delete-json-data?key=${inputValue}`);
    const data = await res.json();
    console.log(data);
  };

  const deleteData = async () => {
    const confirmFlush = window.confirm("Are you sure you want to delete?");
    if (!confirmFlush) {
      return;
    }

    const res = await fetch(`/api/vercel/delete-data?key=${inputValue}`);
    const data = await res.json();
    console.log(data);
  };

  const buttons = [
    {
      name: "flushall",
      method: () => flushAll(),
    },

    {
      name: "keys *",
      method: () => getAllKeys(),
    },
    {
      name: "getJsonData",
      method: () => getJsonData(),
    },
    {
      name: "getData",
      method: () => getData(),
    },
    {
      name: "deleteJSONData",
      method: () => deleteJSONData(),
    },
    {
      name: "deleteData",
      method: () => deleteData(),
    },
    {
      name: "setData",
      method: () => setData(),
    },
  ];

  if (!isUnlocked) {
    return (
      <Box textAlign="center" mt="10rem">
        <Heading as="h1">Admin Page</Heading>
        <Text as="h2" cursor="pointer" onClick={() => setIsUnlocked(true)}>
          Under Construction
        </Text>
      </Box>
    );
  }

  return (
    <Container mt="10rem" textAlign="center">
      <Heading mb={3}>Redis</Heading>
      <Text>--Open Console--</Text>

      <Divider my={5} borderColor="white" />

      <FormControl id="input">
        <FormLabel>Getting / Deleting</FormLabel>
        <Input
          placeholder="Input value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          borderColor="white"
          _hover={{
            borderColor: "white",
          }}
          _focus={{
            borderColor: "blue.500",
          }}
          sx={{
            "::placeholder": {
              color: "gray.400",
            },
          }}
        />
      </FormControl>

      <FormControl id="input" mt={5}>
        <FormLabel>Setting</FormLabel>
        <Input
          mb={2}
          placeholder="Key"
          value={setterKey}
          onChange={(e) => setSetterKey(e.target.value)}
          borderColor="white"
          _hover={{
            borderColor: "white",
          }}
          _focus={{
            borderColor: "blue.500",
          }}
          sx={{
            "::placeholder": {
              color: "gray.400",
            },
          }}
        />
        <Input
          placeholder="Value"
          value={setterValue}
          onChange={(e) => setSetterValue(e.target.value)}
          borderColor="white"
          _hover={{
            borderColor: "white",
          }}
          _focus={{
            borderColor: "blue.500",
          }}
          sx={{
            "::placeholder": {
              color: "gray.400",
            },
          }}
        />
      </FormControl>

      <Divider my={5} borderColor="white" />
      <Heading>Commands</Heading>

      <VStack spacing={3} my={5} width={"100%"}>
        {buttons.map((button, i) => (
          <Button
            key={i}
            onClick={button.method}
            m={2}
            style={{
              width: "100%",
            }}
          >
            {button.name}
          </Button>
        ))}
      </VStack>
    </Container>
  );
};

export default Admin;
