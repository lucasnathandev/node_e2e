import { createServer } from "node:http";
import { once } from "node:events";
import jwt from "jsonwebtoken";

const VALID = {
  user: "lucas",
  password: "nathan",
};

const JWT_KEY = "ajklshdais81231290ukljas98123";

async function loginRoute(req, res) {
  const { user, password } = JSON.parse(await once(req, "data"));
  if (user !== VALID.user || password !== VALID.password) {
    res.writeHead(401);
    return res.end(JSON.stringify({ error: "user invalid" }));
  }
  const token = jwt.sign({ user, message: "hey dude!" }, JWT_KEY);
  res.end(JSON.stringify({ token }));
}

function isHeadersValid(headers) {
  try {
    const auth = headers.authorization.replace(/bearer\s/gi, "");
    jwt.verify(auth, JWT_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

async function handler(req, res) {
  if (req.url === "/login" && req.method === "POST") {
    return loginRoute(req, res);
  }

  if (!isHeadersValid(req.headers)) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "invalid token" }));
  }

  res.end(JSON.stringify({ result: "Hey welcome!" }));
}

export const app = createServer(handler);

app.listen(3000, () => console.log("listening at 3000"));
