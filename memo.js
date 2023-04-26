let allMemo = JSON.parse(localStorage.getItem("allMemo"));
allMemo = allMemo ?? [];

const Editor = toastui.Editor;

const editor = new Editor({
    el: document.querySelector("#editor"),
    height: "500px",
    initialEditType: "markdown",
    previewStyle: "vertical",
    hideModeSwitch: "true", // wysiwyg, markdown 변경 버튼 숨김
    placeholder: "내용을 입력해주세요.",
});

render(); // render 가 있어야 새로고침 시 저장 내용들이 불러와져있음

function saveNote() {
    const title = document.getElementById("title").value;
    const content = editor.getHTML();
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date = new Date().getDate();

    allMemo.push({
        title,
        content,
        len: allMemo.length,
        year,
        month,
        date
    });
    localStorage.setItem("allMemo", JSON.stringify(allMemo));
    render();
}

function reset() {
    const title = document.querySelector('#title');
    const editor = document.querySelector('.ProseMirror');

    title.value = ""
    while (editor.hasChildNodes()) {
        editor.removeChild(editor.firstChild);
    }
}

function render() {
    const display = document.getElementById("display");
    display.innerHTML = "";

    for (const item of allMemo) {
        const wrapDiv = document.createElement("div");
        const contentDiv = document.createElement("div");
        const saveTitle = document.createElement("h2");
        const saveContent = document.createElement("div");
        const saveDate = document.createElement("span");
        const deleteMemoBtn = document.createElement("button");

        contentDiv.classList.add('contentDiv')
        saveTitle.textContent = item.title;
        saveContent.innerHTML = item.content;
        saveDate.textContent = `${item.year}년 ${item.month}월 ${item.date}일`;
        deleteMemoBtn.textContent = "삭제";
        deleteMemoBtn.classList.add('btn');
        deleteMemoBtn.setAttribute("id", item.len);
        deleteMemoBtn.setAttribute("onclick", "remove()");

        display.appendChild(wrapDiv);
        wrapDiv.appendChild(contentDiv);
        contentDiv.appendChild(saveTitle);
        contentDiv.appendChild(saveDate);
        contentDiv.appendChild(saveContent);
        wrapDiv.appendChild(deleteMemoBtn);
    }
    reset();
}

function remove() {
    const idx = allMemo.find((item) => item.len == event.srcElement.id);
    if (idx) {
        allMemo.splice(allMemo.findIndex((item) => item.len == idx.len), 1);
    }
    localStorage.setItem("allMemo", JSON.stringify(allMemo));
    render();
}

function resetConfirm() {
    if (confirm('초기화 하시겠습니까?')) {
        reset();
    }
}

// 삭제 버튼 부분 구현 하다가 실패
function deleteConfirm() {
    if (confirm('삭제 하시겠습니까?')) {
        remove();
    }
}

// 다크 모드 구현
function darkMode() {
    let body = document.body;
    body.classList.toggle('darkMode');
    const editor = document.querySelector('.ProseMirror');
    const title = document.querySelector('#title');
    const popupBody = document.querySelector('.toastui-editor-popup-body');
    const editorContents = document.querySelector('.toastui-editor-contents p');

    if (body.classList.contains('darkMode')) {
        editor.style.color = '#fff';
        title.style.background = 'rgb(65, 65, 65)';
        title.style.color = '#fff';
        popupBody.style.color = 'black';
        editorContents.style.color = '#fff';
    } else {
        editor.style.color = 'black';
        title.style.background = '#f3f3f3';
        title.style.color = 'black';
        toolBar.style.background = '#f7f9fc';
    }
}

// 날짜 구현
const $year = document.querySelector('.year');
const $month = document.querySelector('.month');
const $date = document.querySelector('.date');

let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let date = new Date().getDate();

$year.textContent = `${year}년`;
$month.textContent = `${month}월`;
$date.textContent = `${date}일`;