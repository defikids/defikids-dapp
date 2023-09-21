"use client";

import { User } from "@/data-schema/types";
import { Avatar, AvatarGroup } from "@chakra-ui/react";

const ChildAvatarGroup = ({ children }: { children: User[] }) => {
  return (
    <AvatarGroup
      size="lg"
      max={2}
      mt={10}
      mx={5}
      justifyContent="center"
      style={{
        cursor: "pointer",
      }}
    >
      {children?.map((child, i) => (
        <Avatar
          key={i}
          name={child?.username}
          src={child?.avatarURI || "./images/placeholder-avatar.jpeg"}
        />
      ))}
    </AvatarGroup>
  );
};

export default ChildAvatarGroup;
