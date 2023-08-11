process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let fakeSnack = { name: "fakesnack", price: 1.99 };

beforeEach(() => {
    items.push(fakeSnack);
});

afterEach(() => {
    items.length = 0;
});

describe("GET /items", () => {
    test("Get a list of items", async () => {
        const res = await request(app).get(`/items`);
        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual({ items: [fakeSnack] });
    });
});

describe("GET items/:name", () => {
    test("Get a particular item by name", async () => {
        const res = await request(app).get(`/items/${fakeSnack.name}`);
        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual({ item: fakeSnack });
    });
    test("invalid name should return 404", async () => {
        const res = await request(app).get(`/items/NOTfakeSnack`);
        expect(res.statusCode).toBe(404);

        expect(res.body).toHaveProperty("error");
    });
});

describe("POST /items", () => {
    test("Post an item", async () => {
        const secondSnack = { name: "secondFakeSnack", price: 2.99 };
        const res = await request(app).post("/items").send(secondSnack);

        expect(res.statusCode).toBe(201);

        expect(res.body).toEqual({ added: secondSnack });
    });
});

describe("PATCH /items/:name", () => {
    test("patch an existing item", async () => {
        const secondSnack = { name: "secondFakeSnack", price: 2.99 };
        const res = await request(app)
            .patch(`/items/${fakeSnack.name}`)
            .send(secondSnack);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ updated: secondSnack });
    });
    test("invalid name should return 404", async () => {
        const secondSnack = { name: "secondFakeSnack", price: 2.99 };

        const res = await request(app)
            .patch(`/items/NOTfakeSnack`)
            .send(secondSnack);
        expect(res.statusCode).toBe(404);

        expect(res.body).toHaveProperty("error");
    });
});

describe("DELETE /items/:name", () => {
    test("delete an item", async () => {
        const res = await request(app).delete(`/items/${fakeSnack.name}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted" });
        expect(items.length).toEqual(0);
    });

    test("invalid name should return 404", async () => {
        const res = await request(app).delete(`/items/NOTfakeSnack`);
        expect(res.statusCode).toBe(404);

        expect(res.body).toHaveProperty("error");
    });
});
