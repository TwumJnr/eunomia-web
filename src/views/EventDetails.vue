<script lang="ts" setup>
import PageHead from "@/components/widgets/PageHead.vue";
import { useRoute, useRouter } from "vue-router";
import type { Event } from "@/helpers/types/Event";
import type { ElectorialArea } from "@/helpers/types/ElectorialArea";
import type { ElectorialPosition } from "@/helpers/types/ElectorialPosition";
import type { Candidate } from "@/helpers/types/Candidate";
import { onMounted, ref, inject, computed } from "vue";
import { AxiosInstance, AxiosResponse } from "axios";
import type { Ref } from "vue";
import { formatDate } from "@/helpers/functions/date";
import { getUserName } from "@/helpers/functions/general";
import { getNumberWords } from "@/helpers/functions/formatNumber";

const route = useRoute();
const router = useRouter();

const axios = inject<AxiosInstance>("axios");

const eventId = route.query.q;
const selectedPosition: Ref<ElectorialPosition | null> = ref(null);

const loading = ref(false);
const availableAreas: Ref<ElectorialArea[]> = ref([]);
const tempAreas: Ref<ElectorialArea[]> = ref([]);
const eventDetails: Ref<Event> = ref({ eventName: "", eventDate: "" });
const newCandidate: Ref<Candidate> = ref({
  firstName: "",
  lastName: "",
  otherName: "",
  gender: "",
});
const selectedArea: Ref<ElectorialArea> = ref({
  areaName: "",
  event: eventDetails.value,
});
const newArea: Ref<ElectorialArea> = ref({
  areaName: "",
  event: eventDetails.value,
});
const newPosition: Ref<ElectorialPosition> = ref({
  positionName: "",
  numberRequired: 1,
  event: eventDetails.value,
});

const addCandidate = () => {
  loading.value = true;

  const postBody = {
    ...newCandidate.value,
    electorialArea: selectedArea.value.id,
    event: eventId,
    electorialPosition: selectedPosition.value?.id,
  };

  axios!
    .post("/v1/candidates/add", postBody)
    .then((response) => {
      document.getElementById("addCandidateModalClose")?.click();
      newCandidate.value = {
        firstName: "",
        lastName: "",
        otherName: "",
        gender: "",
      };
      const data = response.data;
      selectedArea.value.candidates?.push(data);
    })
    .catch((error) => {
      console.log({ error });
    })
    .finally(() => {
      loading.value = false;
    });
};

const selectArea = (area: ElectorialArea) => {
  selectedArea.value = area;
};

const filteredAreas = computed(() => {
  return availableAreas.value.filter(
    (area) => !tempAreas.value.some((tempArea) => tempArea.id === area.id)
  );
});

const removeAreaFromTemp = (areaToRemove: ElectorialArea) => {
  const areaIndex = tempAreas.value.findIndex(
    (area) => area.id === areaToRemove.id
  );

  if (areaIndex !== -1) {
    tempAreas.value.splice(areaIndex, 1);
  }
};

const applyAreaAssignment = () => {
  loading.value = true;

  const params = { id: selectedPosition.value?.id };
  axios!
    .put(
      "/v1/electorial-position/modify",
      { ...selectedPosition.value, areas: tempAreas.value },
      { params }
    )
    .then((response) => {
      const data = response.data;
      // console.log({ data });
      selectedPosition.value = data;
      document.getElementById("assignLocationModalClose")?.click();
    })
    .catch((error) => {
      console.log({ error });
    })
    .finally(() => {
      loading.value = false;
    });
};

const viewPosition = (position: ElectorialPosition) => {
  selectedPosition.value = position;
  if (position.areas) {
    tempAreas.value = [...position.areas];
    selectedArea.value = tempAreas.value[0];
  } else tempAreas.value = [];
};

const getEventDetails = () => {
  loading.value = true;

  const params = { id: eventId };
  axios!
    .get("/v1/events/details", { params })
    .then((response: AxiosResponse) => {
      const data = response.data;
      eventDetails.value = data.data;
      const areas = eventDetails.value.participatingAreas;
      if (areas) availableAreas.value = areas;
    })
    .catch((error) => {
      console.log({ error });
    })
    .finally(() => {
      loading.value = false;
    });
};

const addArea = () => {
  loading.value = true;

  axios!
    .post("/v1/electorial-area/add", { ...newArea.value, event: eventId })
    .then(() => {
      document.getElementById("newAreaModalClose")?.click();
      newArea.value = { areaName: "", event: eventDetails.value };
      // const data = response.data;
      // console.log({ data });
      getEventDetails();
    })
    .catch((error) => {
      console.log({ error });
      loading.value = false;
    });
};

const addPosition = () => {
  loading.value = true;

  axios!
    .post("/v1/electorial-position/add", {
      ...newPosition.value,
      event: eventId,
    })
    .then(() => {
      document.getElementById("newPositionModalClose")?.click();
      // const data = response.data;
      // console.log({ data });
      getEventDetails();
    })
    .catch((error) => {
      console.log({ error });
      loading.value = false;
    });
};

onMounted(() => {
  if (!eventId) return router.push("/");
  getEventDetails();
});
</script>

<template>
  <div id="event-details-view">
    <div class="container" style="padding-top: 8rem">
      <PageHead text="Event Details" />

      <div class="d-flex">
        <div class="my-4">
          <h1 class="display-4 m-0">{{ eventDetails.eventName }}</h1>
          <strong>{{ formatDate(eventDetails.eventDate) }}</strong>
        </div>
        <v-overlay
          v-model="loading"
          contained
          class="align-center justify-center"
        >
          <v-progress-circular color="primary" indeterminate size="64" />
        </v-overlay>
      </div>

      <div class="row">
        <div class="col-md">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="m-0">Electorial Positions</h5>
                <button
                  class="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#newPositionModal"
                  :disabled="loading"
                >
                  <div class="d-flex align-items-center">
                    <span class="material-symbols-rounded"> add_circle </span>
                  </div>
                </button>
              </div>
              <div
                class="entry"
                @click="viewPosition(position)"
                data-bs-toggle="modal"
                data-bs-target="#positionDetailsModal"
                :disabled="loading"
                v-for="(position, i) in eventDetails.positions"
                :key="i"
              >
                <span class="count">{{ i + 1 }}</span>
                <span class="label">{{ position.positionName }}</span>
              </div>
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
        <div class="col-md">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="m-0">Electorial Areas involved</h5>
                <button
                  class="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#newAreaModal"
                  :disabled="loading"
                >
                  <div class="d-flex align-items-center">
                    <span class="material-symbols-rounded"> add_circle </span>
                  </div>
                </button>
              </div>
              <div
                class="entry"
                v-for="(area, i) in eventDetails.participatingAreas"
                :key="i"
              >
                <span class="count">{{ i + 1 }}</span>
                <span class="label">{{ area.areaName }}</span>
              </div>
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

    <!--  Add candidate Modal -->
    <div
      class="modal fade"
      id="addCandidateModal"
      aria-labelledby="addCandidateModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="addCandidateModalLabel">
              New Candidate for {{ selectedPosition?.positionName }} in
              {{ selectedArea.areaName }}
            </h1>
            <button
              type="button"
              class="btn-close"
              id="addCandidateModalClose"
              data-bs-toggle="modal"
              data-bs-target="#positionDetailsModal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCandidate">
              <div class="row">
                <div class="col-md">
                  <div class="form-floating">
                    <input
                      class="form-control"
                      id="firstNameField"
                      v-model="newCandidate.firstName"
                      placeholder="Firstname"
                      required
                    />
                    <label for="firstNameField">Firstname</label>
                  </div>
                </div>
                <div class="col-md">
                  <div class="form-floating">
                    <input
                      class="form-control"
                      id="otherNameField"
                      v-model="newCandidate.otherName"
                      placeholder="Othername"
                    />
                    <label for="otherNameField">Othername</label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md">
                  <div class="form-floating">
                    <input
                      class="form-control"
                      id="lastNameField"
                      v-model="newCandidate.lastName"
                      placeholder="lastName"
                      required
                    />
                    <label for="lastNameField">Lastname</label>
                  </div>
                </div>
                <div class="col-md">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="genderField"
                      aria-label="Floating label select example"
                    >
                      <option selected disabled>-- Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <label for="genderField">Gender</label>
                  </div>
                </div>
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
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!--  Assign Area Modal -->
    <div
      class="modal fade"
      id="assignLocationModal"
      aria-labelledby="assignLocationModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="assignLocationModalLabel">
              Apply Electorial Area
            </h1>
            <button
              type="button"
              class="btn-close"
              id="assignLocationModalClose"
              data-bs-toggle="modal"
              data-bs-target="#positionDetailsModal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body">
            <div class="d-flex mb-2">
              <button
                class="btn btn-outline-primary btn-sm mr-1"
                style="border-radius: 50rem"
                @click="removeAreaFromTemp(area)"
                v-for="(area, i) in tempAreas"
                :key="i"
              >
                <div class="d-flex align-items-center justify-content-between">
                  <span class="mr-2">
                    {{ area.areaName }}
                  </span>
                  <span class="material-symbols-rounded"> close </span>
                </div>
              </button>
            </div>
            <div
              class="entry"
              v-for="(area, i) in filteredAreas"
              :key="i"
              @click="tempAreas.push(area)"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="count">{{ i + 1 }}</span>
                  <span class="label" style="font-size: 1.5rem">
                    {{ area.areaName }}
                  </span>
                </div>
                <span class="material-symbols-rounded"> add_circle </span>
              </div>
            </div>

            <div
              class="alert alert-warning m-0 mt-4"
              role="alert"
              v-if="filteredAreas.length === 0"
            >
              There are no Electorial Areas available
            </div>

            <div class="d-grid gap-2 mt-4">
              <button
                class="btn btn-primary"
                style="
                  color: var(--white);
                  font-weight: bolder;
                  box-shadow: var(--shadow);
                "
                @click="applyAreaAssignment"
                :disabled="tempAreas.length === 0 || loading"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--  Position Details Modal -->
    <div
      class="modal fade"
      id="positionDetailsModal"
      aria-labelledby="positionDetailsModalLabel"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="positionDetailsModalLabel">
              Electorial Position Details
            </h1>
            <button
              type="button"
              class="btn-close"
              id="positionDetailsModalClose"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md">
                <h6 class="m-0">Position Name:</h6>
                <span style="font-size: 2rem; font-weight: lighter">
                  {{ selectedPosition?.positionName }}
                </span>
              </div>
              <div class="col-md">
                <h6 class="m-0">Number of slots:</h6>
                <span style="font-size: 2rem; font-weight: lighter">
                  {{ getNumberWords(selectedPosition?.numberRequired) }}
                  ({{ selectedPosition?.numberRequired }})
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-md">
                <div class="card">
                  <div class="card-body">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <h6 class="m-0">Electorial Areas</h6>
                      <button
                        class="btn"
                        data-bs-toggle="modal"
                        data-bs-target="#assignLocationModal"
                      >
                        <div class="d-flex align-items-center">
                          <span class="material-symbols-rounded">
                            add_circle
                          </span>
                        </div>
                      </button>
                    </div>
                    <div
                      class="mt-4"
                      v-if="
                        selectedPosition?.areas &&
                        selectedPosition.areas?.length > 0
                      "
                    >
                      <div
                        class="entry"
                        v-for="(area, i) in selectedPosition.areas"
                        :key="i"
                        :class="{ active: selectedArea.id === area.id }"
                        @click="selectArea(area)"
                      >
                        <span class="count">{{ i + 1 }}</span>
                        <span class="label">{{ area.areaName }}</span>
                      </div>
                    </div>
                    <div
                      class="alert alert-warning m-0 mt-4"
                      role="alert"
                      v-else
                    >
                      There are no Electorial Areas assigned to this position
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md">
                <div class="d-flex align-items-center" style="height: 100%">
                  <div class="card" style="width: 100%">
                    <div class="card-body">
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <h6>Candidates For {{ selectedArea.areaName }}</h6>
                        <button
                          class="btn"
                          data-bs-toggle="modal"
                          data-bs-target="#addCandidateModal"
                        >
                          <div class="d-flex align-items-center">
                            <span class="material-symbols-rounded">
                              add_circle
                            </span>
                          </div>
                        </button>
                      </div>
                      <div
                        class="mt-4"
                        v-if="
                          selectedArea.candidates &&
                          selectedArea.candidates?.length > 0
                        "
                      >
                        <div
                          class="entry"
                          v-for="(candidate, i) in selectedArea.candidates"
                          :key="i"
                        >
                          <span class="count">{{ i + 1 }}</span>
                          <span class="label">{{
                            getUserName({
                              firstName: candidate.firstName,
                              otherName: candidate.otherName,
                              lastName: candidate.lastName,
                            })
                          }}</span>
                        </div>
                      </div>
                      <div
                        class="alert alert-warning m-0 mt-4"
                        role="alert"
                        v-else
                      >
                        There are no Candidates for the selected area
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Position Modal -->
    <div
      class="modal fade"
      id="newPositionModal"
      aria-labelledby="newPositionModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="newPositionModalLabel">
              Add Participating Position
            </h1>
            <button
              type="button"
              class="btn-close"
              id="newPositionModalClose"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body">
            <form @submit.prevent="addPosition">
              <div class="form-floating">
                <input
                  class="form-control"
                  id="positionNameField"
                  v-model="newPosition.positionName"
                  placeholder="What is the name of the electorial position?"
                  required
                />
                <label for="positionNameField">Position Name</label>
              </div>
              <div class="form-floating">
                <input
                  class="form-control"
                  id="numberRequiredField"
                  type="number"
                  v-model="newPosition.numberRequired"
                  placeholder="How many candidates are required to fill position?"
                  required
                />
                <label for="numberRequiredField">Number of Slots</label>
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
                  Add Position
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- New Area Modal -->
    <div
      class="modal fade"
      id="newAreaModal"
      aria-labelledby="newAreaModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="newAreaModalLabel">
              Add Participating Area
            </h1>
            <button
              type="button"
              class="btn-close"
              id="newAreaModalClose"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body">
            <form @submit.prevent="addArea">
              <div class="form-floating">
                <input
                  class="form-control"
                  id="areaNameField"
                  v-model="newArea.areaName"
                  placeholder="What is the name of the electorial area?"
                  required
                />
                <label for="areaNameField">Area Name</label>
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
                  Add Electorial Area
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
.entry {
  padding: 0.5rem;
  transition: var(--transition);
  // *{
  //   &:hover{
  //     cursor: pointer;
  //   }
  // }
  &.active {
    background-color: var(--blue-30);
  }
  &:hover {
    background-color: var(--blue-20);
    cursor: pointer;
    * {
      cursor: pointer;
    }
  }
  .count {
    font-size: 0.6rem;
    font-weight: bolder;
    margin-right: 0.5rem;
  }
}
</style>
