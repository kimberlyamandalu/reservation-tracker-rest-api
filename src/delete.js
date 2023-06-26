const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const ddbClient = new DynamoDBClient({});
const tableName = process.env.DYNAMODB_TABLE;
const responseHeaders = {
	"Content-Type": "application/json",
};

module.exports.deleteReservation = async (event) => {
	console.log("Event:", event);

	// get Reservation ID value from Path Param
	const reservationId = event.pathParameters.reservationId;

	// setup dynamo query parameters and return deleted item attributes
	const recordKey = {
		TableName: tableName,
		"Key": {
			"ReservationId": {
				"S": reservationId
			}
		},
		"ConditionExpression": "attribute_exists(ReservationId)",
		"ReturnValues": "ALL_OLD"
	};

	const command = new DeleteItemCommand(recordKey);
	var statusCode;
	var responseBody;
	try {
		const deleteResponse = await ddbClient.send(command);
		console.log("Delete Item Response:", deleteResponse);

		statusCode = deleteResponse.$metadata.httpStatusCode;
		responseBody = `Reservation with ID ${reservationId} cancelled`;
	}
	catch (ConditionalCheckFailedException) {
		statusCode = ConditionalCheckFailedException.$metadata.httpStatusCode;
		responseBody = `Reservation ID: ${reservationId} not found. Nothing to delete`;
	}

	const returnResponse = {
		statusCode: statusCode,
		body: JSON.stringify(responseBody),
		headers: responseHeaders
	};

	return returnResponse;
};
