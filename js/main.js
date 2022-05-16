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
  createStudents(newStudent); // вызываем функуцию для добавления в базу данных и передаем в качестве аргумента обьект созданный выше
  readStudents(); // для отображения даннх
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
// Создаём функцию для отображения
function readStudents() {
  //   отправляем запрос в db.json с настройками поиска и пагинации. знак q - нужен для того чтобы найти элемент во всей базе данных.знак & ставится если добавляем новые настройки к предыдущим. _page - для тошо чтобы открыть конкретную страницу. _limit - для отображения несколльких элементов на сайте
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=4`) // для получения данных из db.json
    .then((res) => res.json())
    .then((data) => {
      sectionKpi.innerHTML = ""; // очищаем тег section чтобы не было дубликатов
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
      sumPage(); // вызов функции для нахождения кол-во страниц
    });
}
readStudents();
//! DELETE
document.addEventListener("click", (event) => {
  let del_class = [...event.target.classList]; //сохраняем массив с классами в переменную, используя spread оператор
  if (del_class.includes("btnDelete")) {
    // проверяет есть ли в нашем поиске класс btnDelete
    let del_id = event.target.id; //сохраняем в переменную id нашего элемента по которому кликнули
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readStudents()); // для того чтобы вызов функции отображения данных подождал пока запрос delete выполнился а затем сработал
  }
});
//! EDIT
//сохраняем в переменные названия инпутов и кнопки
let editInpName = document.getElementById("editInpName");
let editInpLastName = document.getElementById("editInpLastName");
let editInpNumber = document.getElementById("editInpNumber");
let editInpKpi = document.getElementById("editInpKpi");
let editInpMonthKpi = document.getElementById("editInpMonthKpi");
let editBtnSave = document.getElementById("editBtnSave");
let editSectionKpi = document.getElementById("editSectionKpi");
let editInpImage = document.getElementById("editInpImage");

// событие на кнопку изменить
document.addEventListener("click", (event) => {
  // с помощью обьекта event ищем класс нашего элемента
  let editArr = [...event.target.classList];
  if (editArr.includes("btnEdit")) {
    // проверем есть ли в массиве с классами наш класс btnEdit
    let id = event.target.id; // сохраняем в переменную id,ша нашего элемента
    fetch(`${API}/${id}`) // с помощью запроса GET обращаемся к конкретному обьекту
      .then((res) => res.json())
      .then((data) => {
        // созраняем в инпуты модального окна данные из db,json
        editInpName.value = data.studentName;
        editInpLastName.value = data.studentLastName;
        editInpNumber.value = data.studentNumber;
        editInpImage.value = data.studentImage;
        editInpKpi.value = data.studentKpi;
        editInpMonthKpi.value = data.studentMonthKpi;

        // добавляем при помощи метода setAttribute id в нашу кнопку сохранить дл того чтобы передать в дальнейшем в аргументы функции editBook
        editBtnSave.setAttribute("id", data.id);
      });
  }
}); //событие на кнопку сохранить
editBtnSave.addEventListener("click", () => {
  // создаем обьект с измененными данными и в дальнейшем для отправки db.json
  let editedStudent = {
    studentName: editInpName.value,
    studentLastName: editInpLastName.value,
    studentNumber: editInpNumber.value,
    studentImage: editInpImage.value,
    studentKpi: editInpKpi.value,
    studentMonthKpi: editInpMonthKpi.value,
  };
  console.log(editedStudent);
  editBook(editedStudent, editBtnSave.id); // вызов функции для отправки измененных данных в db.json в качестве аргумента передаем вышесозданный обьект и значение атрибута id из кнопки сохранить
});
function editBook(objEditStudent, id) {
  // функция для отправки измененных данных в db.json
  fetch(`${API}/${id}`, {
    // в параметры принимаем: измененный обьект и id jп котрому будем обращаться
    method: "PATCH", // используем метод PATCH для запроса на изменение данных на db.json
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objEditStudent),
  }).then(() => readStudents()); // вызов функции для отображения данных сразу же после нажатия на кнопку сохранить
}
//! SEARCH
//сохраняем в переменную инпут поиска из inde.html
let inpSearch = document.getElementById("inpSearch");

inpSearch.addEventListener("input", (event) => {
  searchValue = event.target.value; // сохраняем в  переменную значение инпута
  readStudents(); // вызываем функцию для отображения данных и сразу же после изменения инпута Поиск
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
