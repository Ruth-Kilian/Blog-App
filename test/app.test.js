/* Test Express Application with Jest and SuperTest*/

// import dependencies
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

// start the test suite
describe("Testing Express App", () => {
  // define the individual test case -> sends a GET request to the route of the Express app
  it("should return a 200 OK status code for GET requests to /user", async () => {
    // timeout used to increace the timeout
    const response = await request(app).get("/user").timeout(10000); // Increase the timeout to 10000ms
    // the response should be OK ie. successful
    expect(response.statusCode).toBe(200);
  });

  // define the individual test case -> sends a GET request to the route of an unknown route
  it("should return a 404 Not Found status code for GET requests to an unknown route", async () => {
    const response = await request(app).get("/unknown");
    // the response should be not found
    expect(response.statusCode).toBe(404);
  });

  // sends a POST reques to the /blog route with an empty payload
  it("should return a 401 Unauthorized status code for requests with invalid payload to /blog", async () => {
    const response = await request(app).post("/blog").send({}); // Sending an empty payload
    // response should be Unauthorized
    expect(response.statusCode).toBe(401);
  });

  // this hook executes "after all" the test cases have run
  afterAll(async () => {
    // it closes the MongoDB connection to clean up resources
    await mongoose.connection.close();
  });
});
