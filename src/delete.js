import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import

const client = new DynamoDBClient({});
const tableName = process.env.DYNAMO_TABLE;
const responseHeaders = {
  "Content-Type": "application/json",
};

export const deleteReservation = async(event) => {  
	console.log(event);
	
	let requestBody = JSON.parse(event.body);
	console.log(requestBody);
	
	const recordKey = {
		TableName: tableName,
		"Key": {
			"ReservationId": {
					"S": requestBody.reservationId
			}
		}
	};
	
	const command = new DeleteItemCommand(recordKey);
	const deleteResponse = await client.send(command);
	console.log(deleteResponse);
	
	const response = {
			statusCode: deleteResponse.$metadata.httpStatusCode,
			body: JSON.stringify(`Reservation ID ${requestBody.reservationId} successfully deleted`),
			responseHeaders
	};

	return response;
};
