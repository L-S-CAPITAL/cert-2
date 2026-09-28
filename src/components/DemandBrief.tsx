import React from 'react';
import { DEMAND_BRIEF } from '../data/demand';

const DemandBrief: React.FC = () => {
  const { where, geography, progressions } = DEMAND_BRIEF;

  return (
    <section className="demand-brief" aria-labelledby="wired-for-demand">
      <h2 id="wired-for-demand" className="demand-title">
        {DEMAND_BRIEF.title}
      </h2>

      <div className="terminal-card">
        <h3 className="demand-heading">{where.heading}</h3>
        <p className="demand-copy">{where.lead}</p>
        <p className="demand-copy demand-label">{where.modelLabel}</p>
        <ul className="terminal-list demand-points">
          {where.model.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="demand-copy demand-label">{where.rankingLabel}</p>
        <ol className="demand-ranks">
          {where.ranks.map((rank, index) => (
            <li key={rank.title}>
              <div className="demand-rank-head">
                <span className="demand-rank-title">
                  {index + 1}. {rank.title}
                </span>
                <span className="demand-level">{rank.level}</span>
              </div>
              <p className="demand-copy">{rank.body}</p>
              {rank.covers && (
                <p className="demand-copy">
                  <span className="demand-label">Covers: </span>
                  {rank.covers}
                </p>
              )}
            </li>
          ))}
        </ol>
        <p className="demand-copy">{where.regional}</p>
      </div>

      <div className="terminal-card">
        <h3 className="demand-heading">{geography.heading}</h3>
        {geography.horizons.map((horizon) => (
          <div key={horizon.title} className="demand-horizon">
            <h4 className="demand-subhead">{horizon.title}</h4>
            {horizon.places && (
              <ul className="pathway-list">
                {horizon.places.map((place) => (
                  <li key={place.area}>
                    <div className="pathway-area">{place.area}</div>
                    <div className="pathway-detail">{place.detail}</div>
                  </li>
                ))}
              </ul>
            )}
            {horizon.body && <p className="demand-copy">{horizon.body}</p>}
          </div>
        ))}
      </div>

      <div className="terminal-card">
        <h3 className="demand-heading">{progressions.heading}</h3>
        <p className="demand-copy">{progressions.rule}</p>
        <p className="demand-copy demand-label">{progressions.base}</p>
        <p className="demand-copy demand-label">{progressions.stackLabel}</p>
        <ul className="pathway-list">
          {progressions.paths.map((path) => (
            <li key={path.title}>
              <div className="pathway-area">{path.title}</div>
              <div className="pathway-detail">{path.detail}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DemandBrief;
