import { AlertProps, AlertStatus } from "@chakra-ui/alert";

interface ToastProps {
  title: string;
  description: string;
  status: AlertStatus;
}

export const transactionErrors = (e: Error) => {
  console.error("transactionErrors", e.message);

  if (e.message.includes("user rejected")) {
    return {
      title: "Transaction Error",
      description: "User rejected transaction",
      status: "error",
    } as ToastProps;
  }

  if (e.message.includes("User denied transaction signature")) {
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
