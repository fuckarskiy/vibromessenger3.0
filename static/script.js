let userId, username, avatar;

// ===== AUTH STEP1 =====
document.getElementById("next1").onclick = async()=>{
  let name=document.getElementById("username").value;
  localStorage.setItem("temp_username",name);
  document.getElementById("step1").style.display="none";
  document.getElementById("step2").style.display="block";
};

// ===== AUTH STEP2 =====
document.getElementById("next2").onclick = async()=>{
  let name=localStorage.getItem("temp_username");
  let pwd=document.getElementById("password").value;
  let res=await fetch("/register_step2",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:name,password:pwd})});
  if(!res.ok) res=await fetch("/login_step2",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:name,password:pwd})});
  let data=await res.json();
  if(data.error) return alert("Ошибка регистрации/логина");
  userId=data.user_id; username=data.username; avatar=data.avatar;
  showMain();
};

// ===== SHOW MAIN =====
function showMain(){
  document.getElementById("auth").style.display="none";
  document.getElementById("main").style.display="flex";
  loadUsers();
  loadGroups();
}

// ===== LOAD USERS =====
async function loadUsers(){
  let res=await fetch("/search?q=");
  let users=await res.json();
  let ul=document.getElementById("users-list"); ul.innerHTML="";
  users.forEach(u=>{let b=document.createElement("button");b.textContent=u.username;ul.appendChild(b);});
}

// ===== LOAD GROUPS =====
async function loadGroups(){
  let gl=document.getElementById("groups-list"); gl.innerHTML="";
  document.getElementById("create-group-btn").onclick=async()=>{
    let gname=prompt("Название группы:");
    if(!gname) return;
    await fetch("/group/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:gname,owner:userId})});
    loadGroups();
  };
}

// ===== SEND MESSAGE =====
document.getElementById("send-msg").onclick=async()=>{
  let msg=document.getElementById("msg-input").value;
  if(!msg) return;
  await fetch("/dm/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from:userId,to:userId,msg:msg})});
  document.getElementById("messages").innerHTML+="<div>"+msg+"</div>";
  document.getElementById("msg-input").value="";
}

// ===== PROFILE =====
document.getElementById("profile-btn").onclick=()=>{
  document.getElementById("main").style.display="none";
  document.getElementById("profile").style.display="block";
  document.getElementById("profile-username").value=username;
  document.getElementById("profile-avatar").value=avatar || "";
  document.getElementById("profile-img").src=avatar || "";
};

document.getElementById("save-profile").onclick=async()=>{
  let uname=document.getElementById("profile-username").value;
  let avat=document.getElementById("profile-avatar").value;
  await fetch("/profile/update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:userId,username:uname,avatar:avat})});
  username=uname; avatar=avat;
  document.getElementById("profile-img").src=avatar;
  document.getElementById("profile").style.display="none";
  document.getElementById("main").style.display="flex";
};
