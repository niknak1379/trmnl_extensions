import { Client } from "@notionhq/client";

/*   returns a json with three objects, each a list of objects
     with the following format

    {
        lists: {todoList:   [{
            dueDate: null,
            priority: null,
            title: 'Update hjkl for mac aerospace'
        }   
        ],      
        progList: inprogress_tasks_array,
        doneList: done_tasks_array
        }
    }
    
  */
export async function notion_tasks() {
  const notion = new Client({ auth: process.env.INTERNAL_INTEGRATION_SECRET });
  const dataSourceId = process.env.NOTION_DATASOURCE_ID;
  let todo_tasks_array = [];
  let inprogress_tasks_array = [];
  let done_tasks_array = [];
  let statusDict = [
    { status: "To-Do", array: todo_tasks_array },
    { status: "In Progress", array: inprogress_tasks_array },
    { status: "Done", array: done_tasks_array },
  ];
  // create pageID list
  for (let item of statusDict) {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          {
            property: "Status",
            status: {
              equals: item.status,
            },
          },
        ],
      },
      sort: [
        {
          property: "dueDate",
          direction: "ascending",
        },
      ],
    });
    //console.log(response);
    for (let page of response.results) {
      const pageData = await notion.pages.retrieve({ page_id: page.id });
      // process date object
      let date;
      if (pageData.properties["Due Date"].date != null) {
        date = new Date(pageData.properties["Due Date"].date?.start);
        date = `${date.getDate()}/${date.getMonth() + 1}`;
      } else {
        date = null;
      }

      item.array.push({
        dueDate: date,
        priority: pageData.properties.Priority.select?.name,
        title: pageData.properties["Task Name"].title[0].plain_text,
      });
    }
    console.log("logging processed array", item.status, "\n", item.array);
  }
  return {
    lists: [
      { status: "To Do", list: todo_tasks_array },
      { status: "In Progress", list: inprogress_tasks_array },
      { status: "Done", list: done_tasks_array },
    ],
  };
}
export default notion_tasks;
/**
 * 
 * {
  object: 'data_source',
  id: '2b4269f7-2b21-8123-9dd0-000bdddf3adf',
  cover: null,
  icon: {
    type: 'external',
    external: { url: 'https://www.notion.so/icons/notion_red.svg' }
  },
  created_time: '2025-11-23T21:10:00.000Z',
  created_by: { object: 'user', id: '155b14e0-922a-4b1a-be25-3363d7bc4594' },
  last_edited_by: { object: 'user', id: '155b14e0-922a-4b1a-be25-3363d7bc4594' },
  last_edited_time: '2025-12-03T22:43:00.000Z',
  title: [
    {
      type: 'text',
      text: [Object],
      annotations: [Object],
      plain_text: 'Task Management',
      href: null
    }
  ],
  description: [],
  is_inline: true,
  properties: {
    Category: {
      id: 'CCXf',
      name: 'Category',
      description: null,
      type: 'select',
      select: [Object]
    },
    'Due Date': {
      id: 'G%5Db%3B',
      name: 'Due Date',
      description: null,
      type: 'date',
      date: {}
    },
    'Notes & Details': {
      id: 'TAMK',
      name: 'Notes & Details',
      description: null,
      type: 'rich_text',
      rich_text: {}
    },
    Priority: {
      id: 'ZGmH',
      name: 'Priority',
      description: null,
      type: 'select',
      select: [Object]
    },
    'Assigned To': {
      id: 'aJd%5C',
      name: 'Assigned To',
      description: null,
      type: 'people',
      people: {}
    },
    Status: {
      id: 'blD%7D',
      name: 'Status',
      description: null,
      type: 'status',
      status: [Object]
    },
    'Task Name': {
      id: 'title',
      name: 'Task Name',
      description: null,
      type: 'title',
      title: {}
    }
  },
  parent: {
    type: 'database_id',
    database_id: '2b4269f7-2b21-81e2-a10c-dc9bbb74fcce'
  },
  database_parent: { type: 'page_id', page_id: '2b4269f7-2b21-80ba-b647-ea373eac964a' },
  url: 'https://www.notion.so/2b4269f72b2181e2a10cdc9bbb74fcce',
  public_url: null,
  archived: false,
  in_trash: false,
  request_id: '8af101e6-f5ca-4791-81f0-1799233707dc'
}
 */
