# DefiKids

A platform to empower the next generation with the use of de-fi tools. It is designed for kids, managed by parents.

<img src="public/defikids-cover.png" href="https://allocate.vercel.app" alt="Logo" >

## Description

Crypto doesn't have to be complicated. The DefiKids platform is designed to help you and your family learn how to comfortably use crypto in your everyday life. It's designed for kids, managed by parents.

## Problem

How do you teach your children to use crypto safely and confidently.

## Our solution

- Parents create a family sandbox. They allocate funds to be used for allowance. A percentage of funds will be allocated to a staking contract in order to distribute rewards.

- Funds automatically stream to the child creating real-time cash flow.

- Children will have the ability to use De-Fi tools such as staking & time-locks. This introduces the concepts of savings, interest and compound interest.

- Funds can be allocated for the purchase of future goods and services through the use of time-locks. This ensures that children have the funds they need when they need it.

- The parent has the ability to enable full-access mode that will allow the child to withdraw funds to be used across crypto markets. By default, withdraws are sent back to the parent who can then payout the child with fiat.

## How It's Made

Architecture:

- Polygon: All contracts are on Polygon instead of L1.
- Web3Auth: Used for authentication.
- Sequence: Used for authentication
- Superfluid: Used to stream funds to children in real-time
- Next.js for frontend
- Truffle and Remix for Solidity development

Technologies

- Polygon: All contracts are deployed on Polygon to reduce gas fees.
- Web3Auth: Used as a web2 alternative to onboarding and authentication.
- Sequence: Used as a web2 alternative to onboarding and authentication.
- Superfluid: Handles the instant distrubution of funds and streams allowances to the children.
- Next.js for frontend
- Truffle and Remix for Solidity development

## The staking process

1. The child will call the USDCx contract and approve the Allocate Contract to handle their coins.
2. The Allocate Contract:

- Transfers their stake to a holding wallet.
- Calculates their reward.
- Transfers the reward to their Allocate wallet.
- Stores their stake for the locked duration.

3. The child can view the remaining duration at anytime
4. The child can only withdraw their initial stake once the duration has elapsed.
5. The reward is calculated at 5% of the initial funds times the duration.
6. The reward is Allocate tokens.

## Contracts

- Host Contract: 0xC92A93D03cFA2b34A904fE5A48c20Aa86aE54396
- Staking Contract: 0xfF3BcC9d56c9733bdb91604df59497C402F99D47

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run Dev Server
   ```sh
   npm start
   ```

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Stargazers ⭐ Thank you!

[![Stargazers repo roster for @NathanTarbert/DefiKids](https://reporoster.com/stars/notext/NathanTarbert/DefiKids)](https://github.com/NathanTarbert/DefiKids/stargazers)

## Community

Join our [Discord Community](https://discord.gg/bDGMYNa8Ng) of engaged individuals looking to teach their kids about crypto.

Follow us on [Twitter](https://twitter.com/defikids_)

## Test the app

Check it out [here](https://defikids-nathantarbert.vercel.app/)

## Contact Us

[📬 Email](https://defikidsproject@gmail.com)

