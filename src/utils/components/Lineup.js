import React from "react";

const Lineup = ({ players }) => {
  return (
    <div className="Lineup">
      {players.map((data) => (
        <div
          key={data.id}
          className="lineup-item d-flex justify-content-center align-items-center position-relative"
        >
          <div className="inner d-flex justify-content-between align-items-start w-100">
            <div className="players-area">
              <div className="player-area w-100 d-flex justify-content-start align-items-center">
                <div className="pic d-flex justify-content-center align-items-center">
                  <img
                    src={data.pic}
                    alt="Player Pic"
                    className="mw-100 rounded-circle"
                  />
                </div>
                <div className="name">{data.name}</div>
              </div>
            </div>
            <div className="statistics-area d-flex flex-column justify-content-start overflow-auto">
              <div className="statistics-holder d-flex justify-content-end align-items-center">
                {data.statistics.map((statistic) => (
                  <div
                    key={statistic.id}
                    className="statistics-content text-center"
                  >
                    {statistic.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Lineup;
