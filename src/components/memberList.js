import { useMemberList } from "../hooks/useMemberList";

// A fancy function to shorten someones wallet address, no need to show the whole thing.
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

export const MemberList = () => {
  const memberList = useMemberList();
  return (
    <div>
      <h2>Your Protein Pals 🏋</h2>
      <table className="card">
        <thead>
          <tr>
            <th>Address</th>
            <th>$PROTEIN Amount</th>
          </tr>
        </thead>
        <tbody>
          {memberList.map((member) => {
            return (
              <tr key={member.address}>
                <td>{shortenAddress(member.address)}</td>
                <td>{member.tokenAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
