import { stable_coin_symbol } from "@/config";

export const data = {
  title: "Member Withdraw",
  paragraphs: [
    {
      text: `This action allows a member to withdraw their funds. The member will be able to withdraw the amount of Defi Dollars that they have earned. The Defi Dollars are pegged to the underlying asset at a 1:1 ratio. This means that 1 Defi Dollar is always worth 1 ${stable_coin_symbol}.`,
    },
    {
      text: "The parent will be notified when a member sends a request to withdraw their allowance.",
    },
    {
      text: "In order for the withdraw to be settled, the parent would need to approve the withdraw. This is done by signing the transaction with the parent's wallet. This creates a notification on the member dashboard that allows the parent to claim the funds. At this point, the Defi Dollars would be burned and the underlying asset would be sent to the parent. This is recorded on the blockchain and can be viewed by anyone. Finally, the parent would pay the member the withdraw amount in fiat. This is done personally and is not recorded on the blockchain.",
    },
  ],
};
