const APIURL = "";
const axios = require("axios");

var entry = {
  "blocks":
  {
    "lt_id": "exampleid",
    "title": "title",
    "start": "start",
    "end": "end",
    "uids": "user"
  },
  "events":
  {
    "id": "exampleid",
    "title": "title",
    "start": "start",
    "end": "end",
    "uid": "user",
    "lists": ["listid1","listid2"],
    "recurring": "daily"
  },
  "lists":
  {
    "name": "charlie",
    "color": "#ffffff",
    "tasks": ["Finish sprint cycle IV"],
    "list_id": "exampleID",
    "shared_users": ["charlie","murphy"],
    "uids": "user_id1"
  },
  "tasks":
  {
    "name": "rice",
    "due": {"date": "2019-23-19", "time": "T13:34:00.000"},
    "est": 3000,
    "alg": 4500, //dont store in dB but just store user specified data
    "aid": "exampleAID",
    "uids": "user_id1",
    "lists": ["listid1","listid2"],
    "recurring": "weekly"
  },
  "users":
  {
    "first_name": "John",
    "last_name": "Delaney",
    "email": "inMuskWeTusk@elon.com",
    "uid": "user_id1",
    "listPositions": ["listid2","listid1"]
  }
}

export const requestsMixin = {
  methods: {
    getCalendar() {
      return axios.get(`${APIURL}/entries`);
    },
    addCalendar(data) {
      //when posting to calendar, can include all endpoints here
      //instead of posting data (the 5 variables used by the calendar), post the who request body
      let { start, end, title } = data;
      entry.blocks.title = title;
      entry.blocks.start = start;
      entry.blocks.end = end;

      return axios.post(`${APIURL}/entries`, entry);
    },
    editCalendar(data) {
      console.log("editCalendar(data): data = ");
      console.log(data);
      let { start, end, title, id} = data;
      entry.blocks.title = title;
      entry.blocks.start = start;
      entry.blocks.end = end;
      entry.id = id;
      return axios.put(`${APIURL}/entries/${entry.id}`, entry);
    },
    deleteCalendar(id) {
      return axios.delete(`${APIURL}/entries/${id}`);
    }
  }
};
