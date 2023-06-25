import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import

const client = new DynamoDBClient({});
const tableName = process.env.DYNAMO_TABLE;
const responseHeaders = {
	"Content-Type": "application/json",
};

export const getReservation = async (event) => {
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

	const command = new GetItemCommand(recordKey);
	const getResponse = await client.send(command);
	console.log(getResponse);

	const item = getResponse.Item;
	console.log(item);

	const responseBody = {
		"reservationId": item.ReservationId.S,
		"reservationName": item.ReservationName.S,
		"reservationDateTime": item.ReservationDateTime.S,
		"partySize": item.partySize.N
	};
	const response = {
		statusCode: 200,
		body: responseBody,
		responseHeaders
	};

	return response;
};
