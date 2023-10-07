import { Profile } from "./profile";

export const rootProfile = new Profile({
    isRoot: true,
    invitee: []
});

export const simulateOneProfile = (inviter: Profile, numOfVouches: number) => {
    let vouches: number[] = [];
    for (let i = 0; i < numOfVouches; i++) {
        vouches.push(1);
    }
    
    return new Profile({
        isRoot: false,

        // farcaster: Math.random() < 0.5,
        // shortENS: Math.random() < 0.5,
        // lens: Math.random() < 0.5,
        // ENS: Math.random() < 0.5,

        // github: Math.random() < 0.5,
        // twitter: Math.random() < 0.5,
        // gmail: Math.random() < 0.5,

        farcaster: true,
        shortENS: Math.random() < 0.5,
        lens: Math.random() < 0.5,
        ENS: true,

        github: true,
        twitter: true,
        gmail: true,

        kycIDBoost: "RNS_1",
        vouches,

        inviter: inviter,
        invitee: []
    })
}

export const simulateTree = (depth: number) => {
    const root = rootProfile;

    let totalUser = 0;
    let totalTokenConsumption = 0;

    let currentRoots = [root];
    for (let d = 0; d < depth; d++) {
        const nextRoots: Profile[] = [];
        for (const currentRoot of currentRoots) {
            for (let i = 0; i < 5; i++) {
                let currentProfile = simulateOneProfile(currentRoot, Math.floor(Math.random() * 20));
                nextRoots.push(currentProfile);
             
                printProfileScore(currentProfile, true)
                currentRoot.noteInvite(currentProfile);
                totalUser ++;
                totalTokenConsumption += currentProfile.tokenConsumption();
            }
        }

        currentRoots = nextRoots;
    }

    console.log("Simulation Done");
    console.log("Total User", totalUser);
    console.log("Total Token Consumption", totalTokenConsumption);
}


export const printProfileScore = (profile: Profile, explicit = false) => {
    console.log("====================================")
    console.log("Total Score", profile.score())
    console.log("Token Consumption", profile.tokenConsumption())
    console.log("Is Greencheckmarked", profile.isGreenCheckmarked() ? "👌" : "👎")

    if (explicit) {
        console.log("Base Social Network Score", profile.baseSocialMediaScore())
        console.log("Quadratic Vouching Score", profile.quadraticVouchingScore())
        console.log("KYC ID Boost Score", profile.kycIDBoostScore())
        console.log("Walkup Score", profile.walkupScore())
        console.log("Walkdown Score", profile.walkdownScore())
    }

    console.log("====================================")
}