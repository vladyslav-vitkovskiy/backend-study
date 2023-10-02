export let dbObject = [
  {
    id: 1,
    title: "product1",
    description: "description1",
    price: 100,
  },
];

export const updateDbObject = (newDbObject: typeof dbObject) =>  {
    dbObject = newDbObject;
}

export const allowedProperties = ["title", "description", "price"];
