import PassengersDispatcher from "../dispatchers/PassengersDispatcher";
import { render } from '@testing-library/react';
import Store from "../reducers/Store";

// Components
import App from '../App';

beforeEach(() => {
  jest.clearAllMocks();
  render(<App />);
  while (!Store.getState().isAppStateMounted) {/* do nothing */ }
});

// onCancel_expectAllActiveStatesFalseAndselectItemsPage1AndNoErrorAndStatusSuccess()
test("onCancel sets CRUD isActive bools to false, selectItemsPage to 1, error to none, and status to SUCCESS.",
() => {
  PassengersDispatcher.onCancel();
  const { passengers } = Store.getState();
  expect(passengers.create.isActive).toBe(false);
  expect(passengers.delete.isActive).toBe(false);
  expect(passengers.edit.isActive).toBe(false);
  expect(passengers.search.resultsPage).toBe(1);
  expect(passengers.error).toBe("");
  expect(passengers.status).toBe("SUCCESS");
});

// onError_expectErrorMessageAndErrorStatus()
test("onError sets error to the error message & status to error", 
() => { 
  const errorMessage = "[ERROR]: 404 - Not Found!";
  PassengersDispatcher.onError(errorMessage);
  const { passengers } = Store.getState();
  expect(passengers.error).toBe(errorMessage);
  expect(passengers.status).toBe("ERROR");
});

test("onRequest with valid response sets searchresults to passengers returned, has no error, and has status SUCCESS",
() => {
  const sampleResults = {
    "0": {
      "id": "1",
      "bookingId": "3",
      "passportId": "1BB2233",
      "firstName": "Tural",
      "lastName": "Hasanli",
      "dateOfBirth": "1990-11-23",
      "sex": "male",
      "address": "400 W 50TH Street, NY, NY10019",
      "isVeteran": "false"
    },
    "1": {
      "id": "2",
      "bookingId": "9",
      "passportId": "1HY86879",
      "firstName": "Rob",
      "lastName": "Williams",
      "dateOfBirth": "1980-1-15",
      "sex": "male",
      "address": "6 Old Shore Avenue, NY, NY10019",
      "isVeteran": "true"
    },
    "2": {
      "id": "3",
      "bookingId": "7",
      "passportId": "SIFJKD963498",
      "firstName": "Jessica",
      "lastName": "Michaels",
      "dateOfBirth": "2011-6-18",
      "sex": "female",
      "address": "84558 Novick Center, NY, NY10019",
      "isVeteran": "false"
    }
  };
  jest.mock("../Orchestration", () => ({
    createRequest: (requestType, requestPath, onError, onSuccess) => {
      onSuccess(sampleResults);
    }
  }));
  PassengersDispatcher
    .onRequest();
  setTimeout(() => {
    const { passengers } = Store.getState();
    expect(passengers.search.results).toBe(sampleResults);
    expect(passengers.error).toBe("");
    expect(passengers.status).toBe("SUCCESS");
  }, 100);
});

// onSearchResults_WithInvalidResults_expectErrorAndStatusError()
test("onSearchResults with invalid response has error and has status ERROR", 
() => { 
  const errorMessage = "Test Error Message";
  jest.mock("../Orchestration", () => ({
    createRequest: (requestType, requestPath, onError, onSuccess) => {
      onError(errorMessage);
    }
  }));
  PassengersDispatcher.onRequest();
  setTimeout(() => {
    const { passengers } = Store.getState();
    expect(passengers.error).toBe(errorMessage);
    expect(passengers.status).toBe("ERROR");
  }, 100);
});

// onPromptCreate_expectCreateViewIsActive()
test("onPromptCreate() sets the create view active, sets the delete and error views as inactive.", 
() => { 
  PassengersDispatcher.onPromptCreate();
  setTimeout(() => {
    const { passengers } = Store.getState();
    expect(passengers.create.isActive).toBe(true);
    expect(passengers.delete.isActive).toBe(false);
    expect(passengers.edit.isActive).toBe(false);
  }, 100);
});

// onPromptDelete_expectDeleteViewIsActive()
test("onPromptDelete() sets the delete view active, sets the create and error views as inactive.", 
() => { 
  PassengersDispatcher.onPromptDelete();
  setTimeout(() => {
    const { passengers } = Store.getState();
    expect(passengers.create.isActive).toBe(false);
    expect(passengers.delete.isActive).toBe(true);
    expect(passengers.edit.isActive).toBe(false);
  }, 100);
});

// onPromptEdit_expectEditViewIsActive()
test("onPromptEdit() sets the edit view active, sets the create and delete views as inactive.", 
() => { 
  PassengersDispatcher.onPromptEdit();
  setTimeout(() => {
    const { passengers } = Store.getState();
    expect(passengers.create.isActive).toBe(false);
    expect(passengers.delete.isActive).toBe(false);
    expect(passengers.edit.isActive).toBe(true);
  }, 100);
});

// onSelectItemsPage_expectCorrectPageValue()
test("onSelectItemsPage(pageValue) sets the search.resultsPage to the passed value.", 
() => { 
  const pageValue = 789;
  PassengersDispatcher.onSelectItemsPage(pageValue);
  setTimeout(() => {
    const { passengers } = Store.getState();
    expect(passengers.search.resultsPage).toBe(pageValue);
  }, 100);
});

// onSelectItemsPerPage_expectCorrectPageValue()
test("onSelectItemsPerPage(perPageValue) sets the search.resultsPerPage to the passed value.", 
() => { 
  const perPageValue = 75;
  PassengersDispatcher.onSelectItemsPerPage(perPageValue);
  setTimeout(() => {
    const { passengers } = Store.getState();
    expect(passengers.search.resultsPerPage).toBe(perPageValue);
  }, 100);
});