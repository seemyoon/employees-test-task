const tableBody = document.getElementById("employee-table");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const loadBtn = document.getElementById("load");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

const API = "/api/employees";
let employees = [];
let currentPage = 1;
const limit = 5;

async function fetchEmployees() {
    const search = searchInput.value;
    const sort = sortSelect.value;
    let sortBy = '';
    let order = '';

    if (sort.includes(':')) [sortBy, order] = sort.split(':');


    const res = await fetch(`${API}?search=${search}&sortBy=${sortBy}&order=${order}`);
    employees = await res.json();
    renderTable();
    updatePaginationControls();
}

function renderTable() {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    const currentEmployees = employees.slice(startIndex, endIndex);

    tableBody.innerHTML = currentEmployees.map(employee => `
        <tr>
            <td>${employee.name}</td>
            <td>${employee.surname}</td>
            <td>${employee.age}</td>
            <td>${employee.position}</td>
            <td>${employee.hireDate}</td>
            <td><input type="number" value="${employee.hours}" class="hours-input" data-id="${employee.id}"></td>
            <td><input type="number" value="${employee.rate}" class="rate-input" data-id="${employee.id}"></td>
            <td>${employee.salary}</td>
            <td><button class="edit-btn" data-id="${employee.id}">edit</button></td>
        </tr>
    `).join('');
}

function updatePaginationControls() {
    const totalPages = Math.round(employees.length / limit);
    pageInfo.textContent = `page ${currentPage} of ${totalPages}`;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePaginationControls();
    }
});

nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.round(employees.length / limit);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        updatePaginationControls();
    }
});

const addForm = document.getElementById("add-form");
addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const employee = {};

    const formElements = addForm.elements;
    for (let element of formElements) {
        if (element.name) {
            if (element.type === "number") {
                employee[element.name] = +element.value;
            } else {
                employee[element.name] = element.value;
            }
        }
    }

    await fetch(API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(employee),
    });

    addForm.reset();
    await fetchEmployees();
});

loadBtn.addEventListener("click", fetchEmployees);
