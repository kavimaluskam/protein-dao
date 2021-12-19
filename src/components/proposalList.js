import { ethers } from "ethers";

import { tokenModule, voteModule } from "../modules";
import { useAddress } from "../hooks/useAddress";
import { useProposal } from "../hooks/useProposal";

// TODO: use proposal list here
export const ProposalList = (isVoting, hasVoted, setIsVoting, setHasVoted) => {
  const { address } = useAddress();
  const { proposals } = useProposal();

  console.log(proposals);
  if (!proposals || proposals.length === 0) {
    return () => <div>No proposals</div>;
  }

  return (
    <div>
      <h2>Active Proposals</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();

          //before we do async things, we want to disable the button to prevent double clicks
          setIsVoting(true);

          // lets get the votes from the form for the values
          const votes = proposals.map((proposal) => {
            let voteResult = {
              proposalId: proposal.proposalId,
              //abstain by default
              vote: 2,
            };
            proposal.votes.forEach((vote) => {
              const elem = document.getElementById(
                proposal.proposalId + "-" + vote.type
              );

              if (elem.checked) {
                voteResult.vote = vote.type;
                return;
              }
            });
            return voteResult;
          });

          // first we need to make sure the user delegates their token to vote
          try {
            //we'll check if the wallet still needs to delegate their tokens before they can vote
            const delegation = await tokenModule.getDelegationOf(address);
            // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
            if (delegation === ethers.constants.AddressZero) {
              //if they haven't delegated their tokens yet, we'll have them delegate them before voting
              await tokenModule.delegateTo(address);
            }
            // then we need to vote on the proposals
            try {
              await Promise.all(
                votes.map(async (vote) => {
                  // before voting we first need to check whether the proposal is open for voting
                  // we first need to get the latest state of the proposal
                  const proposal = await voteModule.get(vote.proposalId);
                  // then we check if the proposal is open for voting (state === 1 means it is open)
                  if (proposal.state === 1) {
                    // if it is open for voting, we'll vote on it
                    return voteModule.vote(vote.proposalId, vote.vote);
                  }
                  // if the proposal is not open for voting we just return nothing, letting us continue
                  return;
                })
              );
              try {
                // if any of the propsals are ready to be executed we'll need to execute them
                // a proposal is ready to be executed if it is in state 4
                await Promise.all(
                  votes.map(async (vote) => {
                    // we'll first get the latest state of the proposal again, since we may have just voted before
                    const proposal = await voteModule.get(vote.proposalId);

                    //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                    if (proposal.state === 4) {
                      return voteModule.execute(vote.proposalId);
                    }
                  })
                );
                // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                setHasVoted(true);
                // and log out a success message
                console.log("successfully voted");
              } catch (err) {
                console.error("failed to execute votes", err);
              }
            } catch (err) {
              console.error("failed to vote", err);
            }
          } catch (err) {
            console.error("failed to delegate tokens");
          } finally {
            // in *either* case we need to set the isVoting state to false to enable the button again
            setIsVoting(false);
          }
        }}
      >
        {proposals.map((proposal, index) => (
          <div key={proposal.proposalId} className="card">
            <h5>{proposal.description}</h5>
            <div>
              {proposal.votes.map((vote) => (
                <div key={vote.type}>
                  <input
                    type="radio"
                    id={proposal.proposalId + "-" + vote.type}
                    name={proposal.proposalId}
                    value={vote.type}
                    //default the "abstain" vote to chedked
                    defaultChecked={vote.type === 2}
                  />
                  <label htmlFor={proposal.proposalId + "-" + vote.type}>
                    {vote.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button disabled={isVoting || hasVoted} type="submit">
          {isVoting
            ? "Voting..."
            : hasVoted
            ? "You Already Voted"
            : "Submit Votes"}
        </button>

        <small>
          This will trigger multiple transactions that you will need to sign.
        </small>
      </form>
    </div>
  );
};
