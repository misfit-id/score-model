import { DECAY_FACTOR, RAW_GEREEN_CHECKMARK_THRESHOLD, MAX_WALKUP_DEPTH, WALKDOWN_DECAY, WALKUP_DECAY } from "./consts";
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

  return networkWalkupScore * WALKUP_DECAY;
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

  return networkWalkdownScore * WALKDOWN_DECAY;
}
