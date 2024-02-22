            import React, { useState, useEffect } from 'react';
            import { v4 as uuidv4 } from 'uuid';
            import AWS from 'aws-sdk';
            import 'bootstrap/dist/css/bootstrap.min.css';
            import axios from 'axios'; // Import axios for fetching the CSV
            import loginImage from './logo4.png'; 
            import { NavLink } from 'react-router-dom';
            import DOMPurify from 'dompurify';

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
              const [uniqueCsvFilename, setUniqueCsvFilename] = useState('');
              const [csvData, setCsvData] = useState([]);
            
              
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
                    FunctionName: 'videoOptimus', // Replace with your lambda function name
                    Payload: JSON.stringify({
                        Records: [
                            {
                                s3: {
                                    bucket: {
                                        name: 'video-optimus-demo' // Replace with your bucket name
                                    },
                                    object: {
                                        key: fileName
                                    }
                                }
                            }
                        ]
                    }),
                };

              
                  lambda.invoke(params, (error, result) => {
                    if (error) {
                      console.error('Lambda invocation error', error);
                    } else {
                      const lambdaOutput = JSON.parse(result.Payload);
                      console.log('Lambda output:', lambdaOutput);
                      setLambdaOutput(lambdaOutput);
                      console.log('UNIQUE NAME:', fileName)
                      setUniqueCsvFilename(lambdaOutput.uniqueCsvFilename);

                      // Adding a delay of 5 seconds before checking the CSV file
                      setTimeout(() => {
                        fetchCsvData(fileName);
                      }, 29000);
                    }
                  });

                } catch (error) {
                  console.error('Upload error', error);
                } finally {
                  setTimeout(() => {
                    setUploading(false);
                    setProgress(0);
                  }, 20000);
                }
              };

              const fetchCsvData = async (fileName) => {
                if (!fileName) {
                  console.error("CSV filename is empty");
                  return;
                }
                try {
                  const url = `https://videolambdaout.s3.amazonaws.com/${fileName}`;
                  console.log("Requesting URL:", url);
                  const response = await axios.get(url, { responseType: 'text' });
                  console.log(response);
                  const data = response.data;
                  console.log(data);
                  const parsedCsvData = data.split('\n').map(row => row.split(','));
                  console.log(parsedCsvData);
                  setCsvData(parsedCsvData);
                } catch (error) {
                  console.error('Error fetching CSV data:', error);
                }
              };

              const handleFileChange = (event) => {
                const file = event.target.files[0];
              
                if (file) {
                  // Check if the file is a CSV by checking the MIME type
                  // Some browsers use the MIME type 'application/vnd.ms-excel' for CSV files
                  if (file.type === "text/csv" || file.type === "application/vnd.ms-excel") {
                    // It's a CSV file, set your file state
                    setFile(file);
                  } else {
                    // It's not a CSV file, handle error
                    console.error("File is not a CSV");
                    // Optionally, clear the file input here
                    event.target.value = null;
                  }
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
                    <img src={loginImage} alt="Logo" width="80" height="80" className="d-inline-block align-top" />
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
                            <NavLink to="/FileUpload" className="nav-link" activeClassName="active-link" style={{ 
                    textDecoration: 'underline', 
                    textDecorationColor: '#ffffff', // Replace with your desired color
                    paddingBottom: '2px', // Adjust the padding as needed
                    textUnderlineOffset: '3px' // Adjust the offset of the underline from the text
                }}>Operations</NavLink>
                        </li>
                        <li className="nav-item" style={{padding: "10px"}}>
                            <NavLink to="/Combine" className="nav-link" activeClassName="active-link">Creative</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>

                  {/* Alert Box */}
                  
                  <div className="content-section mt-3">
                  
                    <input type="file" onChange={handleFileChange} className="form-control" accept=".csv,text/csv"  />
                  </div>
                  
                  <p className="note-text">
              Note: Please use the provided
              <a href="https://f.io/rbSoYEMO" target="_blank" rel="noopener noreferrer">  template </a> 
              without altering the format, and currently, the maximum number of ASINs to be processed is limited to 50.
            </p>  
                  <div className="text-center">
                    <button onClick={handleUpload} disabled={!file || uploading}  className="custom-button-color mb-3">
                      {uploading ? 'Uploading...' : 'Upload'}
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
                        <thead className="sticky-header">
                            <tr>
                            {csvData[0].map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                        {csvData.slice(1).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => {
                                    // Check if it is the last cell in the row
                                    if (cellIndex === row.length - 2) {
                                        // Define the base URL
                                        const baseURL = "https://f.io/Nfx4TBGM/";
                                        // Create the complete URL by appending the cell content
                                        const customURL = `${baseURL}`;
                                        // Render the cell as a link
                                      //  return <td key={cellIndex}><a href={customURL} target="_blank" rel="noopener noreferrer">{cell}</a></td>;
                                      return (<td key={cellIndex}>
                                        <a href={customURL} target="_blank" rel="noopener noreferrer">
                                    {/* Add color to specific words */}
                                    {cell.split(' ').map((word, index) => {
                                        if (word === 'Substantial') {
                                            return <span key={index} style={{ color: 'red' }}>{word}</span>;
                                        } else if (word === 'High') {
                                            return <span key={index} style={{ color: 'orange' }}>{word}</span>;
                                        } else if (word === 'Medium') {
                                            return <span key={index} style={{ color: 'yellow' }}>{word}</span>;
                                        } else if (word === 'Low') {
                                            return <span key={index} style={{ color: 'blue' }}>{word}</span>;
                                          } else if (word === 'Negligible') {
                                            return <span key={index} style={{ color: 'green' }}>{word}</span>;
                                        } else {
                                            return <span key={index}>{word}</span>;
                                        }
                                    })}
                                </a>
                                </td>
                                );

                                    } else {
                                        // Render the cell as normal text
                                        return <td key={cellIndex}>{cell}</td>;
                                    }
                                })}
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
