const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const uuid = require("uuid");

const ddbClient = new DynamoDBClient({});
const tableName = process.env.DYNAMO_TABLE;
const responseHeaders = {
	"Content-Type": "application/json",
};

module.exports.createReservation = async (event) => {
	console.log("Event:", event);

	// retrieve request body from event object
	let requestBody = JSON.parse(event.body);
	console.log("Request Body:", requestBody);

	// generate uuid value to assign as ID for new reservation record
	const reservationId = uuid.v4();

	// convert request to dynamodb input format
	const record = {
		"TableName": tableName,
		"ConditionExpression": "attribute_not_exists(ReservationId)", // prevents overwriting existing reservation
		"Item": {
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
				"N": requestBody.partySize.toString()
			}
		}
	};

	const command = new PutItemCommand(record);

	try {
		const createResponse = await ddbClient.send(command);
		console.log("Create Item Response:", createResponse);

		var statusCode = createResponse.$metadata.httpStatusCode;
		var responseBody = `Reservation created with ID: ${reservationId}`
	}
	catch (ConditionalCheckFailedException) {
		var statusCode = ConditionalCheckFailedException.$metadata.httpStatusCode;
		var responseBody = `Reservation ID: ${reservationId} already exists`
	}

	const returnResponse = {
		statusCode: statusCode,
		body: JSON.stringify(responseBody),
		headers: responseHeaders
	};

	return returnResponse;
}
