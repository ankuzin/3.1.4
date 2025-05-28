async function openDeleteModal(userId) {
    try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error("Не удалось получить данные пользователя");

        const user = await res.json();

        const modalContainer = document.getElementById("modalsContainer");
        modalContainer.innerHTML = ''; // Очищаем перед вставкой

        modalContainer.innerHTML = `
<div class="modal fade" id="deleteUserModal" tabindex="-1" aria-labelledby="deleteUserLabel">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content px-4 py-3">
      <form id="deleteUserForm">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title">Delete user</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <input type="hidden" name="id" value="${user.id}" />
          ${renderInput("ID", user.id)}
          ${renderInput("First name", user.firstName)}
          ${renderInput("Last name", user.lastName)}
          ${renderInput("Age", user.age, "number")}
          ${renderInput("Email", user.email, "email")}
          <div class="mb-4">
            <label class="form-label d-block fw-semibold">Role</label>
            <select class="form-select text-center" disabled>
              ${user.roles.map(r => `<option>${r.name.replace("ROLE_", "")}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="modal-footer border-top-0 justify-content-end">
          <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-danger">Delete</button>
        </div>
      </form>
    </div>
  </div>
</div>
        `;

        const modalElement = document.getElementById("deleteUserModal");
        const bsModal = new bootstrap.Modal(modalElement);

        modalElement.addEventListener('shown.bs.modal', () => {
            modalElement.querySelector('button[type="submit"]');
        });

        bsModal.show();

        document.getElementById("deleteUserForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const delRes = await fetch(`/api/users/${userId}`, { method: "DELETE" });
            if (delRes.ok) {
                bsModal.hide();
                fetchAllUsers();
            } else {
                alert("Ошибка при удалении пользователя");
            }
        });
    } catch (err) {
        alert(err.message);
    }

    function renderInput(label, value, type = "text") {
        return `
          <div class="mb-2">
            <label class="form-label d-block fw-semibold">${label}</label>
            <input type="${type}" class="form-control text-center" value="${value}" disabled />
          </div>
        `;
    }
}
