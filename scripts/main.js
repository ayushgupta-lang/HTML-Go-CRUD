document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();

    document.getElementById("userForm").addEventListener("submit", function (event) {
        event.preventDefault();
        submitForm();
    });

    function fetchUsers() {
        fetch("/users")
            .then(response => response.json())
            .then(users => displayUsers(users));
    }

    function displayUsers(users) {
        const usersDiv = document.getElementById("users");
        usersDiv.innerHTML = "";

        users.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.innerHTML = `
                <p>${user.FirstName} ${user.LastName}</p>
                <button onclick="editUser(${user.ID}, '${user.FirstName}', '${user.LastName}')">Edit</button>
                <button onclick="deleteUser(${user.ID})">Delete</button>
            `;
            usersDiv.appendChild(userDiv);
        });
    }

    function submitForm() {
        const formData = new FormData(document.getElementById("userForm"));
        fetch("/submit", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchUsers();
        });
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
                method: "DELETE"
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                fetchUsers(); // Refresh the user list after deletion
            });
        }
    }
});
