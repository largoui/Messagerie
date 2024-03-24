let msgs = [];
const microServiceURL = "https://92483300-5e27-4233-a35f-5078784882c8-00-2otbkjxnxr9oz.picard.replit.dev"

const submit = () => {
  const newMsg = document.querySelector('.input-msg').value;
  fetch(microServiceURL + '/msg/post/' + newMsg)
    .then(() => {
      document.querySelector('.input-msg').value = "";
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
      const msgList = document.querySelector(".msg-list");
      msgList.innerHTML = "";
      for (var i = 0; i < msgs.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = msgs[i];
        msgList.appendChild(li);
      }
    });
}

// const fact = (n) => {
//   let result = 1;
//   for (let i = 1; i <= n; ++i) {
//     result *= i;
//   }
//   return result
// }

// console.log(fact(6))

// const applique = (f, tab) => {
//   const result = [];
//   for (let i = 0; i < tab.length; ++i) {
//     result.push(f(tab[i]));
//   }
//   return result
// }

// console.log(applique(fact, [1, 2, 3, 4, 5, 6]))
// console.log(applique(function(n) { return (n + 1); }, [1, 2, 3, 4, 5, 6]));