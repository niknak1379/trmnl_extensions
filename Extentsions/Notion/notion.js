import dotenv from "dotenv";
import { Client } from "@notionhq/client";

dotenv.config();

export async function notion_tasks() {
	const notion = new Client({ auth: process.env.INTERNAL_INTEGRATION_SECRET });
	let title = await notion.pages.properties.retrieve({
		page_id: page.id,
		property_id: "title", //this is hard coded for now but its the Date ID property
	});
	return title;
}
export default notion_tasks;
