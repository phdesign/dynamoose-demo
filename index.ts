import * as dynamoose from "dynamoose"
import { type Item } from "dynamoose/dist/Item"

dynamoose.logger().then((logger) => logger.providers.set(console))

// We never want Dynamoose to create tables.
dynamoose.Table.defaults.set({
  create: false,
  prefix: "route66-dev-paulh-",
  waitForActive: false,
})

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
      email: {
        type: String,
        index: {
          name: "emailGSI",
        },
      },
      cloudentityID: String,
    },
    {
      saveUnknown: true,
    }
  )
)

async function main() {
  // Get all consumers.
  const consumers = await ConsumerModel.scan()
    .attributes(["id", "email"])
    .limit(10)
    .all()
    .exec()
  console.log(`Found ${consumers.length} consumers`)
}

main()
