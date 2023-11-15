import React, { useState } from 'react';
import AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import loginImage from './logo4.png';
import { NavLink } from 'react-router-dom';
import loadingGif from './loading.gif'; // Make sure this path is correct

AWS.config.update({
    accessKeyId: 'AKIAVLCBUVXLEGIUGHX4',
    secretAccessKey: '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',
    region: 'us-east-1'
});

function MergedComponent() {
    const [asin, setAsin] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeAsin = (event) => {
        setAsin(event.target.value);
    };

    const invokeLambdaFunction = async () => {
        setIsLoading(true);
        const lambda = new AWS.Lambda();
        const params = {
            FunctionName: 'creativeAttributes',
            Payload: JSON.stringify({ asin: asin })
        };
    
        try {
            const lambdaResult = await lambda.invoke(params).promise();
            const parsedLambdaResult = JSON.parse(lambdaResult.Payload);
    
            if (typeof parsedLambdaResult.body === 'string') {
                parsedLambdaResult.body = JSON.parse(parsedLambdaResult.body);
            }
    
            setResult(parsedLambdaResult);
        } catch (error) {
            console.error('Error invoking Lambda function:', error);
            setResult({ error: 'Error invoking Lambda function' });
        } finally {
            setIsLoading(false);
        }
    };

    const renderResult = () => {
        if (result && result.body) {
            const bodyData = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
            const dynamodbCsvData = bodyData.dynamodb_csv_data;
            const rankingData = bodyData.ranking_data;
      
            return (
                <>
                    <h3 className='custom-h2'>Suggested key features to capture</h3>
                    <table className="table table-striped mt-3 custom-table">
                        <thead>
                            <tr><th>Product features</th></tr>
                        </thead>
                        <tbody>
                            {dynamodbCsvData.csv_data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item['Attribute Name']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
      
                    <h3 className='custom-h2'>Product Category Best Sellers</h3>
                    <table className="table table-striped mt-3 custom-table">
                        <thead>
                            <tr>
                                <th>ASIN</th>
                                <th>Link</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankingData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.asin}</td>
                                    <td>
                                        <a href={item.link} target="_blank" rel="noopener noreferrer">Product Link</a>
                                    </td>
                                    <td>
                                        <img src={item.image} alt={`Product ${index}`} style={{ width: "100px", height: "auto" }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                <h2 className='custom-h2'>Submit ASIN for Details</h2>
                <input 
                    type="text" 
                    value={asin} 
                    onChange={handleChangeAsin} 
                    className="form-control mb-3" 
                    placeholder="Enter ASIN Here" 
                />
                <button 
                    onClick={invokeLambdaFunction} 
                    className="btn btn-primary custom-button-center"
                >
                    Submit
                </button>
                {isLoading && <img src={loadingGif} alt="Loading" className="loading-gif" />}
                {!isLoading && renderResult()}
            </div>
        </div>
    );
}

export default MergedComponent;
