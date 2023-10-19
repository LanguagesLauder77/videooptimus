import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import loginImage from './logo4.png'; 
import { NavLink } from 'react-router-dom';
// Configure AWS SDK
AWS.config.update({
    accessKeyId: 'AKIAVLCBUVXLEGIUGHX4',
    secretAccessKey: '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',
    region: 'us-east-1'
});

function MergedComponent() {
    // LambdaInvoker State
    const [filterValue, setFilterValue] = useState('');
    const [result, setResult] = useState(null);

    // DataTable State
    const [data, setData] = useState([]);
    const [alias, setAlias] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // LambdaInvoker Functions
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

    // DataTable Functions
    useEffect(() => {
        if (alias) {
            fetchData();
        }
    }, [alias]);

    const fetchData = async () => {
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
    };

    function handleInvokeLambda() {
        if (alias) {
          fetchData();
        } else {
          setError('Please select a category before invoking the lambda function.');
        }
      }
      const resetBestSellerData = () => {
        setData([]);
        setAlias("");
        setLoading(false);
        setError(null);
    };
    
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
                <NavLink to="/FileUpload" className="nav-link" activeClassName="active-link">Operations</NavLink>
            </li>
            <li className="nav-item" style={{padding: "10px"}}>
                <NavLink to="/Combine" className="nav-link" activeClassName="active-link">Creative</NavLink>
            </li>
        </ul>
    </div>
</nav>
<div className="mt-3">
            <h2>Relative Attributes</h2>
           
        </div>
            {/* LambdaInvoker Section */}
            <div className="content-section">
                <select value={filterValue} onChange={handleChange} className="form-select mb-3">
                    <option value="">Select a filter</option>
                    <option value="BOOK">BOOK</option>
                    <option value="APPAREL">APPAREL</option>
                    <option value="PERSONAL_COMPUTER">PERSONAL COMPUTER</option>
                    <option value="FOOD">FOOD</option>
                    <option value="CONSUMER_ELECTRONICS">CONSUMER ELECTRONICS</option>
                    <option value="SHOES">SHOES</option>
                   
                </select>
                <button onClick={invokeLambdaFunction} className="custom-button-color mb-3 invoke-button">Submit</button>
                <button onClick={resetData} className="custom-button-color mb-3 ml-3 reset-button">Reset</button>
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
            <div className="mt-3">
            <h2>Best Seller</h2>
           
        </div>      
            {/* DataTable Section */}
            <div className="content-section">
            <button onClick={resetBestSellerData} className="custom-button-color mb-3">Reset Best Seller Data</button>
        <select className="form-select" onChange={(e) => setAlias(e.target.value)}>
          <option value="">Select a category</option>
          
        <option value="apparel">Apparel</option>
        <option value="shoes">Shoes & Handbags</option>
        <option value="grocery">Grocery & Gourment Foods</option>
        <option value="beauty">Beauty</option>
        <option value="automotive">Car & Motorbike</option>
        <option value="computers">Computers & Accessories</option>
        <option value="electronics">Electronics</option>
        <option value="books">Books</option>
        </select>
       
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
      ) : (
        <table className="table custom-table">
          <thead>
            <tr>
              <th>ASIN</th>
              <th>LINK</th>
              <th>IMAGE</th>
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

export default MergedComponent;
