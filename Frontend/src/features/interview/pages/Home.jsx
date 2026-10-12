import React, { useState,useRef } from "react";
import "../style/Home.scss";
import { useInterview } from "../hooks/useInterview";
import {useNavigate} from "react-router"
const Home = () => {
  const{generateReport}=useInterview()
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const resumeInputRef=useRef()
   const navigate=useNavigate()
   
   
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!resume && !selfDescription.trim()) {
    setError("Please upload a resume or enter your self-description.");
    return;
  }

  if (resume && resume.type !== "application/pdf") {
    setError("Please upload a valid PDF file.");
    return;
  }

  if (!jobDescription.trim()) {
    setError("Please enter the target job description.");
    return;
  }

  setLoading(true);
  setError("");
  setReport(null);

  try {
    const reportData = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile: resume,
    });

    if (!reportData?._id) {
      throw new Error("Report ID was not received.");
    }

    navigate(`/interview/${reportData._id}`, {
      state: { report: reportData },
    });
  } catch (err) {
    setError(
      err.response?.data?.message ||
      err.message ||
      "Report generation failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="home">
      <header className="home-header">
        <h1>
          Create Your Custom
          <span> Interview Plan</span>
        </h1>

        <p>
          Let AI analyze your resume and job requirements
          to create a personalized interview preparation report.
        </p>
      </header>

      <form className="report-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resume">Upload Resume (PDF)</label>
          <input
            id="resume"
            type="file"
            ref={resumeInputRef}
            name="resume"
            accept=".pdf,application/pdf"
            onChange={(e) =>
              setResume(e.target.files?.[0] || null)
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="jobDescription">
            Target Job Description
          </label>

          <textarea
            id="jobDescription"
            name="jobDescription"
            rows={8}
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="selfDescription">
            Self Description
          </label>

          <textarea
            id="selfDescription"
            name="selfDescription"
            rows={5}
            placeholder="Briefly describe your experience, skills, and career goals..."
            value={selfDescription}
            onChange={(e) =>
              setSelfDescription(e.target.value)
            }
          />
          <div className="form-info">
  <span className="info-icon">i</span>
  <span>
    Either a <span id="special">Resume </span> or a <span id="special">Self Description</span> is required to
    generate a personalised plan.
  </span>
</div>
        </div>

        {error && <p className="form-error">{error}</p>}
       
        <button type="submit" disabled={loading}>
          {loading
            ? "Generating Report..."
            : "✦ Generate Interview Report"}
        </button>
      </form>

      {report && (
        <section className="report-result">
          <h2>Your Interview Report</h2>
          <pre>{JSON.stringify(report, null, 2)}</pre>
        </section>
      )}
    </main>
  );
};

export default Home;
