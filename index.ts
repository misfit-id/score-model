import { removeProfiles } from "./network";
import { rebalanceScore, buildTree, runSimulation, simulateVotes, rootProfile } from "./simulation";

const main = () => {
  buildTree(5);

  simulateVotes([rootProfile]);

  rebalanceScore([rootProfile]);
  let [newRoots, removedCount, ethSeized] = removeProfiles([rootProfile]);
  console.log("PURGING NO. 0");
  console.log("Accounts Removed", removedCount);
  console.log("New Roots", newRoots.length);
  console.log("Eth Seized", ethSeized);

  rebalanceScore(newRoots);
  [newRoots, removedCount, ethSeized] = removeProfiles(newRoots);

  console.log("PURGING NO. 1");
  console.log("Accounts Removed", removedCount);
  console.log("New Roots", newRoots.length);
  console.log("Eth Seized", ethSeized);
  runSimulation(newRoots);
}

main();