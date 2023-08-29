import { Flex, useToast, Avatar, Box } from "@chakra-ui/react";

export const AvatarSelection = ({
  fileInputRef,
  avatarURI,
  setAvatarURI,
  openFileInput,
  setSelectedFile,
}: {
  fileInputRef: any;
  avatarURI: string;
  setAvatarURI: (uri: string) => void;
  openFileInput: () => void;
  setSelectedFile: (file: any) => void;
}) => {
  const toast = useToast();
  return (
    <>
      <Flex
        direction="column"
        justify="center"
        align="center"
        borderRadius={10}
      >
        <Avatar
          size="2xl"
          name="Dan Abrahmov"
          src={avatarURI ? avatarURI : "/images/placeholder-avatar.jpeg"}
          _hover={{ cursor: "pointer" }}
          onClick={openFileInput}
        />
      </Flex>

      <Box>
        {/* Avatar Action */}
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
      </Box>
    </>
  );
};
