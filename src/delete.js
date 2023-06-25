import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import

const client = new DynamoDBClient({});
const tableName = process.env.DYNAMO_TABLE;
const responseHeaders = {
	"Content-Type": "application/json",
};

export const deleteReservation = async (event) => {
	console.log(event);

	const reservationId = event.pathParameters.reservationId
	console.log(`Reservation ID: ${reservationId} will be deleted`)

	const recordKey = {
		TableName: tableName,
		"Key": {
			"ReservationId": {
				"S": reservationId
			}
		}
	};

	const command = new DeleteItemCommand(recordKey);
	const deleteResponse = await client.send(command);
	console.log(deleteResponse);

	const response = {
		statusCode: deleteResponse.$metadata.httpStatusCode,
		body: JSON.stringify(`Reservation ID ${reservationId} successfully deleted`),
		responseHeaders
	};

	return response;
};
