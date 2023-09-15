import jwt from "jsonwebtoken"; // https://www.npmjs.com/package/jsonwebtoken

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", {
    expiresIn: "30d",
  });
};

export default generateToken;
