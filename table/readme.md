# Material UI Style Table

## Features

- Sortable
- Paged
- Number formatting
- Prefix and suffix settable per column

## Example Usage

~~~~
const headers = {
  name: {
    sortable: false
  },
  gitCommits: {
    sortable: true,
  },
  efficiency: {
    sortable: true,
    suffix: "%",
    decimalPlaces: 2,
  },
  hourlyRate: {
    sortable: true,
    prefix: "$",
  }
};

const data = [
  {name: "Ivan", gitCommits: 10, efficiency: 85, hourlyRate: 5},
  {name: "Alex", gitCommits: 12, efficiency: 85, hourlyRate: 5},
  {name: "Toby", gitCommits: 9001, efficiency: 90.1243, hourlyRate: 5},
  {name: "Leo", gitCommits: 1, efficiency: 50.5, hourlyRate: 5},
];

<Table
  headers={headers}
  data={data}
  formatHeaders={true}
  itemsPerPage={3}
/>
~~~~