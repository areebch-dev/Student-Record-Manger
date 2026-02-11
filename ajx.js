const API_URL = "https://698c2b6921a248a27360af4e.mockapi.io/students";
  let form = document.getElementById("studentForm");
  let tbody = document.querySelector("#studentTable tbody");
  let clrBtn = document.querySelector(".clear-btn");
  let editIndex = null;
  let students = [];

  fetchStudents(); // Initial fetch

  // ---------------------------- FORM SUBMIT ----------------------------
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let student = {
      stdName: document.getElementById("stdName").value.trim(),
      fName: document.getElementById("fName").value.trim(),
      age: document.getElementById("age").value.trim(),
      className: document.getElementById("class").value.trim(),
      gender: document.getElementById("gender").value.trim(),
      dob: document.getElementById("dob").value.trim(),
      phone: document.getElementById("phone").value.trim()
    };

    if (!validate(student)) return;
    clrErr();

    if (editIndex === null) {
      addStudent(student);
    } else {
      const studentId = students[editIndex].id;
      updateStudent(studentId, student);
    }
  });

  // ---------------------------- FETCH (GET) ----------------------------
  function fetchStudents() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL, true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        students = JSON.parse(xhr.responseText);
        DisplayInfo();
      } else {
        console.error("Failed to fetch data.");
      }
    };

    xhr.onerror = function () {
      console.error("Network error.");
    };

    xhr.send();
  }

  // ---------------------------- ADD (POST) ----------------------------
  function addStudent(student) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", API_URL, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
      if (xhr.status === 201) {
        fetchStudents();
        form.reset();
      } else {
        console.error("Failed to add this record..!!");
      }
    };

    xhr.send(JSON.stringify(student));
  }

  // ---------------------------- UPDATE (PUT) ----------------------------
  function updateStudent(id, student) {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", `${API_URL}/${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
      if (xhr.status === 200) {
        fetchStudents();
        form.reset();
        editIndex = null;
        document.querySelector(".submit-btn").innerHTML = `<i class="fa-solid fa-plus"></i> Add Record`;
      } else {
        console.error("Failed to update.");
      }
    };

    xhr.send(JSON.stringify(student));
  }

  // ---------------------------- DELETE (DELETE) ----------------------------
  function deleteRecord(index) {
    if (confirm("Are you sure you want to delete this record?")) {
      const id = students[index].id;
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", `${API_URL}/${id}`, true);

      xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 204) {
          fetchStudents();
        } else {
          console.error("Delete failed.");
        }
      };

      xhr.send();
    }
  }

  // ---------------------------- DISPLAY FUNCTION ----------------------------
  function DisplayInfo() {
    tbody.innerHTML = "";

    students.forEach((student, index) => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${student.stdName}</td>
        <td>${student.fName}</td>
        <td>${student.age}</td>
        <td>${student.className}</td>
        <td>${student.dob}</td>
        <td>${student.phone}</td>
        <td>${student.gender}</td>
        <td>
         <button class="action-btn edit-btn" onclick="editRecord(${index})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="action-btn del-btn" onclick="deleteRecord(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // ---------------------------- EDIT RECORD ----------------------------
  function editRecord(index) {
    const std = students[index];

    document.getElementById("stdName").value = std.stdName;
    document.getElementById("fName").value = std.fName;
    document.getElementById("age").value = std.age;
    document.getElementById("class").value = std.className;
    document.getElementById("gender").value = std.gender;
    document.getElementById("dob").value = std.dob;
    document.getElementById("phone").value = std.phone;

    editIndex = index;
    document.querySelector(".submit-btn").innerHTML = `<i class="fa-regular fa-floppy-disk"></i> Save Changes`;



      let allRows = tbody.querySelectorAll("tr");
    allRows.forEach(row => {
        row.style.display = "none";
    })
     
    allRows[index].style.display = "table-row";


  }

  

  // ---------------------------- VALIDATION ----------------------------
function validate(student) {
  let isValid = true;

  clrErr(); // always clear first

  if (!student.stdName) {
    document.getElementById("stdNameErr").innerHTML = "* Student name is required!";
    isValid = false;
  }
  if (!student.fName) {
    document.getElementById("fNameErr").innerHTML = "* Father name is required!";
    isValid = false;
  }
  if (!student.age) {
    document.getElementById("ageErr").innerHTML = "* Age is required!";
    isValid = false;
  } else if (student.age <= 0 || isNaN(student.age)) {
    document.getElementById("ageErr").innerHTML = "* Age must be greater than 0!";
    isValid = false;
  }

  if (!student.className) {
    document.getElementById("classErr").innerHTML = "* Class is required!";
    isValid = false;
  }

  if (!student.gender) {
    document.getElementById("genErr").innerHTML = "* Gender is required!";
    isValid = false;
  }

  if (!student.dob) {
    document.getElementById("dobErr").innerHTML = "* D.O.B is required!";
    isValid = false;
  }

  if (!student.phone) {
    document.getElementById("phoneErr").innerHTML = "* Phone Number is required!";
    isValid = false;
  } else if (!/^[0-9]{11}$/.test(student.phone)) {
    document.getElementById("phoneErr").innerHTML = "* Please enter a valid 11-digit phone number!";
    isValid = false;
  }

  return isValid;
}


  // ---------------------------- CLEAR ERRORS ----------------------------
  function clrErr() {
    document.querySelectorAll(".error").forEach(err => err.innerHTML = "");
  }

  // ---------------------------- CLEAR FORM ----------------------------
  clrBtn.addEventListener("click", () => {
  const inputs = form.querySelectorAll("input, select");
  let isFill = false;

  inputs.forEach(input => {
    if (input.value.trim() !== "") {
      isFill = true;
    }
  });

  if (isFill) {
    const sure = confirm("Are you sure you want to clear the form?");
    if (!sure) return;
  } else {
    alert("Form already empty, nothing to clear!");
    return;
  }

  form.reset();
  clrErr();
  editIndex = null;
  document.querySelector(".submit-btn").innerHTML = `<i class="fa-solid fa-plus"></i> Add Record`;
});
