const _ = {};

// psql error handlers
_.psqlErrorHandler400 = (err, req, res, next) => {
  const codeArr = ["23502", "42703", "22P02"];
  if (codeArr.includes(err.code)) res.status(400).send({ msg: "Bad request" });
  else next(err);
};

_.psqlErrorHandler422 = (err, req, res, next) => {
  if (err.code === "23503")
    res.status(422).send({ msg: "Unprocessable entity" });
  else next(err);
};

_.psqlErrorHandler500 = (err, req, res, next) => {
  console.log(err.code === "23503");
  res.status(500).send({ msg: "Server error" });
};

// 405: invalid method controller
_.invalidMethodHandler = (req, res, next) => {
  res.status(405).send({ msg: "Invalid method" });
};

module.exports = _;
