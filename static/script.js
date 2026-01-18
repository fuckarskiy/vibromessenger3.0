let currentUser = "";
let currentUserId = null;

document.addEventListener("DOMContentLoaded", ()=>{

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
      afterLogin();
    } else {
      alert("Неверные данные");
    }
  }

  async function afterLogin(){
    const r = await fetch("/profile");
    const d = await r.json();
    currentUserId = d.username;
    document.getElementById("userLabel").innerText = d.username;
    document.getElementById("avatar").src = d.avatar || "static/avatars/default.png";

    loadUsers();
  }

  async function loadUsers(){
    const r = await fetch("/search?q=");
    const users = await r.json();
    const sel = document.getElementById("userSelect");
    sel.innerHTML = <option value="">Выберите пользователя</option>;
    users.forEach(u => {
      if(u !== currentUser){
        const opt = document.createElement("option");
        opt.value = u;
        opt.textContent = u;
        sel.appendChild(opt);
      }
    });
  }

  document.getElementById("sendBtn").onclick = async () => {
    const msg = document.getElementById("msgInput").value.trim();
    const to = document.getElementById("userSelect").value;
    if(!msg || !to){ alert("Выберите пользователя и напишите сообщение"); return; }

    const r = await fetch("/dm/send", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({to:to,text:msg})
    });
    const d = await r.json();
    if(d.ok){
      document.getElementById("msgInput").value = "";
      loadDM(to);
    }
  }

  async function loadDM(to){
    if(!to) return;
    const r = await fetch(`/dm/history?with=${to}`);
    const messages = await r.json();
    const msgDiv = document.getElementById("messages");
    msgDiv.innerHTML = "";
    messages.forEach(m => {
      const div = document.createElement("div");
      div.textContent = ${m.sender==currentUser ? "Вы" : m.sender}: ${m.text};
      div.className = m.sender==currentUser ? "me" : "other";
      msgDiv.appendChild(div);
    });
  }

  // Профиль
  document.getElementById("profileBtn").onclick = () => {
    document.getElementById("chatMenu").classList.remove("active");
    document.getElementById("profileMenu").classList.add("active");
  }

  document.getElementById("backChat").onclick = () => {
    document.getElementById("profileMenu").classList.remove("active");
    document.getElementById("chatMenu").classList.add("active");
  }

  document.getElementById("updateAvatar").onclick = async () => {
    const f = document.getElementById("avatarFile").files[0];
    if(!f){ alert("Выберите файл"); return; }
    const form = new FormData();
    form.append("avatar", f);
    const r = await fetch("/profile/avatar",{method:"POST",body:form});
    const d = await r.json();
    if(d.ok){ document.getElementById("avatar").src=d.avatar; }
  }

});
