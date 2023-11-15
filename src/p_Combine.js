import React, { useState } from 'react';
import AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Ensure your custom CSS styles are correctly set up
import loginImage from './logo4.png'; // Verify the image path is correct
import { NavLink } from 'react-router-dom';

// AWS SDK configuration
AWS.config.update({
    accessKeyId: 'AKIAVLCBUVXLEGIUGHX4',
    secretAccessKey: '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',
    region: 'us-east-1'
});

function MergedComponent() {
    const [asin, setAsin] = useState('');
    const [result, setResult] = useState(null);

    const handleChangeAsin = (event) => {
        setAsin(event.target.value);
    };

    const invokeLambdaFunction = async () => {
        const lambda = new AWS.Lambda();
        const params = {
            FunctionName: 'creativeAttributes', // Replace with your Lambda function name
            Payload: JSON.stringify({ asin: asin })
        };
    
        try {
            const lambdaResult = await lambda.invoke(params).promise();
            console.log('Lambda result:', lambdaResult); // Log the raw lambda result
            console.log('Payload to be parsed:', lambdaResult.Payload); // Check the Payload

            // First parse the Payload from the Lambda function
            const parsedLambdaResult = JSON.parse(lambdaResult.Payload);
    
            // Now parse the 'body' within the Payload
            if (typeof parsedLambdaResult.body === 'string') {
                parsedLambdaResult.body = JSON.parse(parsedLambdaResult.body);
            }
    
            setResult(parsedLambdaResult);
        } catch (error) {
            console.error('Error invoking Lambda function:', error);
            setResult({ error: 'Error invoking Lambda function' });
        }
    };
    
    
    

    // Render the result in table format
    const renderResult = () => {
      if (result && result.body) {
          const bodyData = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;

        // Assuming the body contains 'dynamodb_csv_data' and 'ranking_data'
        const dynamodbCsvData = bodyData.dynamodb_csv_data;
        const rankingData = bodyData.ranking_data;

          return (
              <>
                {/* Render DynamoDB and CSV Data */}
                <h3>DynamoDB and CSV Data</h3>
                <table className="table table-striped mt-3 custom-table">
                    <thead>
                        <tr><th>Attribute Name</th></tr>
                    </thead>
                    <tbody>
                        {dynamodbCsvData.csv_data.map((item, index) => (
                            <tr key={index}>
                                <td>{item['Attribute Name']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Render Ranking Data */}
                <h3>Ranking Data</h3>
                <div className="ranking-container">
                    {rankingData.map((item, index) => (
                        <div key={index} className="ranking-item">
                            <img src={item.image} alt={`Product ${index}`} />
                            <a href={item.link} target="_blank" rel="noopener noreferrer">{item.asin}</a>
                        </div>
                    ))}
                </div>
              </>
          );
      }
      return null;
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

            <div className="content-section mt-3">
                <h2>Enter ASIN</h2>
                <input 
                    type="text" 
                    value={asin} 
                    onChange={handleChangeAsin} 
                    className="form-control mb-3" 
                    placeholder="Enter ASIN" 
                />
                <button 
                    onClick={invokeLambdaFunction} 
                    className="custom-button-color"
                >
                    Submit
                </button>
                {renderResult()}
            </div>
        </div>
    );
}

export default MergedComponent;
