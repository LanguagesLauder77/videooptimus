import React, { useState } from 'react';
import AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Make sure to have your custom CSS styles if needed
import loginImage from './logo4.png'; // Ensure the image path is correct
import { NavLink } from 'react-router-dom';

AWS.config.update({
  accessKeyId: 'AKIAVLCBUVXLEGIUGHX4',
  secretAccessKey: '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',
  region: 'us-east-1'
});

function MergedComponent() {
    // State for ASIN
    const [asin, setAsin] = useState('');
    const [result, setResult] = useState(null);

    // Handle ASIN input changes
    const handleChangeAsin = (event) => {
        setAsin(event.target.value);
    };

    // Invoke Lambda Function
    const invokeLambdaFunction = async () => {
        const lambda = new AWS.Lambda();
        const params = {
            FunctionName: 'creativeAttributes', // Replace with your Lambda function name
            Payload: JSON.stringify({ asin: asin })
        };

        try {
            const lambdaResult = await lambda.invoke(params).promise();
            setResult(JSON.parse(lambdaResult.Payload));
        } catch (error) {
            console.error('Error invoking Lambda function:', error);
            setResult({ error: 'Error invoking Lambda function' });
        }
    };

    // Render the result
    const renderResult = () => {
        if (result) {
            return <div><pre>{JSON.stringify(result, null, 2)}</pre></div>;
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

            {/* ASIN Input and Lambda Invocation */}
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
