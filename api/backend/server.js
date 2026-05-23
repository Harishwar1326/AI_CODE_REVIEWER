const app = require("./index");

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Code reviewer backend listening on port ${port}`);
  });
}

module.exports = app;
