
![defikids](https://github.com/NathanTarbert/defikids/assets/66887028/5f89ee84-e66c-4909-b386-c489fe7387f0)
An empowering platform aimed at equipping the upcoming generation with De-Fi tools, tailored for youngsters and overseen by parents.

## Simplified Platform Overview:

Discover the world of cryptocurrency with ease through the DefiKids platform. This platform is designed to guide you and your family in using crypto confidently in your daily life, and it's tailored for kids while being supervised by parents.

## Common Challenge:

How do you teach your children to use crypto safely and confidently.

## Our Approach:

Parents can establish a secure family sandbox within the platform. They allocate funds for allowances and set aside a portion for staking. This staked amount generates rewards over time.

An exciting feature is that funds automatically flow to the child, providing a real-time understanding of finances.

## De-Fi Tools for Learning:

Children gain access to valuable De-Fi tools like staking and time-locks. These tools introduce them to concepts like savings, interest, and compound interest.

Moreover, funds can be reserved for future purchases through time-locks, guaranteeing that children have funds accessible when needed.

## Empowering Parents:

Parents can activate full-access mode, enabling children to withdraw funds for use in various crypto markets. By default, withdrawals are sent to parents, who can then convert them to fiat for their children.

## Technical Architecture:

- Contracts are deployed on the Polygon network for reduced gas fees.
- Sequence streamlines the onboarding and authentication processes.
- Superfluid technology facilitates real-time fund streaming to children.
- Next.js powers the user-friendly frontend.
- Solidity development involves Truffle and Remix.

## Understanding Staking:

Children initiate the staking process by approving the USDCx contract to manage their coins.

## The Allocate Contract:

- Transfers the staked amount to a secure holding wallet.
- Calculates and transfers the earned rewards to the Allocate wallet.
- Preserves the initial stake for the agreed-upon locked duration.
- Remaining lock duration is visible to the child at any time.
- Withdrawal of the initial stake is possible only after the lock duration expires.
- The reward, equivalent to 5% of the initial funds multiplied by the duration, is granted in Allocate tokens.

Embrace the user-friendly DefiKids platform to unlock the world of crypto for your family, while ensuring safety, learning, and financial exploration.

## Contracts

- Host Contract: 0xC92A93D03cFA2b34A904fE5A48c20Aa86aE54396
- Staking Contract: 0xfF3BcC9d56c9733bdb91604df59497C402F99D47

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites:

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation:

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

## Contributing:

Thanks for taking the time to contribute! Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody and are appreciated.

Please try to create bug reports that are:
- <i>Reproducible:</i> Include steps to reproduce the problem.
- <i>Specific</i> Include as much detail as possible: which version, what environment, etc.
- <i>Unique:</i> Do not duplicate existing opened issues.
- <i>Scoped to a Single Bug</i> One bug per report.

### Steps:

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

## Run the app

Check it out [here](https://defikids-nathantarbert.vercel.app/)

## Contact Us

[📬 Email](https://defikidsproject@gmail.com)

