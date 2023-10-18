import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Import axios for fetching the CSV
import loginImage from './logo4.png'; 
import { NavLink } from 'react-router-dom';
// AWS Configuration (Replace with your configurations)
AWS.config.update({
  accessKeyId: 'AKIAVLCBUVXLEGIUGHX4',
  secretAccessKey: 'AwwEasqBxfkqd6dLTPwyHVnKW6dduJIjOg3MRVET',
  region: 'us-east-1'
});

const s3 = new AWS.S3();

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lambdaOutput, setLambdaOutput] = useState(null);
  const [csvData, setCsvData] = useState([]);
 
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  
   
  const handleUpload = async () => {
    try {
      setUploading(true);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      const uploadData = await s3.upload({
        Bucket: 'video-optimus-demo',
        Key: fileName,
        Body: file,
        ACL: 'public-read', 
      }).on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      }).promise();

      console.log('Upload success', uploadData);

      // Invoke Lambda function
      const lambda = new AWS.Lambda();
      const params = {
        FunctionName: 'videoOptimus',
        Payload: JSON.stringify({ key: fileName}), // add selectedOption here
      };
      lambda.invoke(params, (error, result) => {
        if (error) {
          console.error('Lambda invocation error', error);
        } else {
          const lambdaOutput = JSON.parse(result.Payload);
          console.log('Lambda output:', lambdaOutput);
          setLambdaOutput(lambdaOutput);

          // Adding a delay of 5 seconds before checking the CSV file
          setTimeout(() => {
            fetchCsvData();
          }, 10000);
        }
      });

    } catch (error) {
      console.error('Upload error', error);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 10000);
    }
  };

  const fetchCsvData = async () => {
    try {
      const response = await axios.get('https://videolambdaout.s3.amazonaws.com/output.csv');
      const data = response.data;
      const parsedCsvData = data.split('\n').map(row => row.split(','));
      setCsvData(parsedCsvData);
    } catch (error) {
      console.error('Error fetching CSV data:', error);
    }
  };

  const exportToCsv = (filename, rows) => {
    const processRow = (row) => {
        return row.map((element) => {
            return '"' + element.replace(/"/g, '""') + '"';
        }).join(',');
    };

    let csvContent = rows.map(processRow).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement("a");
        if (link.download !== undefined) { // feature detection, works in most modern browsers
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}




  return (
    <div className="container">

<nav className="navbar navbar-expand-lg navbar-custom">
    <a className="navbar-brand" href="#">
        <img src={loginImage} alt="Logo" width="70" height="70" className="d-inline-block align-top" />
    </a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
            <li className="nav-item" style={{padding: "10px"}}>
                <NavLink exact to="/HomePage" className="nav-link" activeClassName="active-link">Home</NavLink>
            </li>
            <li className="nav-item" style={{padding: "10px"}}>
                <NavLink to="/FileUpload" className="nav-link" activeClassName="active-link">Operations</NavLink>
            </li>
            <li className="nav-item" style={{padding: "10px"}}>
                <NavLink to="/Combine" className="nav-link" activeClassName="active-link">Creative</NavLink>
            </li>
        </ul>
    </div>
</nav>

       {/* Alert Box */}
       
      <div className="my-3">
      
        <input type="file" onChange={handleFileChange} className="form-control" />
      </div>
      
      <p className="note-text">
  Note: Please use the provided
  <a href="https://f.io/rbSoYEMO" target="_blank" rel="noopener noreferrer">  template </a> 
  without altering the format, and note that during the pilot, the maximum number of ASINs to be processed is limited to 50.
</p>  
      <div className="text-center">
        <button onClick={handleUpload} disabled={!file || uploading}  className="custom-button-color mb-3">
          {uploading ? 'UPLOADING...' : 'UPLOAD'}
        </button>

        {uploading && (
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%`, transition: 'width 0.5s' }} role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        )}
      </div>

      {csvData.length > 0 && (
    <div>
        <table className="table table-striped mt-3 custom-table">
            <thead>
                <tr>
                {csvData[0].map((header, index) => (
                    <th key={index}>{header}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                {csvData.slice(1).map((row, index) => (
                <tr key={index}>
                    {row.map((cell, index) => (
                    <td key={index}>{cell}</td>
                    ))}
                </tr>
                ))}
            </tbody>
        </table>
        <div className="text-center"> {/* This div is used to center the button */}
            <button 
              onClick={() => exportToCsv('data_export.csv', csvData)} 
              className="custom-button-color"
            >
                Export as CSV
            </button>
        </div>
    </div>
)}


      
    </div>
  );
}

export default FileUpload;
