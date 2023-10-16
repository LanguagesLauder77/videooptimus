import React, { useState } from 'react';
import AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

// Configure AWS SDK
AWS.config.update({
    accessKeyId: 'AKIAVLCBUVXLEGIUGHX4',
    secretAccessKey: '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',
    region: 'us-east-1'
});

function LambdaInvoker() {
  const [filterValue, setFilterValue] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    setFilterValue(event.target.value);
  };

  const invokeLambdaFunction = async () => {
    const lambda = new AWS.Lambda();

    const params = {
      FunctionName: 'creativeAttributes',
      Payload: JSON.stringify({ filter_value: filterValue })
    };

    try {
      const result = await lambda.invoke(params).promise();
      setResult(JSON.parse(result.Payload));
    } catch (error) {
      console.error('Error invoking Lambda function:', error);
    }
  };

  const renderTableHeaders = () => {
    if (result && result.body && result.body.length > 0) {
      return Object.keys(result.body[0]).map((key, index) => <th key={index}>{key}</th>);
    }
    return null;
  };

  const renderTableRows = () => {
    if (result && result.body) {
      return result.body.map((item, index) => (
        <tr key={index}>
          {Object.values(item).map((value, idx) => <td key={idx}>{value}</td>)}
        </tr>
      ));
    }
    return null;
  };

  const resetData = () => {
    setFilterValue('');
    setResult(null);
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
        
          </ul>
        </div>
      </nav>
      <div className="container mt-4">
    <div>
      <select value={filterValue} onChange={handleChange} className="form-select mb-3">
        <option value="">Select a filter</option>
        <option value="BOOK">BOOK</option>
        <option value="AXE">AXE</option>
        <option value="BASKET">BASKET</option>
        <option value="SHOES">SHOES</option>
      </select>
        
      <button onClick={invokeLambdaFunction} className="btn btn-dark mb-3 invoke-button">Submit</button>
      <button onClick={resetData} className="btn btn-dark mb-3 ml-3 reset-button">Reset</button>
      </div>
      {result && (
        <div>
          <h2>Result:</h2>
          <table className="table">
            <thead>
              <tr>
                {renderTableHeaders()}
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        </div>
      )}
    </div>
   
    </div>
  );
}

export default LambdaInvoker;
