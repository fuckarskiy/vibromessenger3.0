let currentUser = "";

// STEP 1 → STEP 2
document.getElementById("nextBtn").onclick = () => {
  const u = document.getElementById("username").value.trim();
  if(!u){ alert("Введите имя"); return; }
  currentUser = u;
  document.getElementById("step1").classList.remove("active");
  document.getElementById("step2").classList.add("active");
}

// STEP 2 → CHAT MENU
document.getElementById("confirmBtn").onclick = async () => {
  const p = document.getElementById("password").value.trim();
  if(!p){ alert("Введите пароль"); return; }

  // Регистрация
  let res = await fetch("/register", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:currentUser,password:p})
  });
  let data = await res.json();

  // Если пользователь существует → логин
  if(data.error){
    res = await fetch("/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:currentUser,password:p})
    });
    data = await res.json();
  }

  if(data.ok){
    document.getElementById("step2").classList.remove("active");
    document.getElementById("chatMenu").classList.add("active");
    loadProfile();
  } else {
    alert("Неверные данные");
  }
}

// Профиль
document.getElementById("profileBtn").onclick = () => {
  document.getElementById("chatMenu").classList.remove("active");
  document.getElementById("profileMenu").classList.add("active");
}

// Назад в чат
document.getElementById("backChat").onclick = () => {
  document.getElementById("profileMenu").classList.remove("active");
  document.getElementById("chatMenu").classList.add("active");
}

// Загрузка профиля
async function loadProfile(){
  const r = await fetch("/profile");
  const d = await r.json();
  document.getElementById("userLabel").innerText = d.username;
  document.getElementById("avatar").src = d.avatar || "static/avatars/default.png";
}

// Загрузка аватарки
document.getElementById("updateAvatar").onclick = async () => {
  const f = document.getElementById("avatarFile").files[0];
  if(!f){ alert("Выберите файл"); return; }
  const form = new FormData();
  form.append("avatar", f);
  const r = await fetch("/profile/avatar",{method:"POST",body:form});
  const d = await r.json();
  if(d.ok){ document.getElementById("avatar").src=d.avatar; }
}
