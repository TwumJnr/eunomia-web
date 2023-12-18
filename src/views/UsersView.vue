<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { AxiosInstance } from "axios";
import type { Ref } from "vue";
import type { User } from "@/helpers/types/Users";
import { dateTime, formatDateMin } from "@/helpers/functions/date";
import { Event } from "@/helpers/types/Event";
import { ElectorialArea } from "@/helpers/types/ElectorialArea";
import { PollingCenter } from "@/helpers/types/PollingCenter";

const axios = inject<AxiosInstance>("axios");

const loading = ref(false);
const users: Ref<User[]> = ref([]);
const events: Ref<Event[]> = ref([]);
const electorialAreas: Ref<ElectorialArea[]> = ref([]);
const pollingCenters: Ref<PollingCenter[]> = ref([]);
const headers = [
  { key: "name", value: "Name", sortable: true, class: "" },
  { key: "email", value: "Email Address", sortable: true, class: "" },
  { key: "createdAt", value: "Date Created", sortable: true, class: "" },
  { key: "status", value: "Status", sortable: true, class: "" },
];

const roles = ["FieldOfficer", "Supervisor", "Admin", "Super"];
const genders = ["Female", "Male"];

const newUser: Ref<User> = ref({
  firstName: "",
  lastName: "",
  otherName: "",
  address: "",
  role: "Admin",
  gender: "",
  phone: "",
  reset: true,
  status: true,
  username: "",
  email: "",
  host: window.origin,
  createdBy: "Sys",
});

const addUser = () => {
  loading.value = true;
  const postBody = { ...newUser.value };
  axios!
    .post(`/v1/users/add`, postBody)
    .then((response) => {
      console.log({ response });
      // @ts-ignore
      newUser.value = {
        firstName: "",
        lastName: "",
        otherName: "",
        address: "",
        role: "Admin",
        gender: "",
        phone: "",
        reset: true,
        status: true,
        username: "",
        email: "",
        host: window.origin,
        createdBy: "Sys",
      };
      document.getElementById("newUserModalClose")?.click();
      getUsers();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const setArea = () => {
  const event = newUser.value.politicalEvent;

  if (!event || !event.participatingAreas) return (electorialAreas.value = []);

  electorialAreas.value = event.participatingAreas;
  newUser.value.electorialArea = undefined;
  setCenters();
};

const setCenters = () => {
  const area = newUser.value.electorialArea;

  if (!area || !area.centers) return (pollingCenters.value = []);

  pollingCenters.value = area.centers;
  newUser.value.pollingCenter = undefined;
};

const getEvents = () => {
  loading.value = true;

  axios!
    .get("/v1/events/set")
    .then((response) => {
      const data: Event[] = response.data.data;
      // console.log({ data });
      events.value = data;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const getUsers = () => {
  loading.value = true;

  axios!
    .get(`/v1/users`)
    .then((response) => {
      const data: User[] = response.data.data;
      // console.log({ data });
      users.value = data;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  getUsers();
  getEvents();
});
</script>

<template>
  <div id="users-view">
    <div class="container" style="padding-top: 8rem">
      <div class="d-flex align-items-center justify-content-between">
        <h1>Users</h1>
        <button
          type="button"
          class="btn"
          data-bs-toggle="modal"
          data-bs-target="#newUserModal"
        >
          <div class="d-flex align-items-center">
            <span class="material-symbols-rounded"> person_add </span>
            <span class="ml-1">Add User</span>
          </div>
        </button>
      </div>
      <div class="row">
        <div class="col-md">
          <div class="card">
            <div class="card-body">
              <v-table fixed-header>
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-left" v-for="(head, i) in headers" :key="i">
                      {{ head.value }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in users" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ dateTime(item.createdAt) }}</td>
                    <td>
                      <span
                        class="material-symbols-rounded"
                        :class="{
                          'text-danger': !item.auth?.status,
                          'text-success': item.auth?.status,
                        }"
                      >
                        circle
                      </span>
                    </td>
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

    <!-- new user modal -->
    <div
      class="modal fade"
      id="newUserModal"
      aria-labelledby="newUserModalLabel"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="newUserModalLabel">
              Add New User
            </h1>
            <button
              type="button"
              id="newUserModalClose"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body">
            <form @submit.prevent="addUser()">
              <div class="row">
                <div class="col-md">
                  <div class="form-floating">
                    <input
                      class="form-control"
                      id="firstnameInput"
                      placeholder="Firstname"
                      v-model="newUser.firstName"
                      required
                      trim
                    />
                    <label for="firstnameInput">
                      <span>Firstname</span>
                      <span style="color: red">*</span>
                    </label>
                  </div>
                </div>
                <div class="col-md">
                  <div class="form-floating">
                    <input
                      class="form-control"
                      id="othernameInput"
                      placeholder="Othername"
                      v-model="newUser.otherName"
                      trim
                    />
                    <label for="othernameInput">
                      <span>Othername</span>
                    </label>
                  </div>
                </div>
                <div class="col-md">
                  <div class="form-floating">
                    <input
                      class="form-control"
                      id="lastnameInput"
                      placeholder="Lastname"
                      v-model="newUser.lastName"
                      required
                      trim
                    />
                    <label for="lastnameInput">
                      <span>Lastname</span>

                      <span style="color: red">*</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-md">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="genderInput"
                      v-model="newUser.gender"
                      required
                    >
                      <option
                        v-for="(type, i) in genders"
                        :key="i"
                        :value="type"
                      >
                        {{ type }}
                      </option>
                    </select>
                    <label for="genderInput">
                      <span>Gender </span>
                      <span style="color: red">*</span>
                    </label>
                  </div>
                </div>
                <div class="col-md">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="responsibilityInput"
                      v-model="newUser.role"
                      required
                    >
                      <option v-for="(type, i) in roles" :key="i" :value="type">
                        {{ type }}
                      </option>
                    </select>
                    <label for="responsibilityInput">
                      <span>Role </span>
                      <span style="color: red">*</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-md">
                  <div class="form-floating">
                    <input
                      class="form-control"
                      type="email"
                      id="emailInput"
                      placeholder="email@example.com"
                      v-model="newUser.email"
                      required
                      trim
                    />
                    <label for="emailInput">
                      <span>Email</span>
                      <span style="color: red">*</span>
                    </label>
                  </div>
                </div>
                <div class="col-md">
                  <div class="form-floating">
                    <input
                      class="form-control"
                      type="tel"
                      id="phoneInput"
                      placeholder="Phone Number"
                      v-model="newUser.phone"
                      required
                      trim
                    />
                    <label for="phoneInput">
                      <span>Phone</span>
                      <span style="color: red">*</span>
                    </label>
                  </div>
                </div>
              </div>
              <div
                class="row mt-2"
                v-if="
                  newUser.role === 'FieldOfficer' ||
                  newUser.role === 'Supervisor'
                "
              >
                <div class="col-md">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="politicalEventField"
                      v-model="newUser.politicalEvent"
                      @change="setArea"
                      required
                    >
                      <option
                        v-for="(type, i) in events"
                        :key="i"
                        :value="type"
                      >
                        {{ type.eventName }}
                        ({{ formatDateMin(type.eventDate) }})
                      </option>
                    </select>
                    <label for="politicalEventField">
                      <span>Event </span>
                      <span style="color: red">*</span>
                    </label>
                  </div>
                </div>
                <div class="col-md">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="electorialAreaField"
                      v-model="newUser.electorialArea"
                      @change="setCenters"
                      required
                    >
                      <option
                        v-for="(type, i) in electorialAreas"
                        :key="i"
                        :value="type"
                      >
                        {{ type.areaName }}
                      </option>
                    </select>
                    <label for="electorialAreaField">
                      <span>Electorial Area </span>
                      <span style="color: red">*</span>
                    </label>
                  </div>
                </div>
                <div class="col-md" v-if="newUser.role === 'FieldOfficer'">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="pollingCenterField"
                      v-model="newUser.pollingCenter"
                      required
                    >
                      <option
                        v-for="(type, i) in pollingCenters"
                        :key="i"
                        :value="type"
                      >
                        {{ type.centerName }}
                      </option>
                    </select>
                    <label for="pollingCenterField">
                      <span>Polling Center </span>
                      <span style="color: red">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="d-grid pt-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  style="
                    box-shadow: var(--shadow);
                    color: var(--white);
                    font-weight: bolder;
                  "
                  :disabled="loading"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
