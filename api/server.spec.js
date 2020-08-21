const request = require("supertest");

const server = require("./server.js");
const db = require("../database/dbConfig.js");
const supertest = require("supertest");

describe("server", () => {
  beforeEach(async () => {
    // empty table and reset primary key back to 1
    await db("users").truncate();
  });

  describe("GET /", () => {
    it("should return 200 OK (using async/await)", async () => {
      const res = await request(server).get("/");

      expect(res.status).toBe(200);
    });

    it("should respond with JSON", async () => {
      const res = await request(server).get("/");

      expect(res.type).toMatch(/json/i);
    });
  });

  describe("POST /register", () => {
    it("should return 201 upon succesful registration to add new user", async () => {
      const res = await request(server).post("/api/auth/register").send({
        username: "Huey",
        password: "LewisAndTheNews",
      });
      expect(res.status).toBe(201);

      const users = await db("users");
      expect(users).toHaveLength(1);
    });
    it("should return 400 if username/password is missing", async () => {
      const res = await request(server).post("/api/auth/register").send();
      expect(res.status).toBe(400);
    });
  });

  describe("POST /login", () => {
    it("should return 200 OK when user logs in with proper credentials", async () => {
      await request(server).post("api/auth/register").send({
        username: "user",
        password: "pass",
      });
      await request(server)
        .post("/api/auth/login")
        .send({
          username: "user",
          password: "pass",
        })
        .then(res => {
          expect(res.status).toBe(200);
          done();
        });
    });
  });
});
