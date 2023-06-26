const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

const ddbClient = new DynamoDBClient({});
const tableName = process.env.DYNAMODB_TABLE;
const responseHeaders = {
	"Content-Type": "application/json",
};

module.exports.updateReservation = async (event) => {
	console.log("Event:", event);

	// retrieve path param
	const reservationId = event.pathParameters.reservationId;
	console.log(`Reservation ID: ${reservationId} will be updated`);

	// retrieve request body from event object
	let requestBody = JSON.parse(event.body);
	console.log("Request Body:", requestBody);

	// setup update item parameters
	// will only update item if it exists (i.e., prevents new item from being created)
	// returns updated item with new attribute values
	const record = {
		"TableName": tableName,
		"Key": {
			"ReservationId": {
				"S": reservationId
			}
		},
		"ConditionExpression": "attribute_exists(ReservationId)",
		"ExpressionAttributeNames": {
			"#RN": "ReservationName",
			"#RDT": "ReservationDateTime",
			"#PS": "PartySize"
		},
		"ExpressionAttributeValues": {
			":rn": {
				"S": requestBody.reservationName
			},
			":rdt": {
				"S": requestBody.reservationDateTime
			},
			":ps": {
				"N": requestBody.partySize.toString()
			}
		},
		"UpdateExpression": "SET #RN = :rn, #RDT = :rdt, #PS = :ps",
		"ReturnValues": "ALL_NEW"
	};

	const command = new UpdateItemCommand(record);
	var responseBody;
	var statusCode;

	try {
		const updateResponse = await ddbClient.send(command);
		console.log("Update Item Response:", updateResponse);

		const updatedItem = updateResponse.Attributes;
		responseBody = {
			"reservationId": updatedItem.ReservationId.S,
			"reservationName": updatedItem.ReservationName.S,
			"reservationDateTime": updatedItem.ReservationDateTime.S,
			"partySize": parseInt(updatedItem.PartySize.N)
		};
		statusCode = updateResponse.$metadata.httpStatusCode;
	}
	catch (ConditionalCheckFailedException) {
		statusCode = ConditionalCheckFailedException.$metadata.httpStatusCode;
		responseBody = `Reservation ID ${reservationId} not found. Nothing to update.`;
	}

	const returnResponse = {
		statusCode: statusCode,
		body: JSON.stringify(responseBody),
		headers: responseHeaders
	};

	return returnResponse;
};
