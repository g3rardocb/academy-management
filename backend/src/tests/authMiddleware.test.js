const jwt = require("jsonwebtoken");
const authorizeRoles = require("../middlewares/authMiddleware");

jest.mock("jsonwebtoken");

describe("authorizeRoles Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
  it("permite acceso con rol permitido", () => {
    const middleware = authorizeRoles("admin", "profesor");

    req.headers.authorization = "Bearer valid.token";
    jwt.verify.mockReturnValue({ id: 1, role: "admin" });

    middleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid.token", process.env.JWT_SECRET);
    expect(req.user).toEqual({ id: 1, role: "admin" });
    expect(next).toHaveBeenCalled();
  });

  it("bloquea acceso con rol no permitido", () => {
    const middleware = authorizeRoles("admin");

    req.headers.authorization = "Bearer valid.token";
    jwt.verify.mockReturnValue({ id: 2, role: "estudiante" });

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Access denied: insufficient permissions"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("devuelve 401 si no hay header Authorization", () => {
    const middleware = authorizeRoles("admin");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "No token provided"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("devuelve 401 si el header no empieza con Bearer", () => {
    const middleware = authorizeRoles("admin");

    req.headers.authorization = "Token invalid";
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "No token provided"
    });
  });

  it("devuelve 401 si el token es inválido", () => {
    const middleware = authorizeRoles("admin");

    req.headers.authorization = "Bearer bad.token";
    jwt.verify.mockImplementation(() => { throw new Error("Invalid"); });

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token"
    });
  });

  it("acepta varios roles permitidos", () => {
    const middleware = authorizeRoles("admin", "profesor");

    req.headers.authorization = "Bearer valid.token";
    jwt.verify.mockReturnValue({ id: 3, role: "profesor" });

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("verifica jwt.verify se llama correctamente", () => {
    const middleware = authorizeRoles("admin");

    req.headers.authorization = "Bearer my.jwt.token";
    jwt.verify.mockReturnValue({ id: 4, role: "admin" });

    middleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("my.jwt.token", process.env.JWT_SECRET);
  });

  it("agrega user decodificado a req.user", () => {
    const middleware = authorizeRoles("admin");

    req.headers.authorization = "Bearer valid.token";
    jwt.verify.mockReturnValue({ id: 5, role: "admin" });

    middleware(req, res, next);

    expect(req.user).toEqual({ id: 5, role: "admin" });
  });

  it("no llama next si error en jwt.verify", () => {
    const middleware = authorizeRoles("admin");

    req.headers.authorization = "Bearer invalid";
    jwt.verify.mockImplementation(() => { throw new Error("Invalid"); });

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("soporta roles dinámicos", () => {
    const middleware = authorizeRoles("estudiante");

    req.headers.authorization = "Bearer valid.token";
    jwt.verify.mockReturnValue({ id: 6, role: "estudiante" });

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
afterAll(() => {
  console.error.mockRestore();
});
