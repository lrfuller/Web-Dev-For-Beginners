let state = Object.freeze({
  account: null,
});
const ACCOUNTS_API = "//localhost:5000/api/accounts/";
const storageKey = "savedAccount";

function updateElement(id, textOrNode) {
  const element = document.getElementById(id);
  // console.log(element);
  element.textContent = ""; // Removes all children
  element.append(textOrNode);
}

const routes = {
  "/login": { templateId: "login" },
  "/dashboard": { templateId: "dashboard", init: refresh },
  "/profile": { templateId: "profile" },
};

// navigation
function navigate(path) {
  window.history.pushState({}, path, path);
  updateRoute();
}

function onLinkClick(event) {
  event.preventDefault();
  navigate(event.target.href);
}

function updateRoute() {
  const path = window.location.pathname;
  const route = routes[path];

  if (!route) {
    // return navigate("index.html");
    // setTimeout(() => {
    return navigate("/login");
    // }, 1000);
  }

  const template = document.getElementById(route.templateId);
  const view = template.content.cloneNode(true);
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(view);
  // document.getElementById("appTitle").innerHTML = route.templateId;
  document.title = route.templateId;
  if (typeof route.init === "function") {
    route.init();
  }
}
// updateRoute("login");
// window.onpopstate = () => updateRoute();

//REGISTRATION

async function createAccount(account) {
  try {
    const response = await fetch(ACCOUNTS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: account,
    });
    return await response.json();
  } catch (error) {
    return { error: error.message || "Unknown error" };
  }
}

async function register() {
  const registerForm = document.getElementById("registerForm");
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);
  const jsonData = JSON.stringify(data);
  const result = await createAccount(jsonData);

  if (result.error) {
    return updateElement("registrationError", result.error);
  }

  console.log("Account created!", result);
  updateState("account", result);
  navigate("/dashboard");
}

//LOGIN

async function getAccount(user) {
  try {
    const response = await fetch(ACCOUNTS_API + encodeURIComponent(user));
    return await response.json();
  } catch (error) {
    return { error: error.message || "Unknown error" };
  }
}

async function login() {
  const loginForm = document.getElementById("loginForm");
  const user = loginForm.user.value;
  const data = await getAccount(user);

  if (data.error) {
    return updateElement("loginError", data.error);
  }

  updateState("account", data);
  navigate("/dashboard");
}

function createTransactionRow(transaction) {
  const template = document.getElementById("transaction");
  const transactionRow = template.content.cloneNode(true);
  const tr = transactionRow.querySelector("tr");
  tr.children[0].textContent = transaction.date;
  tr.children[1].textContent = transaction.object;
  tr.children[2].textContent = transaction.amount.toFixed(2);
  tr.setAttribute("id", "transaction");
  return transactionRow;
}

function updateDashboard() {
  const account = state.account;
  if (!account) {
    return logout();
  }
  const transactionsRows = document.createDocumentFragment();
  for (const transaction of account.transactions) {
    const transactionRow = createTransactionRow(transaction);
    transactionsRows.appendChild(transactionRow);
  }
  updateElement("transactions", transactionsRows);
  console.log(account);
  updateElement("description", account.description);
  updateElement("balance", account.balance.toFixed(2));
  updateElement("currency", account.currency);
}

function logout() {
  updateState("account", null);
  navigate("/login");
}

function updateState(property, newData) {
  state = Object.freeze({
    ...state,
    [property]: newData,
  });
  localStorage.setItem(storageKey, JSON.stringify(state.account));
}

function init() {
  const savedAccount = localStorage.getItem(storageKey);
  if (savedAccount) {
    updateState("account", JSON.parse(savedAccount));
  }

  // Our previous initialization code
  window.onpopstate = () => updateRoute();
  updateRoute();
}

init();

async function updateAccountData() {
  const account = state.account;
  if (!account) {
    return logout();
  }

  const data = await getAccount(account.user);
  if (data.error) {
    return logout();
  }

  updateState("account", data);
}

async function refresh() {
  await updateAccountData();
  updateDashboard();
}

async function addTransaction(event) {
  event.preventDefault();
  const transactionForm = document.getElementById("transactionForm");
  const formData = new FormData(transactionForm);
  const data = Object.fromEntries(formData);
  const jsonData = JSON.stringify(data);
  const result = await postTransaction(jsonData);

  if (result.error) {
    return updateElement("registrationError", result.error);
  }

  console.log("transaction Added!", result);
  updateState("account", result);
  // navigate("/dashboard");
}

async function postTransaction(transaction) {
  try {
    const response = await fetch(
      "//localhost:5000/api/accounts/" + state.account.user + "/transactions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: transaction,
      }
    );
    const transactionList = document.querySelectorAll("[id=transaction]");
    const lastTransaction = transactionList[transactionList.length - 1];
    const parsedTransaction = JSON.parse(transaction);
    let tr = document.createElement("tr");
    tr.setAttribute("class", "table-info");
    let td1 = document.createElement("td");
    td1.setAttribute("class", "table-info");
    td1.innerText = parsedTransaction.date;

    let td2 = document.createElement("td");
    td2.setAttribute("class", "table-info");
    td2.innerText = parsedTransaction.object;

    let td3 = document.createElement("td");
    td3.setAttribute("class", "table-info");
    td3.innerText = Number.parseInt(parsedTransaction.amount).toFixed(2);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    lastTransaction.after(tr);

    document.getElementById("transactionForm").reset();

    return await response.json();
  } catch (error) {
    return { error: error.message || "Unknown error" };
  }
}
