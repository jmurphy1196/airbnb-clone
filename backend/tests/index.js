const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // path to your Express app
const expect = chai.expect;

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

  // Close the app after testing
  after(() => {
    agent.close();
  });
});
