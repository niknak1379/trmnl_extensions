import engine from "../index.js";
import trmnlAuth from "./Auth.js";
// templateFile
// dataFunc
// howOften
// screenID
async function scheduler(tempalteFile, dataFunc, howOften, screenID, taskName) {
  console.log(`setting interval of ${howOften} for task: ${taskName}`);

  let Data = await dataFunc();
  console.log(
    `Data coming from the scheduler function for task: ${taskName}\n`,
    Data
  );
  let trmnlHTML = await engine.renderFile(tempalteFile, Data);
  let access_token;
  try {
    access_token = await trmnlAuth();
  } catch (e) {
    console.log("Failed to get access token \n", e);
  }
  try {
    let trmnlResponse = await fetch(
      process.env.TRMNL_URL + "/api/screens/" + screenID,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        body: JSON.stringify({
          screen: {
            label: taskName,
            content: trmnlHTML,
            name: taskName,
            file_name: `${taskName}.png`,
            model_id: "2",
          },
        }),
      }
    );
    let screenData = await trmnlResponse.json();
    console.log("Screen body \n", screenData);
  } catch (e) {
    console.log("Error in scheduler when trying to update the screen\n", e);
  }
  setTimeout(scheduler, howOften);
}
export default scheduler;
