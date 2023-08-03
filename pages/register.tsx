import { useRouter } from "next/router";
import React from "react";
import Button from "../components/button";
import { shallow } from "zustand/shallow";
import HostContract from "../services/contract";
import { useAuthStore } from "@/store/auth/authStore";
import { toast } from "react-toastify";
import Sequence from "../services/sequence";

const Register: React.FC = () => {
  const router = useRouter();

  const { walletAddress } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
    }),
    shallow
  );

  const handleParent = async () => {
    try {
      const signer = Sequence.wallet?.getSigner();
      const contract = await HostContract.fromProvider(signer, walletAddress);
      await contract.registerParent();
      router.push("/parent");
    } catch (e) {
      console.log(e);
      if (e.code === 4001) {
        toast.error("User rejected transaction");
      }
    }
  };
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-hero text-blue-dark text-center mb-[8vh]">
        Are you a<br />
        parent or a child?
      </h1>
      <div className="flex">
        <Button className="mr-12 bg-blue-dark" onClick={handleParent}>
          I am a parent
        </Button>
        <Button className="bg-blue-oil">I am a child</Button>
      </div>
    </div>
  );
};

export default Register;
