import express from "express";
import cors from "cors";
import scheduler from "./Utils/Scheduler.js";
import Weather from "./Extentsions/Weather/Weather.js";
import { Liquid } from "liquidjs";
let engine = new Liquid({
	root: "./templates",
});
const app = express();
app.engine("liquid", engine.express());
app.set("views", "./templates");
app.set("view engine", "liquid");

app.use(express.json());
app.use(
	cors({
		origin: "*",
	})
);
app.use(express.static("Static"));
// app.use("/Extensions", extensionsRouter);

app.get("/health", (req, res) => {
	res.send("healthy").status(200);
});

app.listen(3000, () => {
	console.log("server listening on port 3000");
	// scheduler("weather.liquid", Weather, 1000 * 10 * 60, 37, "weather");
});

export default engine;
