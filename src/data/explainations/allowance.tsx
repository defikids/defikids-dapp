export const data = {
  title: "Allowance",
  paragraphs: [
    {
      text: "When sending an allowance you are exchanging the underlying asset (USDC) for a sandbox version of the asset. This sandbox token is called Defi Dollars and is only usable within the sandbox. The Defi Dollars are pegged to the underlying asset at a 1:1 ratio. This means that 1 Defi Dollar is always worth 1 USDC.",
    },
    {
      text: "The Defi Dollars are used to pay the allowance. The members are able to use these tokens to interact with the features of the sandbox.  When a member would like to withdraw the Defi Dollars for fiat the Parent will recieve a notification of the withdraw request via email.",
    },
    {
      text: "In order for the withdraw to be settled, the parent would need to approve the withdraw. This is done by signing the transaction with the parent's wallet. This creates a notification on the member dashboard that allows them to claim the funds. At this point, the Defi Dollars would be burned and the underlying asset would be sent to the parent. This is recorded on the blockchain and can be viewed by anyone. Finally, the parent would pay the member the amount of the allowance in fiat. This is done outside of the sandbox and is not recorded on the blockchain.",
    },
  ],
};
