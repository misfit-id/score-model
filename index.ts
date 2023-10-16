import { rebalanceScore, buildTree, runSimulation, simulateVotes } from "./simulation";

const main = () => {
  buildTree(5);

  simulateVotes();

  rebalanceScore();
  runSimulation();
}

main();