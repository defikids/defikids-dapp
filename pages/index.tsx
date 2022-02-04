import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import UnderlineText from "../components/underline_text";
import { UserType } from "../services/contract";
import { useStore } from "../services/store";

const Login = dynamic(() => import("../components/login"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const {
    state: { userType },
  } = useStore();
  useEffect(() => {
    switch (userType) {
      case UserType.UNREGISTERED:
        router.push("/register");
        break;
      case UserType.PARENT:
        router.push("/parent");
        break;
      case UserType.CHILD:
        router.push("/child");
        break;
      default:
        return;
    }
  }, [userType]);
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-hero text-blue-dark text-center mb-[8vh]">
        Teach your kids
        <br /> to use <span className="text-orange">crypto</span>,
        <br />
        <UnderlineText className="text-blue-oil" color="bg-orange">
          safely
        </UnderlineText>{" "}
        and
        <br />
        <UnderlineText className="text-blue-oil" color="bg-blue-dark">
          confidently
        </UnderlineText>
      </h1>
      <Login />
    </div>
  );
}
