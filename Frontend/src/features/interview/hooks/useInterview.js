import {generateInterviewReport,getAllInterviewReports,getInterviewReportById,generateResumePdf} from '../services/interview.api'
import { useContext,useEffect } from 'react'
import {InterviewContext} from "../interview.context"
import { useParams } from 'react-router'
export const useInterview=()=>{
  const context=useContext(InterviewContext)
  const {interviewId}=useParams()

  if(!context){
    throw new Error("useInterview must be used within an InterviewProvider")
  }
  const {loading,setLoading,report,setReport,reports,setReports}=context
  
  const generateReport=async({jobDescription,selfDescription,resumeFile})=>{
    setLoading(true)
    try{
        const response=await generateInterviewReport({jobDescription,selfDescription,resumeFile})
        setReport(response.interviewReport)
        return response.interviewReport
    }
    catch(error){console.log(error)}
    finally{setLoading(false)}
  }

  const getReportById=async(interviewId)=>{
       setLoading(true)
       try{
        const response=await getInterviewReportById(interviewId)
        setReport(response.interviewReport)
       }
       catch(error){console.log(error)}
       finally{
        setLoading(false)
       }
  }

  const getReports=async()=>{
    setLoading(true)
    try{
        const response=await getAllInterviewReports()
        setReports(response.interviewReports)
    }
    catch(error){
        console.log(error)
    }
    finally{
        setLoading(false)
    }
  }

  const getResumePdf=async (interviewReportId) => {
    if (!interviewReportId || interviewReportId === "undefined") {
    console.error("Interview report ID is missing");
    return;
  }
    setLoading(true)
    let response=null
    try{
     const response = await generateResumePdf({ interviewReportId });

    const blob = new Blob([response], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `resume_${interviewReportId}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
      console.log(err)
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
      if(interviewId){
        getReportById(interviewId)
      }
      else{
        getReports()
      }
  },[interviewId])
  return {loading,setLoading, report,reports,generateReport,getReportById,getReports,getResumePdf}
}







