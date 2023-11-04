import type { Web3Provider } from "@ethersproject/providers";
import ethers, {
  type BigNumberish,
  type Contract,
  Signer,
  Signature,
} from "ethers";
import { SignatureLike } from "@ethersproject/bytes";

// export const createStableTokenPermitMessage = async (
//   owner: string,
//   spender: number,
//   value: number,
//   contract: Contract,
//   library: Web3Provider
// ) => {
//   try {
//     const transactionDeadline = Date.now() + 20 * 60;
//     const nonce = await contract.nonces(owner);
//     const contractName = await contract.name();
//     const EIP712Domain = [
//       { name: "name", type: "string" },
//       { name: "version", type: "string" },
//       { name: "chainId", type: "uint256" },
//       { name: "verifyingContract", type: "address" },
//     ];
//     const domain = {
//       name: contractName,
//       version: "1",
//       chainId: library.network.chainId,
//       verifyingContract: contract.address,
//     };

//     const Permit = [
//       { name: "owner", type: "address" },
//       { name: "spender", type: "address" },
//       { name: "value", type: "uint256" },
//       { name: "nonce", type: "uint256" },
//       { name: "deadline", type: "uint256" },
//     ];
//     const message = {
//       owner,
//       spender,
//       value,
//       nonce: nonce.toHexString(),
//       deadline: transactionDeadline,
//     };
//     const data = JSON.stringify({
//       types: {
//         EIP712Domain,
//         Permit,
//       },
//       domain,
//       primaryType: "Permit",
//       message,
//     });

//     const signature = await library.send("eth_signTypedData_v4", [owner, data]);
//     const signData = utils.splitSignature(signature as string);
//     const { r, s, v } = signData;
//     return {
//       r,
//       s,
//       v,
//       deadline: transactionDeadline,
//     };
//   } catch (e) {
//     return { error: e };
//   }
// };

export const createStableTokenPermitMessage = async (
  signer: Signer,
  spenderContract: Contract,
  value: BigNumberish,
  contract: Contract
): Promise<{
  data?: SignatureLike;
  deadline?: number;
  error?: String;
}> => {
  try {
    const owner = await signer.getAddress();
    const spender = await spenderContract.getAddress();
    const transactionDeadline = Math.floor(Date.now() / 1000) + 20 * 60;
    const nonce = (await contract.nonces(owner)) as BigNumberish;
    const contractName = await contract.name();
    const chainId = (await signer.provider?.getNetwork())?.chainId.toString();

    // console.log("owner", owner);
    // console.log("spender", spender);
    // console.log("value", value);
    // console.log("nonce", nonce);
    // console.log("deadline", transactionDeadline);
    // console.log("contractName", contractName);
    // console.log("chainId", chainId);

    const domain = {
      chainId,
      name: contractName,
      verifyingContract: await contract.getAddress(),
      version: "2",
    };

    const message = {
      owner,
      spender,
      value,
      nonce,
      deadline: transactionDeadline,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const signature = await signer.signTypedData(domain, types, message);

    return {
      data: Signature.from(signature),
      deadline: transactionDeadline,
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
    };
  }
};

// export const createStableTokenPermitMessage = async (
//   owner: string,
//   spender: string,
//   value: BigNumberish,
//   contract: Contract,
//   library: providers.Web3Provider
// ): Promise<
//   { signature: SignatureLike; deadline: number } | { error: string }
// > => {
//   try {
//     const transactionDeadline = Math.floor(Date.now() / 1000) + 20 * 60;
//     const nonce = (await contract.nonces(owner)) as BigNumberish;
//     const domainSeparator = await contract.DOMAIN_SEPARATOR();

//     // Create the message digest
//     const messageDigest = ethers.utils.solidityKeccak256(
//       [
//         "bytes1",
//         "bytes1",
//         "bytes32", //domainSeparator
//         "bytes32", //keccak256(Permit)
//         "address", //owner
//         "address", //spender
//         "uint256", //value
//         "uint256", //nonce
//         "uint256", //transactionDeadline
//       ],
//       [
//         "0x19",
//         "0x01",
//         domainSeparator,
//         ethers.utils.id(
//           "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
//         ),
//         ethers.utils.getAddress(owner),
//         ethers.utils.getAddress(spender),
//         value,
//         nonce,
//         transactionDeadline,
//       ]
//     );

//     // Sign the message digest
//     const signature = await library
//       .getSigner()
//       .signMessage(ethers.utils.arrayify(messageDigest));

//     return {
//       signature: splitSignature(signature),
//       deadline: transactionDeadline,
//     };
//   } catch (err) {
//     console.error(err);
//     return { error: err };
//   }
// };
