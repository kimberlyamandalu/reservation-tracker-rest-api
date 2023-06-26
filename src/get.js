const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const ddbClient = new DynamoDBClient({});
const tableName = process.env.DYNAMODB_TABLE;
const responseHeaders = {
	"Content-Type": "application/json",
};

module.exports.getReservation = async (event) => {
	console.log("Event:", event);

	// retrieve Reservation ID value from Path Params
	const reservationId = JSON.stringify(event.path.reservationId);
	console.log(`Retrieving Reservation ID: ${reservationId}...`);

	const recordKey = {
		TableName: tableName,
		"Key": {
			"ReservationId": {
				"S": reservationId
			}
		}
	};

	const command = new GetItemCommand(recordKey);
	const getResponse = await ddbClient.send(command);
	console.log("Get Item Response:", getResponse);

	// assign null when item not found
	const item = getResponse.Item || null;
	console.log("Item:", item);
	var responseBody;

	if (item !== null) {
		console.log("Retrieved Dynamo Record:", item);

		// format response body to be returned
		responseBody = {
			"reservationId": item.ReservationId.S,
			"reservationName": item.ReservationName.S,
			"reservationDateTime": item.ReservationDateTime.S,
			"partySize": item.PartySize.N
		};
	}
	else
		responseBody = `Reservation ID ${reservationId} not found. Please provide a valid ID.`;

	const returnResponse = {
		statusCode: getResponse.$metadata.httpStatusCode,
		body: JSON.stringify(responseBody),
		headers: responseHeaders
	};

	return returnResponse;
};
