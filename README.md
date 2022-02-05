# Allocate

This is the readme. Let's get this hack going!

Host Contract: 0xC92A93D03cFA2b34A904fE5A48c20Aa86aE54396
Staking Contract: 0xfF3BcC9d56c9733bdb91604df59497C402F99D47

## The staking process

1. The child will call the USDCx contract and approve the Allocate Contract to handle their coins,
2. The Allocate Contract:

- Transfers there stake to a holding wallet
- Calculates their reward
- Transfers the reward to their Allocate wallet
- Stores the locked duration of their stake

3. The child can view the remaining duration at anytime
4. The child can only withdraw their initial stake once the duration has elapsed.
5. The reward is calculated at 5% of the inital times the duration.
6. The reward is Alloacte tokens.
