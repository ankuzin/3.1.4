document.addEventListener("DOMContentLoaded", () => {
    const newUserTab = document.getElementById("new-user-tab");
    const container = document.getElementById("addUserFormContainer");

    if (!newUserTab || !container) return;

    newUserTab.addEventListener("click", () => {
        renderAddUserForm();
    });

    function renderAddUserForm() {
        container.innerHTML = `
            <div class="card mt-3 shadow-sm p-4">
                <h5 class="fw-bold">Add new user</h5>
                <form id="addUserForm" class="d-flex flex-column align-items-center">
    <div class="mb-3 w-50 text-center">
        <label class="form-label fw-bold">First name</label>
        <input type="text" id="firstName" name="firstName" class="form-control bg-warning-subtle">
    </div>
    <div class="mb-3 w-50 text-center">
        <label class="form-label fw-bold">Last name</label>
        <input type="text" id="lastName" name="lastName" class="form-control bg-warning-subtle">
    </div>
    <div class="mb-3 w-50 text-center">
        <label class="form-label fw-bold">Age</label>
        <input type="number" id="age" name="age" class="form-control">
    </div>
    <div class="mb-3 w-50 text-center">
        <label class="form-label fw-bold">Email</label>
        <input type="email" id="email" name="email" class="form-control bg-warning-subtle">
    </div>
    <div class="mb-3 w-50 text-center">
        <label class="form-label fw-bold">Password</label>
        <input type="password" id="password" name="password" class="form-control">
    </div>
    <div class="mb-3 w-50 text-center">
        <label class="form-label fw-bold">Role</label>
        <select multiple id="roles" name="roles" class="form-control"></select>
    </div>
    <div class="text-center w-50">
        <button type="submit" class="btn btn-success w-100">Add new user</button>
    </div>
</form>
            </div>
        `;

        // Подгрузка ролей
        fetch("/api/users/roles")
            .then(res => res.json())
            .then(roles => {
                const select = document.getElementById("roles");
                roles.forEach(role => {
                    const option = document.createElement("option");
                    option.value = role.name;
                    option.textContent = role.name.replace("ROLE_", "");
                    select.appendChild(option);
                });
            });

        document.getElementById('addUserForm').addEventListener('submit', event => {
            event.preventDefault();

            const newUser = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                age: Number(document.getElementById('age').value), // 👈 фикс
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                roles: Array.from(document.getElementById('roles').selectedOptions).map(opt => opt.value)
            };


            fetch('/api/users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newUser)
            }).then(res => {
                if (res.ok) {
                    // 👉 после успешного добавления
                    refreshUserTable(); // обновить таблицу
                    document.getElementById('users-tab').click(); // переключить таб
                } else {
                    res.text().then(text => console.error('Ошибка:', text));
                }
            }).catch(err => console.error('Ошибка запроса:', err));
        });

    }
});
