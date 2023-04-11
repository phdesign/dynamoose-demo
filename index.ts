import * as dynamoose from "dynamoose"
import { ObjectType } from "dynamoose/dist/General"
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
  const consumers = []
  let lastKey: ObjectType | undefined = undefined
  do {
    let scan = ConsumerModel.scan().attributes(["id", "email"]).limit(10)
    if (lastKey) {
      scan = scan.startAt(lastKey)
    }
    const result = await scan.exec()
    lastKey = result.lastKey
    consumers.push(...result)
  } while (lastKey)
  console.log(`Found ${consumers.length} consumers`)
}

main()
