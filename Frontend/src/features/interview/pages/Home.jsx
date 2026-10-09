import React from "react";

const Home=()=>{
    return(
        <main className="home">
         <div className="left">
           <textarea name="job-description" id="jobDescription" placeholder="">
           </textarea>
         </div>
        <div className="right">
           <textarea name="self-description" id="jobDescription" placeholder="">
           </textarea>
         </div>
 <div className="input-world">
    <h1> input</h1>
 </div>
 <button className="generate-btn">generate report</button>
        </main>
    )
}


export default Home