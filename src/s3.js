import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: 'AKIAVLCBUVXLPN5B6LGY',
  secretAccessKey: '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',
  region: 'us-east-1'
});

export default s3;
