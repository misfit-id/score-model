## Misfit.ID Score Model

How to run:

1. Install Bun 
2. Run `bun index.ts > out`
3. Simulation will be spitted out as `out`

## Spec?

Green Checkmark Threshold = 0.95

Trustworthiness = 
    (Base Social Media Connectivity Points + Quadratic Vouching Points) * 
    KYC ID Boost *
    Network Rebalance Factor

Base Social Media Connectivity Points (Max 0.6) = 
    Web3:
        Farcaster Linkage - 0.15
        ShortENS - 0.15
        Lens - 0.1
        Regular ENS - 0.05
    Web2:
        Github - 0.1
        Twitter - 0.05
        Gmail - 0.05

Quadratic Vouching Points (Max 0.15):
    First Vouch - 2 MSF
    Second Vouch - 4 MSF
    Third Vouch - 8 MSF
    Fourth Vouch - 16 MSF

    1 Vouch = 0.01 

KYC ID Boost - 
    RNS 1 Year = 1.3
    RNS 5 Years = 1.5
    RNS 10 Years = 1.8

Network Rebalance Factor
    Decay Factor = 0.02

    Invitation Walk Up: 
        Sum(
            (Inviter Score - Green Checkmark Threshold) * 
            (1 - Decay Factor) ^ Tree Depth
        ) * 1.0

    Invitation Walk Down:
        Sum(
            (Invitee Score - Green Checkmark Threshold) * 
            (1 - Decay Factor) ^ Tree Depth
        ) * 0.5
