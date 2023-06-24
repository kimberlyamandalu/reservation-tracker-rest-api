# reservation-tracker-rest-api

CI/CD Setup
1. Login to Serverless
2. Navigate to `app` and add an application
3. Add `app` and `org` to `serverless.yml`
    - set `org` property to the Serverless Framework Org (ex. `kimberlyamandalu`)
4. Login using AWS profile
		```bash
		serverless login
		Logging into the Serverless Dashboard via the browser
		If your browser does not open automatically, please open this URL:
		https://app.serverless.com?client=cli&transactionId=N949o1M2RPcv-CadcQxdz

		✔ You are now logged into the Serverless Dashboard
		```
5. Redeploy the project: `sls deploy --stage dev --aws-profile dev`