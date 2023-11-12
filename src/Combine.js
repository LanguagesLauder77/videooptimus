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
    // State for ASIN and result
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
            console.log('Lambda result:', lambdaResult); // Log raw lambda result
            const parsedResult = JSON.parse(lambdaResult.Payload);
            console.log('Parsed result:', parsedResult); // Log parsed result
            setResult(parsedResult);
        } catch (error) {
            console.error('Error invoking Lambda function:', error);
            setResult({ error: 'Error invoking Lambda function' });
        }
    };

    // Render the result in table format
    const renderResult = () => {
        console.log('Rendering result:', result); // Log the result being rendered
        if (result && result.body && Array.isArray(result.body)) {
            return (
                <table className="table">
                    <thead>
                        <tr>
                            {Object.keys(result.body[0]).map((key, index) => (
                                <th key={index}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {result.body.map((item, index) => (
                            <tr key={index}>
                                {Object.values(item).map((value, idx) => (
                                    <td key={idx}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
        return null;
    };

    return (
        <div className="container">
            {/* Navbar and other content */}
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
