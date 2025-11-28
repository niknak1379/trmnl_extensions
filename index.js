import express from "express";
import cors from "cors";
import extensionsRouter from "./Extentsions/Extensions.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/Extensions", extensionsRouter);
app.get("/health", (req, res) => {
  res.send("healthy").status(200);
});
app.listen(3000, () => {
  console.log("server listening on port 3000");
});
