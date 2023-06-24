import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import

const uuid = require('uuid');
const client = new DynamoDBClient({});
const tableName = process.env.DYNAMO_TABLE
const responseHeaders = {
	"Content-Type": "application/json",
};

export const createReservation = async (event) => {
	console.log(event);

	// retrieve request body from event object
	let requestBody = JSON.parse(event.body);
	console.log(requestBody);

	const reservationId = uuid.v5()
	// convert request to dynamodb input format
	const record = {
		TableName: tableName,
		"Key": {
			"ReservationId": {
				"S": reservationId
			},
			"ReservationName": {
				"S": requestBody.reservationName
			},
			"ReservationDateTime": {
				"S": requestBody.reservationDateTime
			},
			"PartySize": {
				"N": requestBody.partySize
			}
		}
	};

	const command = new PutItemCommand(record);
	const createResponse = await client.send(command);

	console.log(createResponse);

	const returnResponse = {
		statusCode: createResponse.$metadata.httpStatusCode,
		body: JSON.stringify(`Reservation ID: ${reservationId}`),
		responseHeaders
	};

	return returnResponse;
};
