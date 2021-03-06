// Libraries
import FlightsDispatcher from "../../../../dispatchers/FlightsDispatcher";
import React, { Component } from "react";
import Store from "../../../../reducers/Store";
import moment from "moment";

// Components
import ChangeOperationReadout from "../ChangeOperationReadout";
import CreateView from "./CreateView";
import DeleteView from "./DeleteView";
import DropDown from "../../../../components/DropDown";
import EditView from "./EditView";
import ErrorMessage from "../../../../components/ErrorMessage";
import FlexColumn from "../../../../components/FlexColumn";
import FlexRow from "../../../../components/FlexRow";
import ItemsIndexReadout from "../../../../components/ItemsIndexReadout";
import Pagination from "../../../../components/Pagination";

class FlightsDebug extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReferenceIDsActive: false,
      searchTerms: "",
      currentSort: "up",
      sortedItem: "flightId",
    };
  }

  render() {
    const { flights } = Store.getState();
    const { isReferenceIDsActive, searchTerms } = this.state;

    // Microservice Status
    const flightsMSStatus = flights.status;

    // Modal Toggles
    const isCreatePromptActive = flights.create.isActive;
    const isDeletePromptActive = flights.delete.isActive;
    const isEditPromptActive = flights.edit.isActive;

    // Search Results vars
    const searchError = flights.search.error;
    const searchFilters = flights.search.filters;
    const searchResults = flights.search.results;

    return (
      <div
        className={"row" + (this.props.className || "")}
        style={this.props.style}
      >
        {/* Header */}
        <div className="col-12 bg-light kit-border-shadow">
          <div className="row p-2">

            {/* Search Bar */}
            <div className="col-12">
              {/* Search */}
              <FlexRow className="mt-1" justify="end" wrap="no-wrap">
                <input
                  aria-label="Search"
                  className={
                    "form-control " + (searchError && " is-invalid kit-shake")
                  }
                  label={searchError}
                  placeholder='flightid="1"'
                  type="search"
                  style={{ maxWidth: "15rem" }}
                  onChange={(e) =>
                    this.setState({ searchTerms: e.target.value })
                  }
                />
                <button
                  className="btn btn-success ml-2 text-white kit-text-shadow-dark"
                  type="submit"
                  onClick={() =>
                    FlightsDispatcher.onSearchAndFilter(
                      "/search",
                      searchTerms,
                      searchFilters
                    )
                  }
                >
                  search
                </button>
              </FlexRow>
            </div>
          </div>
        </div>

        {/* Search Sorting & Filtering */}
        <div
          className={
            "col-12 bg-light " +
            ((flightsMSStatus === "INACTIVE" ||
              flightsMSStatus === "ERROR" ||
              isCreatePromptActive ||
              isDeletePromptActive ||
              isEditPromptActive) &&
              "kit-opacity-50 kit-no-user kit-pointer-none")
          }
        >

          {/* Resuts Count & Page Selection */}
          <div className="row justify-content-center pb-1">

            {/* Toggle Reference Data */}
            <FlexRow
              className="col-auto p-0 bg-dark rounded mt-2"
              wrap={"no-wrap"}
            >
              <button
                className={
                  "btn text-white " + (isReferenceIDsActive && "btn-success")
                }
                onClick={() => this.handleIncludeReferenceIDs(true)}
              >
                Show IDs
              </button>
              <button
                className={
                  "btn text-white " + (!isReferenceIDsActive && "btn-success")
                }
                onClick={() => this.handleIncludeReferenceIDs(false)}
              >
                Hide
              </button>
            </FlexRow>

            {/* DropDown */}
            <FlexColumn className="col-auto text-center mt-2">
              <DropDown
                buttonClassName="btn-secondary dropdown-toggle"
                selection={flights.search.resultsPerPage}
                options={["3", "10", "25", "50"]}
                optionsName="items"
                onSelect={(e) => FlightsDispatcher.onSelectItemsPerPage(e)}
              />
            </FlexColumn>

            {/* Readout */}
            <FlexColumn className="col-auto text-center mt-2">
              <ItemsIndexReadout
                currentPage={flights.search.resultsPage}
                itemsPerPage={flights.search.resultsPerPage}
                itemsTotal={flights.search.results.length}
              />
            </FlexColumn>

            {/* Pagination */}
            <FlexColumn className="col-auto text-center mt-2">
              <Pagination
                currentPage={flights.search.resultsPage}
                totalPages={Math.ceil(
                  flights.search.results.length /
                    Math.max(flights.search.resultsPerPage, 1)
                )}
                onSelectPage={(e) => FlightsDispatcher.onSelectItemsPage(e)}
              />
            </FlexColumn>
          </div>
        </div>

        {/* Body */}
        <div className="col-12" style={{ overflow: "auto" }}>
          {/* Error State */}
          {flightsMSStatus === "ERROR" && (
            <FlexColumn className="h-100">
              <ErrorMessage className="h1" soundAlert={true}>
                {flightsMSStatus === "HEALTHY"
                  ? flights.error
                  : "No Flight MS connection."}
              </ErrorMessage>
              <button
                className="btn btn-light m-3"
                onClick={() => FlightsDispatcher.onCancel()}
              >
                Back
              </button>
            </FlexColumn>
          )}

          {/* Inactive State */}
          {flightsMSStatus === "INACTIVE" && (
            <FlexColumn style={{ minHeight: "10rem" }}>
              <ChangeOperationReadout
                className="m-1"
                style={{ minHeight: "4rem" }}
                name="Establishing Connection . . ."
                status={"PENDING"}
              />
            </FlexColumn>
          )}

          {/* Pending State */}
          {(flightsMSStatus === "PENDING" ||
            flightsMSStatus === "INACTIVE") && (
            <FlexColumn style={{ minHeight: "10rem" }}>
              <div className="spinner-border" />
            </FlexColumn>
          )}

          {/* Success State */}
          {flightsMSStatus === "SUCCESS" &&
            !isCreatePromptActive &&
            !isDeletePromptActive &&
            !isEditPromptActive &&
            this.handleRenderFlightsList(searchResults)}

          {flightsMSStatus === "SUCCESS" && isCreatePromptActive && (
            <CreateView />
          )}

          {flightsMSStatus === "SUCCESS" && isDeletePromptActive && (
            <DeleteView />
          )}

          {flightsMSStatus === "SUCCESS" && isEditPromptActive && <EditView />}
        </div>
      </div>
    );
  }

  componentDidMount() {
    FlightsDispatcher.onCancel();
    FlightsDispatcher.onHealth();
    FlightsDispatcher.onRequest();
  }

  handleIncludeReferenceIDs = (isActive) => {
    this.setState({ isReferenceIDsActive: isActive });
  };

  hanldeSortChange = (e) => {
    const { currentSort } = this.state;
    let nextSort;

    if (currentSort === "down") nextSort = "up";
    else nextSort = "down";

    this.setState({
      currentSort: nextSort,
      sortedItem: e.target.value,
    });
  };

  handleRenderFlightsList = (flightsList) => {
    if (!flightsList.length) flightsList = [flightsList];

    const { flights } = Store.getState();
    const resultsDisplayed = Number(flights.search.resultsPerPage);
    const resultsStart =
      flights.search.resultsPerPage * (flights.search.resultsPage - 1);

    const flightsTable = [];
    const { currentSort, isReferenceIDsActive, sortedItem } = this.state;
    switch (sortedItem) {
      case "flightDuration":
        flightsList.sort((a, b) => {
          return currentSort === "up"
            ? a.flightDuration - b.flightDuration
            : b.flightDuration - a.flightDuration;
        });
        break;

      case "flightDepartureTime":
        flightsList.sort((a, b) => {
          return currentSort === "up"
            ? new Date(a.flightDepartureTime) - new Date(b.flightDepartureTime)
            : new Date(b.flightDepartureTime) - new Date(a.flightDepartureTime);
        });
        break;

      case "flightRouteId":
        flightsList.sort((a, b) => {
          return currentSort === "up"
            ? a.flightRoute.routeId - b.flightRoute.routeId
            : b.flightRoute.routeId - a.flightRoute.routeId;
        });
        break;

      case "flightOrigin":
        flightsList.sort((a, b) => {
          return currentSort === "up"
            ? a.flightRoute.routeOrigin.airportCityName.localeCompare(
                b.flightRoute.routeOrigin.airportCityName
              )
            : b.flightRoute.routeOrigin.airportCityName.localeCompare(
                a.flightRoute.routeOrigin.airportCityName
              );
        });
        break;

      case "flightDestination":
        flightsList.sort((a, b) => {
          return currentSort === "up"
            ? a.flightRoute.routeDestination.airportCityName.localeCompare(
                b.flightRoute.routeDestination.airportCityName
              )
            : b.flightRoute.routeDestination.airportCityName.localeCompare(
                a.flightRoute.routeDestination.airportCityName
              );
        });
        break;

      case "flightAirplaneId":
        flightsList.sort((a, b) => {
          return currentSort === "up"
            ? a.flightAirplane.airplaneId - b.flightAirplane.airplaneId
            : b.flightAirplane.airplaneId - a.flightAirplane.airplaneId;
        });
        break;

      case "flightSeatingId":
        flightsList.sort((a, b) => {
          return currentSort === "up"
            ? a.flightSeatingId - b.flightSeatingId
            : b.flightSeatingId - a.flightSeatingId;
        });
        break;

      case "flightStatus":
        flightsList.sort((a, b) => {
          return currentSort === "up"
            ? a.flightStatus.localeCompare(b.flightStatus)
            : b.flightStatus.localeCompare(a.flightStatus);
        });
        break;

      default:
        flightsList.sort((a, b) => {
          return currentSort === "up"
            ? a.flightId - b.flightId
            : b.flightId - a.flightId;
        });
    }

    for (
      let i = resultsStart;
      i < resultsStart + resultsDisplayed && i < flightsList.length;
      i++
    ) {
      const flightId = flightsList[i].flightId;
      if (flightId) {
        const departureTime = moment(flightsList[i].flightDepartureTime).format(
          "MMMM DD YYYY, h:mm:ss a"
        );

        const minutesPerDay = 3600;
        const minutesPerHour = 60;
        const durationHours = Math.floor(
          flightsList[i].flightDuration / minutesPerDay
        );
        const durationMinutes = Math.floor(
          (flightsList[i].flightDuration % minutesPerDay) / minutesPerHour
        );
        const duration = String(`${durationHours}h ${durationMinutes}m`);

        const index = Number(i) + 1;
        flightsTable.push(
          <tr key={index}>
            <th scrop="row">{index}</th>
            <td>{flightId}</td>
            {isReferenceIDsActive && <td>{flightsList[i].flightAirplane.airplaneId}</td>}
            {isReferenceIDsActive && <td>{flightsList[i].flightRoute.routeId}</td>}
            <td>{flightsList[i].flightRoute.routeOrigin.airportCityName}</td>
            <td>{flightsList[i].flightRoute.routeDestination.airportCityName}</td>
            <td>{departureTime}</td>
            <td>{duration}</td>
            {isReferenceIDsActive && <td>{flightsList[i].flightSeatingId}</td>}
            <td>{flightsList[i].flightStatus}</td>

            {/* Edit */}
            <td>
              <button
                className="btn btn-info"
                onClick={() => FlightsDispatcher.onPromptEdit("/" + flightId)}
              >
                Edit
              </button>
            </td>

            {/* Delete */}
            <td>
              <button
                className="btn btn-primary"
                onClick={() => FlightsDispatcher.onPromptDelete("/" + flightId)}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      }
    }

    return (
      <FlexColumn justify={"start"} style={{ height: "99%", width: "99%" }}>
        <table className="table kit-border-shadow m-3">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">
                Flight ID
                <button
                  className="btn text-white"
                  value="flightId"
                  onClick={this.hanldeSortChange}
                >
                  ⇅
                </button>
              </th>
              {isReferenceIDsActive && <th scope="col">
                Airplane ID
                <button
                  className="btn text-white"
                  value="flightAirplaneId"
                  onClick={this.hanldeSortChange}
                >
                  ⇅
                </button>
              </th>}
              {isReferenceIDsActive && <th scope="col">
                Route ID
                <button
                  className="btn text-white"
                  value="flightRouteId"
                  onClick={this.hanldeSortChange}
                >
                  ⇅
                </button>
              </th>}
              <th scope="col">
                Origin
                <button
                  className="btn text-white"
                  value="flightOrigin"
                  onClick={this.hanldeSortChange}
                >
                  ⇅
                </button>
              </th>
              <th scope="col">
                Destination
                <button
                  className="btn text-white"
                  value="flightDestination"
                  onClick={this.hanldeSortChange}
                >
                  ⇅
                </button>
              </th>
              <th scope="col">
                {"Departure (UTC)"}
                <button
                  className="btn text-white"
                  value="flightDepartureTime"
                  onClick={this.hanldeSortChange}
                >
                  ⇅
                </button>
              </th>
              <th scope="col">
                Duration
                <button
                  className="btn text-white"
                  value="flightDuration"
                  onClick={this.hanldeSortChange}
                >
                  ⇅
                </button>
              </th>
              {isReferenceIDsActive && <th scope="col">
                Seating ID
                <button
                  className="btn text-white"
                  value="flightSeatingId"
                  onClick={this.hanldeSortChange}
                >
                  ⇅
                </button>
              </th>}
              <th scope="col">
                Status
                <button
                  className="btn text-white"
                  value="flightStatus"
                  onClick={this.hanldeSortChange}
                >
                  ⇅
                </button>
              </th>
              <th scope="col" colSpan="2">
                <FlexRow>
                  <button
                    className="btn btn-success text-white kit-text-shadow-dark"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => FlightsDispatcher.onPromptCreate()}
                  >
                    + Create New
                  </button>
                </FlexRow>
              </th>
            </tr>
          </thead>
          <tbody>
            {flightsTable}
            <tr>
              <td colSpan={isReferenceIDsActive ? "12" : "9"}></td>
              {/* Space at end of table for aesthetic */}
            </tr>
          </tbody>
        </table>
      </FlexColumn>
    );
  };
}
export default FlightsDebug;
