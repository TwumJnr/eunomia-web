<script lang="ts" setup>
import PageHead from "@/components/widgets/PageHead.vue";
import { useRoute, useRouter } from "vue-router";
import type { Event } from "@/helpers/types/Event";
import type { ElectorialArea } from "@/helpers/types/ElectorialArea";
import type { ElectorialPosition } from "@/helpers/types/ElectorialPosition";
import { onMounted, ref, inject } from "vue";
import { AxiosInstance, AxiosResponse } from "axios";
import type { Ref } from "vue";
import { formatDate } from "@/helpers/functions/date";

const route = useRoute();
const router = useRouter();

const axios = inject<AxiosInstance>("axios");

const eventId = route.query.q;
const selectedPosition: Ref<ElectorialPosition | null> = ref(null);

const loading = ref(false);
const eventDetails: Ref<Event> = ref({ eventName: "", eventDate: "" });
const newArea: Ref<ElectorialArea> = ref({ areaName: "", event: eventDetails });
const newPosition: Ref<ElectorialPosition> = ref({
  positionName: "",
  numberRequired: 1,
  event: eventDetails,
});
const availableAreas: Ref<ElectorialArea[]> = ref([]);

const viewPosition = (position: ElectorialPosition) => {
  selectedPosition.value = position;
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

      <!-- <div class="row mt-4">
        <div class="col-md">
          <router-view />
        </div>
      </div> -->
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
            <div>
              <h6 class="m-0">Position Name:</h6>
              <span style="font-size: 2rem">
                {{ selectedPosition?.positionName }}
              </span>
            </div>
            {{ selectedPosition }}
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
  &:hover {
    background-color: var(--font-color-faded-20);
    cursor: pointer;
    span {
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
