//input 입력
const todoInputElem = document.querySelector(".todo-input");
const todoListElem = document.querySelector(".todo-list");
//전체 완료버튼선언
const completeAllBtnElem = document.querySelector(".complete-all-btn");
//남은 할 일 개수 나타내는 요소
const leftItemsElem = document.querySelector(".left-items");

//todo-top 버튼 요소 선언
const showAllBtnElem = document.querySelector(".show-all-btn"); // All 버튼
const showActiveBtnElem = document.querySelector(".show-active-btn"); // Active 버튼
const showCompletedBtnElem = document.querySelector(".show-completed-btn"); // Completed 버튼
const clearCompletedBtnElem = document.querySelector(".clear-completed-btn"); // Completed Clear 버튼

let todos = [];
let id = 0;

function loadToDoList() {
  const loadedToDoList = localStorage.getItem("todos");
  if (loadedToDoList !== null) {
    const parsedToDoList = JSON.parse(loadedToDoList);
    const newTodos = parsedToDoList;
    setTodos(newTodos);
  } else {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

//완료되지 않은 할 일 리스트 반환
const getActiveTodos = () => {
  return todos.filter((todo) => todo.isCompleted === false);
};

const getAllTodos = () => {
  return todos;
};

const getCompletedTodos = () => {
  return todos.filter((todo) => todo.isCompleted === true);
};

//남은 할 일 개수를 갱신해주는 함수 -> 완료처리 되는곳마다 추가해주기
const setLeftItems = () => {
  const leftTodos = getActiveTodos();
  leftItemsElem.innerHTML = `${leftTodos.length} items left`;
};

// 할 일 추가하기
const setTodos = (newTodos) => {
  todos = newTodos;
  localStorage.setItem("todos", JSON.stringify(todos));
};

// 전체 todos 체크 여부
let isAllCompleted = false;

const setIsAllCompleted = (bool) => {
  isAllCompleted = bool;
};

//전체 완료처리
const completeAll = () => {
  completeAllBtnElem.classList.add("checked");
  const newTodos = getAllTodos().map((todo) => ({
    ...todo,
    isCompleted: true,
  }));
  setTodos(newTodos);
};

//전체 미완료처리
const incompleteAll = () => {
  completeAllBtnElem.classList.remove("checked");
  const newTodos = getAllTodos().map((todo) => ({
    ...todo,
    isCompleted: false,
  }));
  setTodos(newTodos);
};

// 전체 todos의 check 여부 (isCompleted)
const checkIsAllCompleted = () => {
  //현재 todos배열의 길이와, 완료된 todos배열의 길이를 비교 후
  //isAllCompleted의 상태를 변경
  //'checked' 클래스 네임을 추가 또는 삭제
  if (getAllTodos().length === getCompletedTodos().length) {
    setIsAllCompleted(true);
    completeAllBtnElem.classList.add("checked");
  } else {
    setIsAllCompleted(false);
    completeAllBtnElem.classList.remove("checked");
  }
};

//isAllCompleted 상태를 토글처리해주기
const onClickCompleteAll = () => {
  if (!getAllTodos().length) return; // todos배열의 길이가 0이면 return;

  if (isAllCompleted)
    incompleteAll(); // isAllCompleted가 true이면 todos를 전체 미완료 처리
  else completeAll(); // isAllCompleted가 false이면 todos를 전체 완료 처리
  setIsAllCompleted(!isAllCompleted); // isAllCompleted 토글
  paintTodos(); // 새로운 todos를 렌더링
  setLeftItems(); //남은 할 일 개수 표시
};

const setCurrentId = (newCurrentId) => {
  CurrentId = newCurrentId;
};

const appendTodos = (text) => {
  const loadedToDoList = localStorage.getItem("todos");
  const parsedToDoList = JSON.parse(loadedToDoList);
  const lastValue = parsedToDoList[parsedToDoList.length - 1];

  console.log(parsedToDoList, lastValue);

  if (lastValue == undefined) {
    setCurrentId(0);
    console.log("첫번째 할일");
  } else {
    setCurrentId(lastValue.id);
    console.log("할일 추가");
  }

  const newId = CurrentId + 1; //새롭게 저장되는 할 일의 id값
  const newTodos = getAllTodos().concat({
    id: newId,
    isCompleted: false,
    content: text,
  });
  //concat을 이용해 기존 todos에 새로운 todo 추가해주기

  // 스프레드 연산자 사용할 경우
  // const newTodos = [...getAllTodos(), {id: newId, isCompleted: false, content: text }]
  setTodos(newTodos);
  setLeftItems();
  checkIsAllCompleted(); // 전체 완료처리 확인
  paintTodos();
};

//할 일 수정
const updateTodo = (text, todoId) => {
  const currentTodos = getAllTodos();
  const newTodos = currentTodos.map((todo) =>
    todo.id === todoId ? { ...todo, content: text } : todo
  );
  setTodos(newTodos);
  paintTodos();
};

//수정모드 키기
const modifyTodo = (e, todoId) => {
  const todoElem = e.target.parentNode.parentNode; //li
  const todoItemElem = todoElem.parentNode; //ul
  const inputText = todoElem.innerText; //li의 innertext
  console.log(todoElem, todoItemElem, inputText);

  const modiForm = document.createElement("Label");
  modiForm.classList.add("modi-form");

  const inputElem = document.createElement("input");
  inputElem.value = inputText;
  inputElem.classList.add("edit-input");

  const cancelBtn = document.createElement("button");
  const cancelIcon = document.createElement("i");
  cancelBtn.classList.add("cancel-btn");
  cancelIcon.setAttribute("class", "fa fa-times");

  //수정모드 종료 1 (cancel버튼 누르기)
  cancelBtn.addEventListener("click", () => {
    todoElem.removeChild(modiForm);
  });

  //수정모드 종료 2 (modiForm 제외한곳 누르기)
  const onClickBody = (e) => {
    if (e.target !== modiForm) {
      todoElem.removeChild(modiForm);
      document.body.removeEventListener("click", onClickBody);
    }
  };

  //수정된 내용으로 todo 수정
  inputElem.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      updateTodo(e.target.value, todoId);
      todoElem.removeChild(modiForm);
      document.body.removeEventListener("click", onClickBody);
    }
  });

  document.body.removeEventListener("click", onClickBody);

  todoElem.appendChild(modiForm);
  modiForm.appendChild(inputElem);
  modiForm.appendChild(cancelBtn);
  cancelBtn.appendChild(cancelIcon);
};

//할 일 삭제
const deleteTodo = (todoId) => {
  // console.log(todoId);
  //삭제하고자 하는 todo를 제외한 새로운 배열을 다시 todos에 담아주기
  const newTodos = getAllTodos().filter((todo) => todo.id !== todoId);
  setTodos(newTodos);
  setLeftItems(); //남은 할 일 개수 표시
  paintTodos();
};

//할 일 완료처리
const completeTodo = (todoId) => {
  // isCompleted 값을 토글처리해서 새로 todos에 담아주기
  const newTodos = getAllTodos().map((todo) =>
    todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
  );
  setTodos(newTodos);
  paintTodos();
  setLeftItems(); //남은 할 일 개수 표시
  checkIsAllCompleted(); // 전체 todos의 완료 상태를 파악해서 css 변동
};

// click된 todos의 타입에 따라 투두리스트 보여주기
let currentShowType = "all"; // all  | active | complete
//button에 미리 입력해둔 data-type
const setCurrentShowType = (newShowType) => (currentShowType = newShowType);

const onClickShowTodosType = (e) => {
  const currentBtnElem = e.target;
  const newShowType = currentBtnElem.dataset.type;

  if (currentShowType === newShowType) return;

  const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
  //이전 showtype 버튼은 selected 클래스 제거하고
  preBtnElem.classList.remove("selected");

  //새로운 showtype버튼에 selected 클래스 추가
  currentBtnElem.classList.add("selected");
  setCurrentShowType(newShowType);

  //새로 저장된 showtype에 맞는 todos 새로 렌더링
  paintTodos();
};

//HTML에 추가된 할 일 그려주기
const paintTodos = () => {
  todoListElem.innerHTML = null; //todoListElem 요소 안의 HTML 초기화

  //switch-case문을 사용하여 currentShowType에 따라 렌더링
  switch (currentShowType) {
    case "all":
      const allTodos = getAllTodos();
      allTodos.forEach((todo) => {
        paintTodo(todo);
      });
      break;
    case "active":
      const activeTodos = getActiveTodos();
      activeTodos.forEach((todo) => {
        paintTodo(todo);
      });
      break;
    case "completed":
      const completedTodos = getCompletedTodos();
      completedTodos.forEach((todo) => {
        paintTodo(todo);
      });
      break;
    default:
      break;
  }
};

const paintTodo = (todo) => {
  const todoItemElem = document.createElement("li");
  const delIcon = document.createElement("i");
  delIcon.setAttribute("class", "far fa-trash-alt");
  const modiIcon = document.createElement("i");
  modiIcon.setAttribute("class", "fas fa-pencil-alt");

  todoItemElem.classList.add("todo-item");
  todoItemElem.setAttribute("data-id", todo.id);

  const checkboxElem = document.createElement("div");
  checkboxElem.classList.add("checkbox");
  //클릭이벤트 발생 시, 완료 처리해주기
  checkboxElem.addEventListener("click", () => completeTodo(todo.id));

  const todoElem = document.createElement("div");
  todoElem.classList.add("todo");
  todoElem.innerText = todo.content;

  const modiBtnElem = document.createElement("button");
  modiBtnElem.classList.add("modiBtn");
  //클릭 이벤트 발생시 해당 할 일 수정폼 열기
  modiBtnElem.addEventListener("click", (event) => modifyTodo(event, todo.id));
  modiBtnElem.appendChild(modiIcon);

  const delBtnElem = document.createElement("button");
  delBtnElem.classList.add("delBtn");
  //클릭 이벤트 발생시 해당 할 일 삭제하기
  delBtnElem.addEventListener("click", () => deleteTodo(todo.id));
  delBtnElem.appendChild(delIcon);

  //isCompleted를 이용해 완료된 항목에 checked class 추가
  if (todo.isCompleted) {
    todoItemElem.classList.add("checked");
    checkboxElem.innerText = "✔";
  }

  //appendChild를 이용해 todo-list 요소의 자식요소로 추가
  todoItemElem.appendChild(checkboxElem);
  todoItemElem.appendChild(todoElem);
  todoItemElem.appendChild(modiBtnElem);
  todoItemElem.appendChild(delBtnElem);

  todoListElem.appendChild(todoItemElem);
};

const clearCompletedTodos = () => {
  //todos 배열을 현재 완료되지 않은 할 일 리스트로 변경 -> 완료된 할 일들 제외한 새로운 배열
  const newTodos = getActiveTodos();
  setTodos(newTodos);

  //새로 렌더링
  paintTodos();
};

const init = () => {
  todoInputElem.addEventListener("keypress", (e) => {
    //enter 눌리면 appendTodos함수에 e.target.value를 넘기고 todoInputElem 초기화
    if (e.key === "Enter") {
      appendTodos(e.target.value);
      todoInputElem.value = "";
    }
  });

  //todo-top 버튼들 클릭이벤트
  showAllBtnElem.addEventListener("click", onClickShowTodosType);
  showActiveBtnElem.addEventListener("click", onClickShowTodosType);
  showCompletedBtnElem.addEventListener("click", onClickShowTodosType);
  clearCompletedBtnElem.addEventListener("click", clearCompletedTodos);

  // 전체 완료 처리 버튼에 클릭이벤트
  completeAllBtnElem.addEventListener("click", onClickCompleteAll);
  setLeftItems(); //남은 할 일 개수 표시
  loadToDoList();
  paintTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
};

init();
