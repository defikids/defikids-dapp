import { AlertProps, AlertStatus } from "@chakra-ui/alert";

interface ToastProps {
  title: string;
  description: string;
  status: AlertStatus;
}

export const transactionErrors = (e: Error) => {
  console.error(e);

  if (e.message.includes("user rejected transaction")) {
    return {
      title: "Transaction Error",
      description: "User rejected transaction",
      status: "error",
    } as ToastProps;
  }

  return {
    title: "Error",
    description: "Network error",
    status: "error",
  } as ToastProps;
};
