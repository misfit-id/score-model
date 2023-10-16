import { walkdownProfile, walkupProfile } from "./network";
import { Profile } from "./profile";

export const rootProfile = new Profile({
    isRoot: true,
    socialNetworks: [],
    invitee: []
});

export const randomSocialNetworks = (): string[] => {
    return [
        Math.random() < 0.5 ? "Farcaster" : "",
        Math.random() < 0.5 ? "ShortENS" : "ENS",
        Math.random() < 0.5 ? "Lens" : "",
        
        Math.random() < 0.5 ? "Github" : "",
        Math.random() < 0.5 ? "Twitter" : "",
        Math.random() < 0.5 ? "Gmail" : "",
    ].filter(x => x != "");
}

export const randomRNS = (): string => {

    const random = Math.random();
    if (random < 0.05) {
        return "RNS_10";
    }

    if (random < 0.1) {
        return "RNS_5";
    }

    if (random < 0.5) {
        return "RNS_1";
    }

    return "";
}

export const simulateOneProfile = (inviter: Profile) => {    
    return new Profile({
        isRoot: false,

        socialNetworks: randomSocialNetworks(),
        kycIDBoost: randomRNS(),

        inviter: inviter,
        invitee: []
    })
}

export const buildTree = (depth: number) => {
    const root = rootProfile;

    let currentRoots = [root];

    for (let d = 0; d < depth; d ++) {
        const nextRoots: Profile[] = [];
        for (const currentRoot of currentRoots) {
            for (let i = 0; i < 10; i++) {
                let currentProfile = simulateOneProfile(currentRoot);
                currentRoot.noteInvite(currentProfile);
                nextRoots.push(currentProfile);
            }
        }

        currentRoots = nextRoots;
    }
}

export const simulateVotes = () => {
    let currentRoots = [rootProfile];
    
    while (currentRoots && currentRoots.length > 0) {
        const nextRoots: Profile[] = [];
        for (const currentRoot of currentRoots) {
            for (const invitee of currentRoot.invitee) {
                const numofVotes = Math.floor(Math.random() * 20);
                for (let i = 0; i < numofVotes; i++) {
                    invitee.receiveVote(Math.floor(Math.random() * 3));
                }

                nextRoots.push(invitee);
            }
        }

        currentRoots = nextRoots
    }
}

export const rebalanceScore = () => {
    let currentRoots = [rootProfile];
    while ( currentRoots && currentRoots.length > 0 ) {
        const nextRoots: Profile[] = [];
        for (const currentRoot of currentRoots) {
            let walkupScore = walkupProfile(currentRoot);
            let walkdownScore = walkdownProfile(currentRoot);

            currentRoot.noteNetworkScore(walkupScore, walkdownScore);
            for (const invitee of currentRoot.invitee) {
                nextRoots.push(invitee)
            }
        }
        currentRoots = nextRoots
    }
}

export const runSimulation = () => {    
    const root = rootProfile;

    let totalUser = 0;
    let totalTokenConsumption = 0;

    let checkmarks = 0;

    let currentRoots = [root];
    while (currentRoots && currentRoots.length > 0) {
        const nextRoots: Profile[] = [];
        for (const currentRoot of currentRoots) {
            if (currentRoot.isGreenCheckmarked()) {
                checkmarks ++;
            }

            totalTokenConsumption += currentRoot.tokenConsumption();

            printProfileScore(currentRoot, true)
            totalUser ++;

            for (const invitee of currentRoot.invitee) {
                nextRoots.push(invitee);
            }
        }

        currentRoots = nextRoots
    }

    console.log("Simulation Done");
    console.log("Total User", totalUser);
    console.log("Total Token Consumption", totalTokenConsumption);
    console.log("Total checkmarks", checkmarks);
}

export const printProfileScore = (profile: Profile, explicit = false) => {
    console.log("====================================")
    console.log("Total Score", profile.finalScore())
    console.log("Token Consumption", profile.tokenConsumption())
    console.log("Is Greencheckmarked", profile.isGreenCheckmarked() ? "👌" : "👎")

    if (explicit) {
        console.log("Base Social Network Score", profile.baseSocialMediaScore())
        console.log("Quadratic Vouching Score", profile.quadraticVouchingScore())
        console.log("KYC ID Boost Score", profile.kycIDBoostScore())
        console.log("Walup Score", walkupProfile(profile));
        console.log("Waldown Score", walkdownProfile(profile));
    }

    console.log("====================================")
}