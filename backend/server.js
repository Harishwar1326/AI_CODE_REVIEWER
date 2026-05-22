const app = require("../api/backend");

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Code reviewer backend listening on port ${port}`);
  });
}

module.exports = app;
