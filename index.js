var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
var express = require("express");

// Sample restaurant data
var restaurants = [
  {
    id: 1,
    name: "WoodsHill",
    description: "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccoli",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description: "Italian-American home cooked pasta and fresh sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description: "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

// Define GraphQL schema
var schema = buildSchema(`
type Query {
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
}
type restaurant {
  id: Int
  name: String
  description: String
  dishes: [Dish]
}
type Dish {
  name: String
  price: Int
}
input restaurantInput {
  name: String
  description: String
}
type DeleteResponse {
  ok: Boolean!
}
type Mutation {
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);

// Define root resolver
var root = {
  restaurant: (arg) => {
    return restaurants.find(restaurant => restaurant.id === arg.id);
  },
  restaurants: () => {
    return restaurants;
  },
  setrestaurant: ({ input }) => {
    const newRestaurant = {
      id: restaurants.length + 1, // Increment ID based on their length
      name: input.name,
      description: input.description,
      dishes: [] // Begni with an empty dishes array
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleterestaurant: ({ id }) => {
    const restaurantIndex = restaurants.findIndex(restaurant => restaurant.id === id);
    if (restaurantIndex === -1) {
      return { ok: false };
    }
    restaurants.splice(restaurantIndex, 1);
    return { ok: true };
  },
  editrestaurant: ({ id, name }) => {
    const restaurant = restaurants.find(restaurant => restaurant.id === id);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    restaurant.name = name;
    return restaurant;
  }
};

// Create Express server
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL UI for testing
  })
);

// Start the server
var port = 5500;
app.listen(5500, () => console.log("Running GraphQL on Port:" + port));