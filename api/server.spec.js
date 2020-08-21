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
      return supertest(server)
        .get("/")
        .then(res => {
          expect(res.status).toBe(200);
        });
    });

    it("should return token when user logs in with proper credentials", async () => {
      await supertest(server).post("/api/auth/register").send({
        username: "Louie",
        password: "NewisAndTheHues",
      });
      const res = await supertest(server).post("/api/auth/login").send({
        username: "Louie",
        password: "NewisAndTheHues",
      });
      expect(res.body.token).not.toBeNull();
    });
  });
});

describe("jokes router", () => {
  beforeEach(async () => {
    // empty table and reset primary key back to 1
    await db("users").truncate();
  });

  describe("GET /jokes endpoint", () => {
    it("should fetch jokes from db", async () => {
      await request(server)
        .get("/api/jokes")
        .then(res => {
          expect(res.body).toBeDefined();
        });
    });
    it("should return 401 if there is no token", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.status).toBe(401);
    });
  });
});
