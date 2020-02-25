<script> //This template page is the container for the calendar </script>
<!-- MAKE SURE connected to mongoDB for next demo -->
<!-- fix endpoints to all data in the dB -->
<template>
  <div class="page">
    <div class="titles" style="text-align: center">
      <h1>TIMESHIFT</h1>
      <h3>Scheduling Optimization at its finest</h3>
    </div>
    <div style="width: 100%;  padding: 80px 20px 40px 40px; text-align: center;">
          <div class="row">
              <div class="col-md-6">
                  <div class="well">
                      <h2>Create a New Task</h2>
                      <form>
                          <div class="form-group">
                              <label for="todoitem">Task Item</label>
                              <input type="text" v-model="input" class="form-control" id="todoitem" placeholder="enter task" />
                              <input type="number" v-model.number="hours" class="form-control" id="todohours" placeholder="enter hours to complete task" />
                          </div>
                          <b-button type="button" v-on:click="add()" class="btn btn-default" >Create</b-button>
                      </form>
                  </div>
              </div>
              <div class="col-md-6">
                  <h2>Tasks List</h2>
                  <ul class="list-group">
                      <li v-for="(todo, index) in todos" :key="index" class="list-group-item">
                          {{ index }}: {{ todo[0] }} - {{ todo[1] }} hours
                      </li>
                  </ul>
                  <b-button type="button" v-on:click="remove()">Fill Calendar</b-button>
              </div>
          </div>
    </div>
    <div style="width: 100%; padding: 0px 20px 40px 40px; text-align:center;">
      <div class="buttons">
        <b-button v-b-modal.add-modal>Add Calendar Event</b-button>
      </div>
      <full-calendar :events="events" @event-selected="openEditModal" defaultView="agendaDay" />
        <b-modal id="add-modal" title="Add Calendar Event" hide-footer ref="add-modal">
          <CalendarForm :edit="false" @eventSaved="closeModal()" ref="add-event"/>
        </b-modal>
        <b-modal id="edit-modal" title="Edit Calendar Event" hide-footer ref="edit-modal">
          <CalendarForm :edit="true" :calendarEvent="calendarEvent" @eventSaved="closeModal()" />
        </b-modal>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import CalendarForm from "@/components/CalendarForm.vue";
import { requestsMixin } from "../mixins/requestsMixin";
import * as moment from "moment";
var currentDate = new Date();
export default {
  name: "home",
  components: {
    CalendarForm
  },
  mixins: [requestsMixin],
  computed: {
    events() {
      return this.$store.state.events;
    }
  },
  data() {
    return {
      calendarEvent: {},
      todos: [],
      input: '',
      hours:''
    };
  },
  async beforeMount() {
    await this.getEvents();
  },
  methods: {
    async getEvents() {
      const response = await this.getCalendar();
      //Vuex store is expecting events to look like original tutorial version
      // so the response.data before would look like
      /*
      {
        "calendar": [
          {
            "id": 1,
            "start": "2019-12-19 06:02:46",
            "end": "2019-12-19 09:02:46",
            "title": "Grade late assignments"
          },
          {
            "start": this.$store.state.events[17].blocks.start,
            "end": this.$store.state.events[17].blocks.end,
            "title": this.$store.state.events[17].blocks.title,
            "id": this.$store.state.events[17]._id
          }
      }
      */
      //res_data is the reformatted json body to store calendar aray of events for Vuex store
      //TODO: parse through response.data to save start,end,title, and id in a calendar array for each item i in response.data

      const res_data = {
        "calendar": []
      }
      //console.log(response.data.length);
      var obs;
      for (obs in response.data) {
        //console.log(obs + ' ' + response.data[obs]._id);
        res_data.calendar[obs] = {
          "start": response.data[obs].blocks.start,
          "end": response.data[obs].blocks.end,
          "title": response.data[obs].blocks.title,
          "id": response.data[obs]._id
        }
      }
      var ev;
      for (ev in this.$store.events) {
        console.log('ev' + ev);
      }
      this.$store.commit("setEvents", res_data);
      console.log(res_data.calendar);
    },
    closeModal() {
      this.$refs["add-modal"].hide();
      this.$refs["edit-modal"].hide();
      this.calendarEvent = {};
    },
    openEditModal(event) {
      let { id, start, end, title } = event;
      this.calendarEvent = { id, start, end, title };
      this.$refs["edit-modal"].show();
    },
    async add() {
        this.todos.push([this.input,this.hours]);
    },
    async remove() {

        //reverse list order to pop off first item in list
        this.todos.reverse();
        //save event to db.json
        //store event in available space in calendar

        const task = this.todos.pop();
        //let id = task.index;
        let start = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");
        let end = moment(currentDate.setHours(currentDate.getHours() + task[1])).format("YYYY-MM-DD HH:mm:ss");
        let title = task[0];
        let event = {
        	"blocks":
        	{
        		"lt_id": "exampleid",
        		"title": title,
        		"start": start,
        		"end": end,
        		"uids": "user"
        	},
        	"events":
        	{
        		"id": "exampleid",
        		"title": title,
        		"start": start,
        		"end": end,
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
        		"name": "id",
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
        		"first_name": "Elon",
        		"last_name": "Tusk",
        		"email": "inMuskWeTusk@elon.com",
        		"uid": "user_id1",
        		"listPositions": ["listid2","listid1"]
        	}
        }
        console.log(start,end,title);
        this.calendarEvent = { start, end, title };
        await this.addCalendar(this.calendarEvent);


        //reverse back to maintain order
        this.todos.reverse();
    }
  }
};
</script>
<style lang="scss" scoped>
.buttons {
  margin-bottom: 10px;
}
h2 {
  margin-left: 40;
  margin-top: 0px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
button {
  color: #42b983;
  background-color: #add8e6;
}
</style>
