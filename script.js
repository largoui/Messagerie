let msgs = [];
const microServiceURL = process.env.MICRO_SERVICE_URL;

const submit = () => {
  const msgInput = document.getElementById("msgInput");
  const newMsg = msgInput.value;
  fetch(microServiceURL + '/msg/post/' + newMsg)
    .then(() => {
      msgInput.value = "";
      initMsgs()
    })
}

const initMsgs = () => {
  fetch(microServiceURL + '/msg/getAll')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      msgs = data.msgs;
      const msgList = document.getElementById("msgsList");
      msgList.innerHTML = "";
      for (let i = 0; i < msgs.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = msgs[i];
        msgList.appendChild(li);
      }
    });
}

const openForm = () => {
  document.getElementById('popupForm').classList.add('show');
}

const closeForm = () => {
  document.getElementById('popupForm').classList.remove('show');
}

const saveUsername = () => {
  const newUsername = document.getElementById('usernameInput').value;
  console.log('New username:', newUsername);
  closeForm();
}
