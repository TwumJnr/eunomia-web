<script lang="ts" setup>
import PageHead from "@/components/widgets/PageHead.vue"; // @ is an alias to /src
import { formatWholeNumber } from "@/helpers/functions/formatNumber";
import type { Event } from "@/helpers/types/Event";
import { onMounted, ref, inject } from "vue";
import { AxiosInstance } from "axios";
import type { Ref } from "vue";
import { formatDate } from "@/helpers/functions/date";
import { useRouter } from "vue-router";
import { getUserToken } from "@/helpers/functions/general";

const headers = {
  Authorization: `Bearer ${getUserToken()}`,
};

const axios = inject<AxiosInstance>("axios");

const router = useRouter();
const loading = ref(false);
const allEvents: Ref<Event[]> = ref([]);
const totalEvents = ref(0);
const newEvent: Ref<Event> = ref({ eventName: "", eventDate: "" });

const viewEventDetails = (event: Event) => {
  router.push({ path: "/event", query: { q: event.id } });
};

const getAllEvents = () => {
  loading.value = true;

  axios!
    .get("/v1/events", { headers })
    .then((response) => {
      const data = response.data;
      // console.log({ data });
      allEvents.value = data.data;
      totalEvents.value = data.count;
    })
    .catch((error) => {
      console.log({ error });
    })
    .finally(() => {
      loading.value = false;
    });
};

const addEvent = () => {
  loading.value = true;

  axios!
    .post("/v1/events/add", newEvent.value, { headers })
    .then(() => {
      document.getElementById("newEventModalClose")?.click();
      // const data = response.data;
      // console.log({ data });
      getAllEvents();
    })
    .catch((error) => {
      console.log({ error });
      loading.value = false;
    });
};

onMounted(() => {
  getAllEvents();
});
</script>

<template>
  <div id="home-view">
    <div class="container" style="padding-top: 8rem">
      <PageHead text="Dashboard" />

      <div class="d-flex justify-content-end">
        <button
          class="btn btn-outline-warning"
          data-bs-toggle="modal"
          data-bs-target="#newEventModal"
          :disabled="loading"
        >
          Add Event
        </button>
      </div>

      <div class="row">
        <div class="col-md">
          <div class="card">
            <div class="card-body">
              <h5>All Events - {{ formatWholeNumber(totalEvents) }}</h5>
              <v-table fixed-header>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Event Name</th>
                    <th>Event Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(event, i) in allEvents"
                    :key="i"
                    @click="viewEventDetails(event)"
                    class="table-record"
                  >
                    <td>{{ i + 1 }}</td>
                    <td>{{ event.eventName }}</td>
                    <td>{{ formatDate(event.eventDate) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
            <v-overlay
              v-model="loading"
              contained
              class="align-center justify-center"
            >
              <v-progress-circular color="primary" indeterminate size="64" />
            </v-overlay>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="newEventModal"
      aria-labelledby="newEventModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="newEventModalLabel">Add Event</h1>
            <button
              type="button"
              class="btn-close"
              id="newEventModalClose"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body">
            <form @submit.prevent="addEvent">
              <div class="form-floating">
                <input
                  class="form-control"
                  id="eventNameField"
                  v-model="newEvent.eventName"
                  placeholder="What is the name of the event?"
                  required
                />
                <label for="eventNameField">Event Name</label>
              </div>
              <div class="form-floating">
                <input
                  type="date"
                  class="form-control"
                  id="eventDateField"
                  v-model="newEvent.eventDate"
                  placeholder="When is the event?"
                  required
                />
                <label for="eventDateField">Event Date</label>
              </div>
              <div class="d-grid mt-6">
                <button
                  class="btn btn-primary"
                  style="
                    color: var(--white);
                    font-weight: bolder;
                    box-shadow: var(--shadow);
                  "
                  type="submit"
                  :disabled="loading"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-record {
  transition: var(--transition);
  cursor: default;
  &:hover {
    background-color: var(--font-color-faded-20);
    cursor: pointer;
  }
}
</style>
