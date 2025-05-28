function openEditModal(userId) {
    fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(user => {
            const roles = ['ROLE_USER', 'ROLE_ADMIN'];

            const modalId = `editModal_${user.id}`;
            const modalHTML = `
                <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="editUserLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content px-4 py-3">
                            <form class="edit-user-form" data-id="${user.id}">
                                <div class="modal-header border-bottom-0">
                                    <h5 class="modal-title">Edit user</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body text-center">
                                    <input type="hidden" name="id" value="${user.id}" />
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">ID</label>
                                        <input type="text" value="${user.id}" class="form-control text-center" disabled />
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">First name</label>
                                        <input type="text" name="firstName" value="${user.firstName}" class="form-control text-center" />
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">Last name</label>
                                        <input type="text" name="lastName" value="${user.lastName}" class="form-control text-center" />
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">Age</label>
                                        <input type="number" name="age" value="${user.age}" class="form-control text-center" />
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">Email</label>
                                        <input type="email" name="email" value="${user.email}" class="form-control text-center" />
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">Password</label>
                                        <input type="password" name="password" class="form-control text-center" />
                                    </div>
                                    <div class="mb-4">
                                        <label class="form-label fw-semibold">Role</label>
                                        <select multiple class="form-select text-center" name="roles" size="2">
                                            ${roles.map(role => {
                const selected = user.roles.some(r => r.name === role) ? 'selected' : '';
                return `<option value="${role}" ${selected}>${role.replace('ROLE_', '')}</option>`;
            }).join('')}
                                        </select>
                                    </div>
                                </div>
                                <div class="modal-footer border-top-0 justify-content-end">
                                    <button type="submit" class="btn btn-primary me-2">Edit</button>
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            const container = document.getElementById('modalsContainer');
            container.innerHTML = modalHTML;

            const modalEl = document.getElementById(modalId);
            const bsModal = new bootstrap.Modal(modalEl);
            bsModal.show();

            const form = modalEl.querySelector('form');
            form.addEventListener('submit', event => {
                event.preventDefault();

                const formData = new FormData(form);
                const updatedUser = {
                    id: user.id,
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    age: Number(formData.get('age')),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    roles: Array.from(formData.getAll('roles')).map(role => ({ name: role }))
                };

                fetch(`/api/users/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedUser)
                }).then(response => {
                    if (response.ok) {
                        bsModal.hide();
                        fetchAllUsers();
                    } else {
                        alert('Failed to update user');
                    }
                });
            });
        });
}
