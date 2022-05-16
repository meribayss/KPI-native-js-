const API = "http://localhost:8000/students";
let inpName = document.getElementById("inpName");
let inpLastName = document.getElementById("inpLastName");
let inpNumber = document.getElementById("inpNumber");
let inpKpi = document.getElementById("inpKpi");
let inpMonthKpi = document.getElementById("inpMonthKpi");
let btnAdd = document.getElementById("btnAdd");
let sectionKpi = document.getElementById("sectionKpi");
let inpImage = document.getElementById("inpImage");

let btnOpenFor = document.getElementById("flush-collapseOne");
let searchValue = "";
let currentPage = 1;
let countPage = 1;

btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpImage.value.trim() ||
    !inpLastName.value.trim() ||
    !inpNumber.value.trim() ||
    !inpKpi.value.trim() ||
    !inpMonthKpi.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  let newStudent = {
    studentName: inpName.value,
    studentImage: inpImage.value,
    studentLastName: inpLastName.value,
    studentNumber: inpNumber.value,
    studentKpi: inpKpi.value,
    studentMonthKpi: inpMonthKpi.value,
  };
  createStudents(newStudent);
  readStudents();
});
// ! ================= CREATE =====================
function createStudents(student) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(student),
  }).then(() => readStudents());
  inpName.value = "";
  inpLastName.value = "";
  inpImage.value = "";
  inpNumber.value = "";
  inpKpi.value = "";
  inpMonthKpi.value = "";

  btnOpenFor.classList.toggle("show");
}

// !=============== READ ====================

function readStudents() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=4`)
    .then((res) => res.json())
    .then((data) => {
      sectionKpi.innerHTML = "";
      data.forEach((item) => {
        sectionKpi.innerHTML += `
          <div class="card mt-3" style="width: 18rem;">
        <img src="${item.studentImage}" class="card-img-top" style="height:250px" alt="${item.studentName}">
           <div class="card-body">
          <h5 class="card-title">${item.studentName}</h5>
          <p class="card-text">${item.studentLastName}</p>
          <p class="card-text">${item.studentNumber}</p>
          <p class="card-text">${item.studentKpi}</p>
          <p class="card-text">${item.studentMonthKpi}</p>
          <button class="btn btn-outline-danger btnDelete" id="${item.id}">
          Удалить
          </button>
          <button class="btn btn-outline-light btnEdit" id = "${item.id}" data-bs-toggle="modal"
          data-bs-target="#exampleModal">
          Изменить
          </button>
          </div>
          </div>
          `;
      });
      sumPage();
    });
}
readStudents();
//! DELETE
document.addEventListener("click", (event) => {
  let del_class = [...event.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = event.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readStudents());
  }
});
//! EDIT
let editInpName = document.getElementById("editInpName");
let editInpLastName = document.getElementById("editInpLastName");
let editInpNumber = document.getElementById("editInpNumber");
let editInpKpi = document.getElementById("editInpKpi");
let editInpMonthKpi = document.getElementById("editInpMonthKpi");
let editBtnSave = document.getElementById("editBtnSave");
let editSectionKpi = document.getElementById("editSectionKpi");
let editInpImage = document.getElementById("editInpImage");

document.addEventListener("click", (event) => {
  let editArr = [...event.target.classList];
  if (editArr.includes("btnEdit")) {
    let id = event.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.studentName;
        editInpLastName.value = data.studentLastName;
        editInpNumber.value = data.studentNumber;
        editInpImage.value = data.studentImage;
        editInpKpi.value = data.studentKpi;
        editInpMonthKpi.value = data.studentMonthKpi;

        editBtnSave.setAttribute("id", data.id);
      });
  }
});
editBtnSave.addEventListener("click", () => {
  let editedStudent = {
    studentName: editInpName.value,
    studentLastName: editInpLastName.value,
    studentNumber: editInpNumber.value,
    studentImage: editInpImage.value,
    studentKpi: editInpKpi.value,
    studentMonthKpi: editInpMonthKpi.value,
  };
  console.log(editedStudent);
  editBook(editedStudent, editBtnSave.id);
});
function editBook(objEditStudent, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objEditStudent),
  }).then(() => readStudents());
}
//! SEARCH

let inpSearch = document.getElementById("inpSearch");

inpSearch.addEventListener("input", (event) => {
  searchValue = event.target.value;
  readStudents();
});
//! =================PAGINATION======================

let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage = currentPage - 1;
  readStudents();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) {
    return;
  }
  currentPage = currentPage + 1;
  readStudents();
});

function sumPage() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 4);
    });
}
