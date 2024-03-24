let msgs = [];
const microServiceURL = "https://messagerie-back.onrender.com";

let savedUsername;
let savedUserId;

document.addEventListener('DOMContentLoaded', () => {
  savedUsername = localStorage.getItem('message-board-username');
  savedUserId = localStorage.getItem('message-board-user-id');
  updateWelcomeMessage();
});

document.getElementById('image').addEventListener('change', function() {
  if (this.files && this.files.length > 0) {
    handleImageUpload(this.files[0].name);
  } else {
    handleImageNotUpload();
  }
});

const handleImageUpload = (fileName) => {
  const uploadButton = document.getElementById('upload-button');
  uploadButton.title = fileName;
  uploadButton.classList.add('active');
}

const handleImageNotUpload = () => {
  const uploadButton = document.getElementById('upload-button');
  uploadButton.title = "No Images";
  uploadButton.classList.remove('active');
}

const submit = () => {
  if (!savedUsername || !savedUserId) {
    openForm();
    return;
  }

  const msgInput = document.getElementById('msgInput');
  const newMessage = msgInput.value.trim();
  const imageFile = document.getElementById("image").files[0];

  if (newMessage === '' && !imageFile) {
    return;
  }

  const data = new FormData();
  data.append("user", savedUserId);
  if (newMessage !== '') {
    data.append("msg", newMessage);
  }
  if (imageFile) {
    data.append("img", imageFile);
  }

  fetch(microServiceURL + '/msg/post/',
    {
      method: "POST",
      body: data,
    })
    .then(response => response.json()).then(data => {
      if (data.code === -1) {
        openForm();
        return;
      }
      document.getElementById("msgInput").value = "";
      document.getElementById("image").value = "";
      handleImageNotUpload();
      initMsgs();
    })
}

const initMsgs = () => {
  fetch(microServiceURL + '/msg/getAll')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      msgs = data.msgs;
      console.log(msgs);
      const msgList = document.getElementById("msgsList");
      msgList.innerHTML = "";
      for (let i = 0; i < msgs.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = `<p>${msgs[i].user}: ${msgs[i].msg ?? ""}</p>`;
        if (msgs[i].img) {
          li.innerHTML += `<img src="${microServiceURL + '/' + msgs[i].img}" width="100px" height="100px" />`;
        }
        msgList.appendChild(li);
      }
    });
}

const saveUsername = () => {
  startPopupLoading();

  const usernameInput = document.getElementById("usernameInput");
  const newUsername = usernameInput.value.trim();

  if (newUsername === "") {
    handleUsernameError("Please enter a username");
    return;
  }

  const newUserId = savedUserId ? savedUserId : crypto.randomUUID();
  const endpoint = microServiceURL + '/user/' + newUserId + '/' + newUsername;

  fetch(endpoint).then(response => {
    handleUsernameResponse(response, savedUserId, newUsername);
  }).catch(error => {
    handleUsernameError("Failed to update username");
  });
}

const handleUsernameError = (error) => {
  stopPopupLoading();
  alert(error);
}

const handleUsernameResponse = (response, newUserId, newUsername) => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  localStorage.setItem('message-board-user-id', newUserId);
  localStorage.setItem('message-board-username', newUsername);
  savedUsername = newUsername;
  savedUserId = newUserId;
  stopPopupLoading();
  initMsgs();
  closeForm();
}

const openForm = () => {
  if (savedUsername) {
    document.getElementById("usernameInput").value = savedUsername;
  } else {
    document.getElementById("usernameInput").value = "";
  }
  document.getElementById('popup').classList.add('show');
  document.body.classList.add('noScroll');
}

const closeForm = () => {
  document.getElementById('popup').classList.remove('show');
  document.body.classList.remove('noScroll');
  updateWelcomeMessage();
}

const startPopupLoading = () => {
  document.getElementById('popup-loader').classList.add('show');
  document.getElementById('popup-content').classList.add('hide');
}

const stopPopupLoading = () => {
  document.getElementById('popup-loader').classList.remove('show');
  document.getElementById('popup-content').classList.remove('hide');
}

const updateWelcomeMessage = () => {
  const welcomeMsg = document.getElementById("welcome-msg");
  if (savedUsername) {
    welcomeMsg.innerText = "Welcome " + savedUsername;
  } else {
    welcomeMsg.innerText = "Welcome Guest";
  }
}