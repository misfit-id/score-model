import { DECAY_FACTOR, RAW_GEREEN_CHECKMARK_THRESHOLD, MAX_WALKUP_DEPTH, WALKDOWN_DECAY, WALKUP_DECAY, REMOVAL_THRESHOLD } from "./consts";
import { Profile } from "./profile";

export const walkupProfile = (profile: Profile): number => {

  let networkWalkupScore = 1;
  let lastInviter = profile.inviter;

  let treeDepth = 1;

  while (lastInviter !== null && lastInviter !== undefined && treeDepth <= MAX_WALKUP_DEPTH) {
    networkWalkupScore += (
      lastInviter.score(true) - RAW_GEREEN_CHECKMARK_THRESHOLD
    )
     * (1 - DECAY_FACTOR) ** treeDepth;

    treeDepth ++;
    lastInviter = lastInviter.inviter;
  }

  return Math.max(networkWalkupScore * WALKUP_DECAY, 0.9);
}

export const walkdownProfile = (profile: Profile): number => {
  let networkWalkdownScore = 1;

  for (const invitee of profile.invitee) {
    networkWalkdownScore += 
      (
        invitee.score() - 
        RAW_GEREEN_CHECKMARK_THRESHOLD
      );
  }

  return Math.max(networkWalkdownScore * WALKDOWN_DECAY, 0.9);
}

// return the new roots
export const removeProfiles = (roots: Profile[]): [Profile[], number, number] => {
  let currentRoots = roots;
  let resultingRoots = roots;

  let accountRemoved = 0;
  let ethSeized = 0;

  while ( currentRoots && currentRoots.length > 0 ) {
    let nextRoots: Profile[] = [];
    for (const currentRoot of currentRoots) {
      if (currentRoot.finalScore() < REMOVAL_THRESHOLD) {
        // remove this root

        // remove this root from its father
        currentRoot.inviter?.invitee.filter(invitee => invitee.num === currentRoot.num);
        // remove this root from its children
        resultingRoots.push(...currentRoot.invitee);
        accountRemoved ++;

        ethSeized += currentRoot.tokenConsumption();
      }

      nextRoots = [...nextRoots, ...currentRoot.invitee];

      currentRoots = nextRoots;
    }
  }

  return [resultingRoots, accountRemoved, ethSeized];
}