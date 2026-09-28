import React from 'react';
import { COURSE_INFO } from '../data/course';
import DemandBrief from './DemandBrief';

const CourseOverview: React.FC = () => {
  return (
    <div className="course-overview">
      <div className="terminal-section">
        <div className="terminal-card">
          <div className="card-title">
            <span className="icon">DESCRIPTION</span>
            <span>Description</span>
          </div>
          <div
            className="course-description"
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}
          >
            {COURSE_INFO.overview}
          </div>
        </div>

        <div className="terminal-card" style={{ marginTop: 12 }}>
          <div className="card-title">
            <span className="icon">PATH</span>
            <span>Pathways & skills</span>
          </div>
          <ul className="pathway-list">
            {COURSE_INFO.pathways.map((pathway) => (
              <li key={pathway.area}>
                <div className="pathway-area">{pathway.area}</div>
                <div className="pathway-detail">{pathway.detail}</div>
              </li>
            ))}
          </ul>
          <div className="pathway-skillset-title">Core skillset you get:</div>
          <ul className="terminal-list pathway-skills">
            {COURSE_INFO.coreSkillset.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <DemandBrief />
      </div>
    </div>
  );
};

export default CourseOverview;
