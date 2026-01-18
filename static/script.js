let currentUser = "";

// Step 1 → Step 2
document.getElementById("nextBtn").onclick = () => {
  const u = document.getElementById("username").value.trim();
  if(!u){ alert("Введите имя или номер"); return; }
  currentUser = u;
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
}

// Step 2 → Главное меню
document.getElementById("confirmBtn").onclick = async () => {
  const p = document.getElementById("password").value.trim();
  if(!p){ alert("Введите пароль"); return; }

  let res = await fetch("/register", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:currentUser, password:p})
  });
  let data = await res.json();

  if(data.error){
    res = await fetch("/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:currentUser, password:p})
    });
    data = await res.json();
  }

  if(data.ok){
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("main").classList.remove("hidden");
    loadProfile();
  } else { alert("Неверные данные"); }
}

// Загрузка профиля
async function loadProfile(){
  const r = await fetch("/profile");
  const d = await r.json();
  document.getElementById("userLabel").innerText = d.username;
  document.getElementById("avatar").src = d.avatar || "static/avatars/default.png";
}

// Гамбургер меню
document.getElementById("menuBtn").onclick = () => {
  const sb = document.getElementById("sidebar");
  sb.classList.toggle("hidden");
}

// Обновление аватарки
document.getElementById("updateAvatar").onclick = async () => {
  const f = document.getElementById("avatarFile").files[0];
  if(!f){ alert("Выберите файл"); return; }
  const form = new FormData();
  form.append("avatar", f);
  const r = await fetch("/profile/avatar",{method:"POST",body:form});
  const d = await r.json();
  if(d.ok){ document.getElementById("avatar").src=d.avatar; }
}
