let account = null;
const ACCOUNTS_API = "//localhost:5000/api/accounts/";

function updateElement(id, textOrNode) {
  const element = document.getElementById(id);
  // console.log(element);
  element.textContent = ""; // Removes all children
  element.append(textOrNode);
}

const routes = {
  "/login": { templateId: "login" },
  "/dashboard": { templateId: "dashboard", init: updateDashboard },
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
    return navigate("/login");
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
updateRoute("login");
window.onpopstate = () => updateRoute();

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
  account = result;
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

  account = data;
  navigate("/dashboard");
}

function createTransactionRow(transaction) {
  const template = document.getElementById("transaction");
  const transactionRow = template.content.cloneNode(true);
  const tr = transactionRow.querySelector("tr");
  tr.children[0].textContent = transaction.date;
  tr.children[1].textContent = transaction.object;
  tr.children[2].textContent = transaction.amount.toFixed(2);
  return transactionRow;
}

function updateDashboard() {
  if (!account) {
    return navigate("/login");
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
