import * as dynamoose from "dynamoose"
import { type Item } from "dynamoose/dist/Item"
import { v4 as uuidv4 } from "uuid"

// Optional: define a type for the model
type Consumer = Item & {
  id: string
  email: string
  cloudentityID: string
}

// Declare the model, type and schema. The table name defaults to the model name.
// The schema can be defined sparately or inline.
const ConsumerModel = dynamoose.model<Consumer>("Consumer", {
  id: String,
  email: String,
  cloudentityID: String,
})

async function main() {
  // Create a new instance of the model.
  const consumer = new ConsumerModel({
    id: uuidv4(),
    email: "paul+dynamoose@eql.com",
    cloudentityID: uuidv4().replace("-", ""),
  })

  // Calling save will create a new item in the table.
  // Dynamoose will create the table if it doesn't exist!
  await consumer.save()
  console.log(`Saved consumer ${consumer.id}`)
}

main()
