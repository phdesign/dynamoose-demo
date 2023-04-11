import * as dynamoose from "dynamoose"
import { type Item } from "dynamoose/dist/Item"

// Optional: define a type for the model
type Consumer = Item & {
  id: string
  email: string
  cloudentityID: string
}

// Declare the model, type and schema. The table name defaults to the model name.
// The schema can be defined sparately or inline.
const ConsumerModel = dynamoose.model<Consumer>(
  "Consumer",
  new dynamoose.Schema(
    {
      id: String,
      email: String,
      cloudentityID: String,
    },
    {
      saveUnknown: true,
    }
  )
)

async function main() {
  // Get all consumers
  const consumers = await ConsumerModel.scan().exec()
  console.log(`Found ${consumers.length} consumers`)
  consumers.forEach((c) => console.log(`${c.id} - ${c.email}`))

  // Filter consumers by property
  const filteredConsumers = await ConsumerModel.scan("email")
    .eq("paul+dynamoose@eql.com")
    .exec()
  console.log(`Filtered ${filteredConsumers.length} consumers by email`)
  filteredConsumers.forEach((c) => console.log(`${c.id} - ${c.email}`))

  // Get a single consumer by partition key
  const consumer = await ConsumerModel.get(consumers[0].id)
  console.log("Found consumer by id")
  console.log(`${consumer.id} - ${consumer.email}`)
}

main()
