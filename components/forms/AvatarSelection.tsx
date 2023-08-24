import {
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  useToast,
  Text,
  Switch,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";

export const AvatarSelection = ({
  provideUrl,
  inputUrlRef,
  fileInputRef,
  uploadURI,
  avatarURI,
  setAvatarURI,
  setUploadURI,
  openFileInput,
  setSelectedFile,
  setProvideUrl,
}: {
  provideUrl: boolean;
  inputUrlRef: any;
  fileInputRef: any;
  uploadURI: string;
  avatarURI: string;
  setAvatarURI: (uri: string) => void;
  setUploadURI: (uri: string) => void;
  openFileInput: () => void;
  setSelectedFile: (file: any) => void;
  setProvideUrl: (provideUrl: boolean) => void;
}) => {
  const toast = useToast();
  return (
    <>
      {/* Avatar input toggle switch */}
      <Flex direction="row" justify="space-between" align="center">
        <Text>{`Provide avatar ${!provideUrl ? "url" : "file"}`}</Text>
        <Switch
          id="sandbox"
          isChecked={provideUrl}
          colorScheme="blue"
          variant="outline"
          size="lg"
          onChange={(e) => setProvideUrl(e.target.checked)}
        />
      </Flex>
      <Divider mt={5} mb={5} borderColor="black" />

      {/* Avatar upload options */}
      <FormControl>
        <Flex direction="row" justify="space-between" align="center" my={5}>
          <Heading size="xs">{`Profile avatar ${
            provideUrl ? "url" : "file"
          }`}</Heading>

          {/* Clear avatar values */}
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => {
              setAvatarURI("");
              setUploadURI("");
            }}
          >
            Clear
          </Button>
        </Flex>

        {!provideUrl ? (
          <>
            {/* Avatar Action */}
            <Button
              colorScheme="blue"
              size="md"
              mt={2}
              onClick={openFileInput}
              w="100%"
            >
              Upload File
            </Button>

            {/* hidden file input */}
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => {
                e.preventDefault();
                const files = e.target.files;
                if (!files) return;

                const validTypes = ["image/png", "image/jpg", "image/jpeg"];

                if (
                  files &&
                  files.length > 0 &&
                  !validTypes.includes(files[0].type)
                ) {
                  toast({
                    title: "Error",
                    description:
                      "Invalid file type. Only accept images with .png, .jpg or .jpeg extensions.",
                    status: "error",
                  });
                }

                if (files && files.length > 0) {
                  const file = files[0];
                  const reader = new FileReader();

                  reader.onloadend = () => {
                    console.log(reader.result);
                    setAvatarURI(reader.result as string);
                  };

                  reader.readAsDataURL(file);

                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("description", "child_avatar");
                  setSelectedFile(formData);
                } else {
                  console.log("User canceled file selection");
                }
              }}
            />
          </>
        ) : (
          // URL input field and upload button
          <Flex
            direction="column"
            justify="center"
            align="center"
            w="100%"
            mt={5}
          >
            <Input
              type="text"
              color="black"
              ref={inputUrlRef}
              variant="outline" // Change the variant to "outline"
              placeholder="Provide image url"
              value={provideUrl ? uploadURI : avatarURI}
              onChange={(e) => {
                setUploadURI(e.target.value);
              }}
              borderColor="black"
              _hover={{
                borderColor: "gray.300",
              }}
              _focus={{
                borderColor: "blue.500",
              }}
            />
            <Button
              colorScheme="blue"
              size="md"
              my={5}
              px={5}
              w="100%"
              onClick={async () => {
                try {
                  const response = await axios.get(uploadURI);
                  if (response.status === 200) {
                    setAvatarURI(uploadURI);
                  }
                } catch (e) {
                  console.error(e);
                  toast({
                    title: "Error",
                    description: "Invalid image url",
                    status: "error",
                  });
                }
              }}
            >
              Upload Image URL
            </Button>
          </Flex>
        )}
      </FormControl>
    </>
  );
};
