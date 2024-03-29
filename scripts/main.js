document
  .getElementById("userForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const userId = document.getElementById("userId").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;

    if (userId) {
      // Edit existing user
      fetch(`/edit/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FirstName: firstName,
          LastName: lastName,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
          fetchAndDisplayUsers();
          clearFormFields();
        })
        .catch((error) => console.error("Error editing user:", error));
    } else {
      // Submit new user
      fetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FirstName: firstName,
          LastName: lastName,
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          console.log(user);
          fetchAndDisplayUsers();
          clearFormFields();
        })
        .catch((error) => console.error("Error submitting form:", error));
    }
  });

function fetchAndDisplayUsers() {
  fetch("/api/users")
    .then((response) => response.json())
    .then((users) => {
      const usersContainer = document.getElementById("users");
      usersContainer.innerHTML = "";

      // Create a table
      const table = document.createElement("table");

      // Add table header
      const headerRow = document.createElement("tr");
      headerRow.innerHTML = "<th>Name</th><th>Edit</th><th>Delete</th>";
      table.appendChild(headerRow);

      users.forEach((user) => {
        const userRow = document.createElement("tr");

        // User details cell
        const userDetailsCell = document.createElement("td");
        userDetailsCell.textContent = `${user.FirstName} ${user.LastName}`;
        userRow.appendChild(userDetailsCell);

        // Edit button cell
        const editButtonCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () =>
          editUser(user.ID, user.FirstName, user.LastName);
        editButtonCell.appendChild(editButton);
        userRow.appendChild(editButtonCell);

        // Delete button cell
        const deleteButtonCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteUser(user.ID);
        deleteButtonCell.appendChild(deleteButton);
        userRow.appendChild(deleteButtonCell);

        // Add the row to the table
        table.appendChild(userRow);
      });

      // Append the table to the container
      usersContainer.appendChild(table);
    })
    .catch((error) => console.error("Error fetching user records:", error));
}

function editUser(userId, firstName, lastName) {
  document.getElementById("userId").value = userId;
  document.getElementById("firstName").value = firstName;
  document.getElementById("lastName").value = lastName;
}

function deleteUser(userId) {
  const confirmation = confirm("Are you sure you want to delete this user?");
  if (confirmation) {
    fetch(`/delete/${userId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        fetchAndDisplayUsers();
      });
  }
}

function clearFormFields() {
  document.getElementById("userId").value = "";
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
}

// Fetch and display users on page load
document.addEventListener("DOMContentLoaded", fetchAndDisplayUsers);
