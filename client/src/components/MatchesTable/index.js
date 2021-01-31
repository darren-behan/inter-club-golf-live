import React, { useContext } from 'react';
import DataAreaContext from '../../utils/DataAreaContext';
import './index.css';

function Table() {
  const { allMatches } = useContext(DataAreaContext);

  return (
    <div>
      <h2 className="title">Past, Present and Future Matches</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Competition Name</th>
            <th>Match Date</th>
            <th>Match Time</th>
            <th>Home Team</th>
            <th>Home Team Score</th>
            <th>Away Team Score</th>
            <th>Away Team</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {allMatches?.map(match =>
            <tr key={match.matchId}>
              <td>
                <span>{match.competitionName}</span>
              </td>
              <td>
                <span>{match.matchDate}</span>
              </td>
              <td>
                <span>{match.matchTime}</span>
              </td>
              <td>
                <span>{match.teamOneName}</span>
              </td>
              <td>
                <span>{match.teamOneScore}</span>
              </td>
              <td>
                <span>{match.teamTwoScore}</span>
              </td>
              <td>
                <span>{match.teamTwoName}</span>
              </td>
              <td>
                <span>{match.updatedAt}</span>
              </td>
            </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default Table;