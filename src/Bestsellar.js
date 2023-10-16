import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.min.css';

function DataTable() {
  const [data, setData] = useState([]);
  const [alias, setAlias] = useState("");  // Set the default value to an empty string
  const [loading, setLoading] = useState(false);  // Set the default value to false
  const [error, setError] = useState(null);

  AWS.config.update({
    accessKeyId: 'AKIAVLCBUVXLEGIUGHX4',
    secretAccessKey: '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',
    region: 'us-east-1'
  });

  useEffect(() => {
    if (alias) {
      fetchData();
    }
  }, [alias]);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const params = {
        FunctionName: 'creativeLambda',
        Payload: JSON.stringify({ alias: alias })
      };

      const lambda = new AWS.Lambda();
      lambda.invoke(params, (err, result) => {
        if (err) {
          console.error('Error invoking lambda:', err);
          setLoading(false);
          setError(err.message);
        } else {
          console.log('Lambda response:', result);
          if (result.Payload) {
            try {
              const payloadData = JSON.parse(result.Payload);
              console.log('Parsed payload data:', payloadData);

              if (payloadData.errorMessage) {
                setError(payloadData.errorMessage);
              } else {
                setData(JSON.parse(payloadData.body));
              }
            } catch (error) {
              console.error('Error parsing payload:', error);
              setError(error.message);
            }
          } else {
            console.error('Payload is undefined');
            setError('Payload is undefined');
          }
          setLoading(false);
        }
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setError(error.message);
    }
  }

  function handleInvokeLambda() {
    if (alias) {
      fetchData();
    } else {
      setError('Please select a category before invoking the lambda function.');
    }
  }

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
        <select className="form-select" onChange={(e) => setAlias(e.target.value)}>
          <option value="">Select a category</option>
          
        <option value="apparel">Apparel</option>
        <option value="baby">Baby</option>
        <option value="luggage">Bags, Wallets and Luggage</option>
        <option value="beauty">Beauty</option>
        <option value="automotive">Car & Motorbike</option>
        <option value="computers">Computers & Accessories</option>
        <option value="electronics">Electronics</option>
        <option value="kitchen">Home & Kitchen</option>
        </select>
        <button className="btn btn-primary mt-2" onClick={handleInvokeLambda}>Invoke Lambda</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ASIN</th>
              <th>Link</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(data) ? data.map((item, index) => (
            <tr key={index}>
              <td>{item.asin}</td>
              <td><a href={item.link} target="_blank" rel="noreferrer" className="btn btn-link">Link</a></td>
              <td><img src={item.image} alt={item.asin} className="img-fluid" width="100" /></td>
            </tr>
          )) : <tr><td colSpan="3">No data available</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataTable;
