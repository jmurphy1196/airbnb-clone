const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // path to your Express app
const expect = chai.expect;
const { randPassword, randUserName } = require("@ngneat/falso");

chai.use(chaiHttp);

describe("User session", () => {
  let csrfToken;
  const agent = chai.request.agent(app); // Use the same agent for all requests

  before((done) => {
    agent.get("/api/csrf/restore").end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("XSRF-TOKEN");
      csrfToken = res.body["XSRF-TOKEN"];
      done();
    });
  });

  it("should return user data on successful login with either an email or username", (done) => {
    agent
      .post("/api/session")
      .set("XSRF-TOKEN", csrfToken)
      .send({
        credential: "Demo-lition",
        password: "password",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("user");
        expect(res.body.user).to.have.all.keys(
          "id",
          "firstName",
          "lastName",
          "email",
          "username"
        );
        agent
          .post("/api/session")
          .set("XSRF-TOKEN", csrfToken)
          .send({
            credential: "demo@user.io",
            password: "password",
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("user");
            expect(res.body.user).to.have.all.keys(
              "id",
              "firstName",
              "lastName",
              "email",
              "username"
            );
            done();
          });
      });
  });

  it("should return 401 and error message on invalid login", (done) => {
    agent
      .post("/api/session")
      .set("XSRF-TOKEN", csrfToken)
      .send({
        credential: "wrong.email@gmail.com",
        password: "wrong password",
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("errors");
        expect(res.statusCode).to.equal(401);
        done();
      });
  });
  it("should return the current user that is logged in", (done) => {
    agent
      .post("/api/session")
      .set("XSRF-TOKEN", csrfToken)
      .send({
        credential: "Demo-lition",
        password: "password",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        agent.get("/api/session").end((err, res) => {
          expect(res.body).to.have.property("user");
          expect(res.body.user).to.have.property("id");
          expect(res.body.user).to.have.property("firstName");
          expect(res.body.user).to.have.property("lastName");
          expect(res.body.user).to.have.property("email");
          expect(res.body.user).to.have.property("username");
          expect(res.body.user.username).to.equal("Demo-lition");
          done();
        });
      });
  });
  it("should create a new user with valid data", (done) => {
    agent
      .post("/api/users")
      .set("XSRF-TOKEN", csrfToken)
      .send({
        firstName: "John",
        lastName: "Smith",
        email: "tester123@123.com",
        username: randUserName(),
        password: randPassword(),
      })
      .end((err, res) => {
        expect(res.body).to.have.property("user");
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  // Close the app after testing
  after(() => {
    agent.close();
  });
});
