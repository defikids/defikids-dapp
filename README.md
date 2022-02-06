# Allocate

It is a platform to teach kids how to grow their allowance through the use of de-fi tools. It's designed for kids, managed by parents.

<img src="public/allocate-presentation-cover.png" href="https://allocate.vercel.app" alt="Logo" >

## Description

Crypto doesn't have to be complicated. The Allocate platform is designed to help you and your family learn how to comfortably use crypto in your everyday life. It's designed for kids, managed by parents.

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
- Torus: Used for authentication.
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
