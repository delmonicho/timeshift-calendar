<script> //This template page is the container for the calendar </script>
<template>
  <div class="page">
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
var idCount = 0;
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
      input: ''
    };
  },
  async beforeMount() {
    await this.getEvents();
  },
  methods: {
    async getEvents() {
      const response = await this.getCalendar();
      this.$store.commit("setEvents", response.data);
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
        // let id = this.index;
        // let title = this.input;
        // let start = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");
        // let end = moment(currentDate.setHours(currentDate.getHours() + 2)).format("YYYY-MM-DD HH:mm:ss");
        // this.calendarEvent = { id, start, end, title };
        // await this.addCalendar(this.calendarEvent);
    },
    async remove() {

        //reverse list order to pop off first item in list
        this.todos.reverse();
        //save event to db.json
        //store event in available space in calendar

        const task = this.todos.pop();
        let id = task.index;
        let start = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");
        let end = moment(currentDate.setHours(currentDate.getHours() + task[1])).format("YYYY-MM-DD HH:mm:ss");
        let title = task[0];
        console.log(id,start,end,title);
        this.calendarEvent = { id, start, end, title };
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
