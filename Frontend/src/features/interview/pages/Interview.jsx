import React, { useState,useEffect } from "react";
import { useLocation, useNavigate,useParams} from "react-router";
import "../style/Interview.scss";
import { useInterview } from "../hooks/useInterview";
const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {interviewId}=useParams()
const {
  report: contextReport,
  getReportById,
  loading,
} = useInterview();

const report = location.state?.report || contextReport;

useEffect(() => {
  if (!location.state?.report && interviewId) {
    getReportById(interviewId);
  }
}, [interviewId]);

  const [activeTab, setActiveTab] = useState("technical");
  const [expandedQuestion, setExpandedQuestion] = useState(0);
  const technicalQuestions = report?.technicalQuestions || [];
  const behavioralQuestions = report?.behavioralQuestions || [];
  const skillGaps = report?.skillGaps || [];
  const preparationPlan = report?.preparationPlan || [];
  const matchScore = Number(report?.matchScore) || 0;

  const tabs = [
    { id: "technical", label: "Technical Questions", icon: "▤" },
    { id: "behavioral", label: "Behavioral Questions", icon: "♧" },
    { id: "roadmap", label: "Road Map", icon: "➤" },
  ];

  const questions =
    activeTab === "technical"
      ? technicalQuestions
      : behavioralQuestions;

  const toggleQuestion = (index) => {
    setExpandedQuestion((current) =>
      current === index ? -1 : index
    );
  };

  const getSeverityClass = (severity) => {
    const value = String(severity || "medium").toLowerCase();

    if (value === "high") return "high";
    if (value === "low") return "low";
    return "medium";
  };

  if (!report) {
    return (
      <main className="interview-page">
        <section className="interview-empty">
          <h2>No interview report found</h2>
          <p>Generate your personalized report first.</p>
          <button onClick={() => navigate("/")}>
            Go to Dashboard
          </button>
        </section>
      </main>
    );
  }
  if (loading && !report) {
  return (
    <main className="interview-page">
      <section className="interview-empty">
        <h2>Generating your report view...</h2>
        <p>Please wait a moment.</p>
      </section>
    </main>
  );
}

  return (
    <main className="interview-page">
      <div className="interview-layout">

        {/* Left sidebar */}
        <aside className="interview-sidebar">
          <div className="sidebar-heading">SECTIONS</div>

          <nav className="interview-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedQuestion(0);
                }}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            ← Back to Dashboard
          </button>
        </aside>

        {/* Main content */}
        <section className="interview-main">
          {activeTab !== "roadmap" ? (
            <>
              <div className="section-title">
                <div>
                  <h2>
                    {activeTab === "technical"
                      ? "Technical Questions"
                      : "Behavioral Questions"}
                  </h2>
                  <p>Practice your personalized interview answers.</p>
                </div>

                <span className="question-count">
                  {questions.length} Questions
                </span>
              </div>

              {questions.length > 0 ? (
                <div className="question-list">
                  {questions.map((item, index) => (
                    <article
                      className={`question-card ${
                        expandedQuestion === index ? "expanded" : ""
                      }`}
                      key={`${activeTab}-${index}`}
                    >
                      <button
                        className="question-header"
                        onClick={() => toggleQuestion(index)}
                        aria-expanded={expandedQuestion === index}
                      >
                        <span className="question-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="question-text">
                          {item.question}
                        </span>

                        <span className="question-chevron">
                          {expandedQuestion === index ? "⌃" : "⌄"}
                        </span>
                      </button>

                      {expandedQuestion === index && (
                        <div className="question-details">
                          <div className="detail-block">
                            <h4 className="intention-label">
                              INTENTION
                            </h4>
                            <p>{item.intention || "Understand your knowledge and approach."}</p>
                          </div>

                          <div className="detail-block">
                            <h4 className="answer-label">
                              SAMPLE ANSWER
                            </h4>
                            <p className="answer-text">
                              {item.answer || "No sample answer available."}
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="interview-empty">
                  No questions available in this section.
                </div>
              )}
            </>
          ) : (
            <div className="roadmap-section">
              <div className="section-title">
                <div>
                  <h2>Preparation Road Map</h2>
                  <p>Your personalized interview preparation plan.</p>
                </div>
                <span className="question-count">
                  {preparationPlan.length} Days
                </span>
              </div>

              {preparationPlan.length > 0 ? (
                <div className="roadmap-list">
                  {preparationPlan.map((item, index) => (
                    <article className="roadmap-card" key={index}>
                      <div className="roadmap-day">
                        Day {item.day ?? index + 1}
                      </div>
                      <div className="roadmap-content">
                        <h3>{item.focus}</h3>
                        <p>{item.tasks}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="interview-empty">
                  No preparation plan available.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right sidebar */}
        <aside className="interview-insights">
          <section className="insight-card score-card">
            <h3>MATCH SCORE</h3>

            <div
              className="score-ring"
              style={{
                "--score-angle": `${Math.min(
                  100,
                  Math.max(0, matchScore)
                ) * 3.6}deg`,
              }}
            >
              <div className="score-inner">
                <strong>{matchScore}</strong>
                <span>%</span>
              </div>
            </div>

            <p className="score-caption">
              {matchScore >= 80
                ? "Strong match for this role"
                : matchScore >= 60
                ? "Good potential for this role"
                : "More preparation recommended"}
            </p>
          </section>

          <section className="insight-card skills-card">
            <h3>SKILL GAPS</h3>

            {skillGaps.length > 0 ? (
              <div className="skill-list">
                {skillGaps.map((item, index) => (
                  <div
                    className={`skill-item ${getSeverityClass(
                      item.severity
                    )}`}
                    key={`${item.skill}-${index}`}
                  >
                    <span>{item.skill}</span>
                    <small>{item.severity}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted-text">No skill gaps listed.</p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
};

export default Interview;
