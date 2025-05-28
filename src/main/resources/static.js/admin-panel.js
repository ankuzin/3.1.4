const apiBase = '/api/users';
const usersTableBody = document.getElementById('usersTableBody');
const currentUserTableBody = document.getElementById('currentUserTableBody');
const currentUserInfo = document.getElementById('currentUserInfo');

window.addEventListener('DOMContentLoaded', () => {
    fetchCurrentUser();
    fetchAllUsers();
});

function fetchCurrentUser() {
    fetch('/api/users/user')
        .then(res => res.json())
        .then(user => {
            const roles = (user.roles || []).map(r => r.name.replace('ROLE_', '')).join(' ');
            currentUserInfo.innerText = `${user.email} with roles: ${roles}`;

            currentUserTableBody.innerHTML = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${roles}</td>
                </tr>
            `;
        });
}

function fetchAllUsers() {
    fetch(apiBase)
        .then(res => res.json())
        .then(data => {
            const users = Array.isArray(data) ? data : (data.users || []);
            usersTableBody.innerHTML = '';
            users.forEach(user => {
                usersTableBody.innerHTML += renderUserRow(user);
            });
        });
}

function renderUserRow(user) {
    const roles = (user.roles || []).map(r => r.name.replace('ROLE_', '')).join(', ');
    return `
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${roles}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openEditModal(${user.id})">Edit</button>
            </td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${user.id})">Delete</button>
            </td>
        </tr>
    `;
}
window.refreshUserTable = fetchAllUsers;