import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Import axios for fetching the CSV

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

  return (
    <div className="container">
       <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">PACT</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Operation</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Creative</a>
            </li>
            
          </ul>
        </div>
      </nav>

      <div className="my-3">
      
        <input type="file" onChange={handleFileChange} className="form-control" />
      </div>

      <div className="text-center">
        <button onClick={handleUpload} disabled={!file || uploading} className="btn btn-primary mb-3">
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {uploading && (
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%`, transition: 'width 0.5s' }} role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        )}
      </div>

      {csvData.length > 0 && (
        <table className="table table-striped mt-3">
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
      )}
    </div>
  );
}

export default FileUpload;
