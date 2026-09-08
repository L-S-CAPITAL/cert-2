import React from 'react';
import { MathModule, Unit } from '../types';
import { makeDrillPaper, scoreDrill } from '../data/drill';
import { progressStore } from '../stores/progress';

interface MathDrillProps {
  module: MathModule;
  unit: Unit;
  onBack: () => void;
}

const MathDrill: React.FC<MathDrillProps> = ({ module, unit, onBack }) => {
  const bank = module.drillBank ?? [];
  const paperSize = module.drillPaperSize ?? Math.min(12, bank.length);
  const passPercent = module.drillPassPercent ?? 70;
  const passAnswered = module.drillPassAnswered ?? 8;
  const perQuestion = module.perQuestionSeconds;
  const globalSeconds = module.drillSeconds ?? 600;

  const makePaper = React.useCallback(
    () => makeDrillPaper(bank, paperSize),
    [bank, paperSize],
  );

  const [paper, setPaper] = React.useState(makePaper);
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Array<number | null>>(
    () => Array(paperSize).fill(null),
  );
  const [times, setTimes] = React.useState<Array<number | null>>(
    () => Array(paperSize).fill(null),
  );
  const [remaining, setRemaining] = React.useState(
    perQuestion ?? globalSeconds,
  );
  const [done, setDone] = React.useState(false);
  const [selected, setSelected] = React.useState<number | null>(null);
  const startedAt = React.useRef(Date.now());

  const finish = React.useCallback(() => {
    setDone(true);
  }, []);

  React.useEffect(() => {
    startedAt.current = Date.now();
  }, [index]);

  React.useEffect(() => {
    if (done) return undefined;
    const timer = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [done, index, perQuestion]);

  const recordTime = (list: Array<number | null>) => {
    const elapsed = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    const next = [...list];
    next[index] = elapsed;
    return next;
  };

  const commit = React.useCallback(
    (value: number | null) => {
      const nextAnswers = [...answers];
      nextAnswers[index] = value;
      const nextTimes = recordTime(times);
      setAnswers(nextAnswers);
      setTimes(nextTimes);
      setSelected(null);
      if (index + 1 >= paper.length) {
        finish();
      } else {
        setIndex(index + 1);
        if (perQuestion) setRemaining(perQuestion);
      }
    },
    [answers, times, index, paper.length, finish, perQuestion],
  );

  React.useEffect(() => {
    if (done || remaining > 0) return;
    if (perQuestion) {
      commit(null);
    } else {
      finish();
    }
  }, [remaining, done, perQuestion, commit, finish]);

  React.useEffect(() => {
    if (!done) return;
    const result = scoreDrill(answers, paper);
    const timed = times.filter((item): item is number => item !== null);
    const avg =
      timed.length === 0
        ? Number.POSITIVE_INFINITY
        : timed.reduce((sum, item) => sum + item, 0) / timed.length;
    const speedOk = perQuestion ? avg <= perQuestion : true;
    if (
      result.percent >= passPercent &&
      result.answered >= passAnswered &&
      speedOk
    ) {
      progressStore.markTopicComplete(unit.id, module.id);
    }
  }, [
    done,
    answers,
    paper,
    times,
    perQuestion,
    passPercent,
    passAnswered,
    unit.id,
    module.id,
  ]);

  const result = scoreDrill(answers, paper);
  const timed = times.filter((item): item is number => item !== null);
  const avg =
    timed.length === 0
      ? 0
      : Math.round(timed.reduce((sum, item) => sum + item, 0) / timed.length);
  const speedOk = perQuestion ? avg > 0 && avg <= perQuestion : true;
  const passed =
    result.percent >= passPercent &&
    result.answered >= passAnswered &&
    speedOk;
  const current = paper[index];
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const restart = () => {
    const nextPaper = makePaper();
    setPaper(nextPaper);
    setIndex(0);
    setAnswers(Array(paperSize).fill(null));
    setTimes(Array(paperSize).fill(null));
    setRemaining(perQuestion ?? globalSeconds);
    setDone(false);
    setSelected(null);
    startedAt.current = Date.now();
  };

  return (
    <div className="math-lesson">
      <button type="button" className="terminal-btn" onClick={onBack}>
        Back to modules
      </button>

      <div className="terminal-section-title" style={{ marginTop: 12 }}>
        <span className="icon">DRILL</span>
        <span>{module.title}</span>
        <span className="section-count">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          {perQuestion ? ' / Q' : ''}
        </span>
      </div>
      <p className="math-lede">{module.summary}</p>

      {done ? (
        <div className="terminal-card">
          <div className="card-title">
            <span className="icon">RESULT</span>
            <span>Drill result</span>
          </div>
          <p className="math-body">
            {result.correct} correct of {result.answered} answered ({result.percent}%).
          </p>
          {perQuestion ? (
            <p className="math-body">
              Average time on answered items: {avg}s (target ≤ {perQuestion}s).
            </p>
          ) : null}
          <p className="math-body">
            {passed
              ? 'Pass — module marked complete.'
              : `Need at least ${passAnswered} answered at ${passPercent}%${
                  perQuestion ? ` and average ≤ ${perQuestion}s` : ''
                }. Retry when you are ready.`}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="button" className="terminal-btn amber" onClick={restart}>
              Retry drill
            </button>
            <button type="button" className="terminal-btn" onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      ) : current ? (
        <div className="terminal-card">
          <div className="card-title">
            <span className="icon">Q</span>
            <span>
              Question {index + 1} / {paper.length}
            </span>
            <span className="section-count">{current.skill}</span>
          </div>
          <p className="math-problem">{current.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {current.options.map((option, optionIndex) => (
              <button
                key={option}
                type="button"
                className="terminal-btn"
                onClick={() => setSelected(optionIndex)}
                style={{
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  borderColor:
                    selected === optionIndex
                      ? 'var(--text-amber)'
                      : 'var(--border)',
                }}
              >
                {String.fromCharCode(65 + optionIndex)}. {option}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              type="button"
              className="terminal-btn amber"
              disabled={selected === null}
              onClick={() => selected !== null && commit(selected)}
            >
              Lock in
            </button>
            <button type="button" className="terminal-btn" onClick={() => commit(null)}>
              Skip
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MathDrill;
