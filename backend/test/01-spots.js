const chai = require("chai");
const chaihttp = require("chai-http");
const app = require("../app");
const { resetDB } = require("./utils");

chai.use(chaihttp);
chai.should();

describe("Spots", () => {
  before(async () => {
    return await resetDB();
  });
  it("GET /api/spots should return status 200", (done) => {
    chai
      .request(app)
      .get("/api/spots")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("GET /api/spots should return 4 spots", (done) => {
    chai
      .request(app)
      .get("/api/spots")
      .end((err, res) => {
        res.body.should.have.ownProperty("Spots");
        chai.assert.equal(res.body.Spots.length, 4);
        done();
      });
  });
  it("GET /api/spots should return an array of Spots with appropriate format", (done) => {
    chai
      .request(app)
      .get("/api/spots")
      .end((err, res) => {
        res.body.should.have.ownProperty("Spots");
        const spots = res.body.Spots;
        for (const spot of spots) {
          chai.assert.hasAllKeys(spot, [
            "id",
            "address",
            "avgRating",
            "city",
            "createdAt",
            "description",
            "lat",
            "lng",
            "name",
            "ownerId",
            "postalCode",
            "preview",
            "price",
            "state",
            "updatedAt",
            "country",
          ]);
        }
        done();
      });
  });
  it("POST /api/spots should create a new spot in DB", (done) => {
    let csrfToken;
    chai
      .request(app)
      .get("/api/csrf/restore")
      .end((err, res) => {
        csrfToken = res.body["XSRF-TOKEN"];
        console.log(csrfToken);
        chai
          .request(app)
          .post("/api/session")
          .set("Cookie", `XSRF-TOKEN=${csrfToken};`)
          .set("XSRF-TOKEN", csrfToken)
          .type("json")
          .send({
            credential: "test",
            password: "password3",
          })
          .end((err, res) => {
            console.log(res.body);
            done();
          });
      });
  });
});
