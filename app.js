(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORAGE_KEY = "shivani-blooms-data-v1";
  const COLORS = ["#c8e4f5","#f5cbd4","#f8dfbb","#d8c9ef","#f7cbd1","#f8e0ac","#cde8d2","#f2d5c1"];
  const quotes = [
    "Small steps, taken with love, can change an ordinary day.",
    "You don't have to do it all. You just have to begin.",
    "Progress blooms quietly, one little choice at a time.",
    "Give yourself the same kindness you give to everyone else.",
    "A slow day is still a day you showed up for yourself.",
    "Consistency isn't perfection. It's coming back with care.",
    "You are allowed to grow at your own pace.",
    "Make room for the things that make you feel like you."
  ];
  const todayISO = () => {
    const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const dateKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const parseDate = key => { const [y,m,d]=key.split("-").map(Number); return new Date(y,m-1,d); };
  const pretty = d => d.toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"short",year:"numeric"});
  const monthName = d => d.toLocaleDateString(undefined,{month:"long",year:"numeric"});
  const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const defaultData = () => ({
    version:1, profilePhoto:"", quoteIndex:0,
    habits:[
      {id:"wake6",name:"Wake up at 6 AM",icon:"🌅",category:"Morning Routine",goal:"Start the day gently",active:true,color:0},
      {id:"oilpull",name:"Oil pulling",icon:"🪥",category:"Health & Wellness",goal:"10 minutes",active:true,color:1},
      {id:"walk10",name:"Morning walk",icon:"🚶🏻‍♀️",category:"Movement",goal:"10 minutes",active:true,color:2},
      {id:"yoga",name:"Yoga",icon:"🧘🏻‍♀️",category:"Movement",goal:"A little time for yourself",active:true,color:3},
      {id:"homemeals",name:"All home meals",icon:"🥗",category:"Food & Nourishment",goal:"Enjoy home-cooked meals",active:true,color:4},
      {id:"read",name:"Read a book",icon:"📚",category:"Personal Growth",goal:"Even a few pages count",active:true,color:5}
    ], entries:{}, todos:{}
  });
  let data;
  try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData(); } catch { data=defaultData(); }
  if(!data.habits || !data.entries) data=defaultData();
  let currentView="home", selectedMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1), selectedDate=todayISO(), editingId=null, toastTimer;
  const entryFor = key => data.entries[key] || (data.entries[key]={habits:{},mood:"",note:""});
  const activeHabits = () => data.habits.filter(h=>h.active);
  const isDone = (key,id) => !!(data.entries[key] && data.entries[key].habits && data.entries[key].habits[id]);
  const save = () => { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); } catch(e) { showToast("Couldn't save — device storage may be full."); } };
  const showToast = msg => { const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),2400); };
  const dateHeading = key => parseDate(key).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"short"});
  const completion = key => { const hs=data.habits.filter(h=>h.active); const done=hs.filter(h=>isDone(key,h.id)).length; return {done,total:hs.length,pct:hs.length?Math.round(done/hs.length*100):0}; };
  const iconColor = h => ["blue","", "gold","lavender","", "green"][h.color%6] || "";
  function renderDate(){
    const now=new Date(),hour=now.getHours();
    const greeting=hour>=5&&hour<12?"Good morning,":hour>=12&&hour<17?"Good afternoon,":hour>=17&&hour<21?"Good evening,":"Good night,";
    $("#prettyDate").textContent=pretty(now);
    const greetingEl=$("#timeGreeting");if(greetingEl)greetingEl.textContent=greeting;
  }
  function renderQuote(){
    const q=quotes[data.quoteIndex%quotes.length];
    $("#heroQuote").textContent=q; $("#progressQuote").textContent=q;
  }
  function renderDP(){
    const url=data.profilePhoto;
    [$("#dpPreview"),$("#profileAvatar")].forEach(el=>{
      if(!el)return;
      if(url){el.style.backgroundImage=`url("${url}")`;el.textContent="";} else {el.style.backgroundImage="";el.textContent="S";}
    });
  }
  function renderHome(){
    const c=completion(todayISO());
    $("#completedCount").textContent=c.done; $("#totalCount").textContent=c.total; $("#completionPct").textContent=c.pct+"%"; $("#progressFill").style.width=c.pct+"%";
    $("#progressMessage").textContent=c.pct===100&&c.total?"You showed up for yourself today. Let that feel good.":c.done?`${c.done} little ${c.done===1?"win":"wins"} so far. Keep going at your own pace.`:"Every small step counts. Pick one to begin.";
    $("#todayHabits").innerHTML=activeHabits().map(h=>habitHTML(h,todayISO())).join("") || emptyState("No habits yet","Add a habit that feels meaningful to you.");
    const todos=data.todos[todayISO()]||[];
    $("#todoSummary").textContent=`${todos.filter(t=>t.done).length} of ${todos.length} done`;
    $("#todoList").innerHTML=todos.map((t,i)=>`<div class="todo-item ${t.done?"done":""}"><button class="check-button ${t.done?"checked":""}" data-todo-check="${i}" aria-label="${t.done?"Mark incomplete":"Complete"} to-do">${t.done?"✓":""}</button><span class="todo-text">${escapeHTML(t.text)}</span><button class="todo-delete" data-todo-delete="${i}" aria-label="Delete to-do">×</button></div>`).join("");
    const mood=data.entries[todayISO()]?.mood||"";
    $$("#moodOptions button").forEach(b=>b.classList.toggle("selected",b.dataset.mood===mood));
    $("#moodNote").textContent=mood?`Today you're feeling: ${mood}. Thank you for checking in with yourself.`:"Whatever you're feeling, there's room for it here.";
  }
  function habitHTML(h,key){
    const done=isDone(key,h.id);
    return `<div class="habit-row" data-habit-row="${escapeHTML(h.id)}" data-date="${key}"><span class="habit-icon ${iconColor(h)}">${escapeHTML(h.icon||"🌿")}</span><div class="habit-info"><strong>${escapeHTML(h.name)}</strong><small>${escapeHTML(h.goal||h.category||"One little step")}</small></div><button type="button" class="check-button ${done?"checked":""}" data-habit-check="${escapeHTML(h.id)}" data-date="${key}" aria-pressed="${done?"true":"false"}" aria-label="${done?"Mark incomplete":"Complete"} ${escapeHTML(h.name)}">${done?"✓":""}</button></div>`;
  }
  function emptyState(title,copy){return `<div class="card" style="text-align:center;padding:24px"><div style="font-size:27px;margin-bottom:8px">🌷</div><strong>${title}</strong><p class="muted">${copy}</p></div>`;}
  function renderManage(){
    $("#habitTotalLabel").textContent=`${data.habits.length} habit${data.habits.length===1?"":"s"}`;
    $("#manageHabitList").innerHTML=data.habits.map(h=>`<div class="manage-row ${h.active?"":"paused"}"><span class="habit-icon ${iconColor(h)}">${escapeHTML(h.icon||"🌿")}</span><div class="habit-info"><strong>${escapeHTML(h.name)}</strong><small>${escapeHTML(h.category)}${h.goal?" · "+escapeHTML(h.goal):""}${h.active?"":" · Paused"}</small></div><div class="manage-actions"><button data-edit="${h.id}">Edit</button><button data-pause="${h.id}">${h.active?"Pause":"Resume"}</button><button data-archive="${h.id}">Archive</button><button class="danger-action" data-delete-habit="${h.id}">Delete</button></div></div>`).join("") || emptyState("Your garden is waiting","Add your first habit above.");
  }
  function renderMonth(){
    $("#monthTitle").textContent=monthName(selectedMonth);
    const habits=activeHabits();
    $("#monthLegend").innerHTML=habits.map((h,i)=>`<span class="legend-chip"><span class="legend-dot" style="background:${COLORS[h.color%COLORS.length]}"></span>${escapeHTML(h.name)}</span>`).join("") || `<span class="muted">Add habits to start your monthly tracker.</span>`;
    const year=selectedMonth.getFullYear(),month=selectedMonth.getMonth(),days=new Date(year,month+1,0).getDate(),firstDay=new Date(year,month,1).getDay();
    const grid=$("#monthGrid"); grid.style.setProperty("--days",days);
    let html=`<div class="day-head">DAY</div>`;
    for(let d=1;d<=days;d++)html+=`<div class="day-head">${d}</div>`;
    for(let i=0;i<habits.length;i++){
      const h=habits[i]; html+=`<div class="day-num" title="${escapeHTML(h.name)}">${escapeHTML(h.icon)}</div>`;
      for(let d=1;d<=days;d++){
        const key=dateKey(new Date(year,month,d)),done=isDone(key,h.id),today=key===todayISO(),sel=key===selectedDate;
        html+=`<button class="month-cell ${done?"completed":""} ${today?"today":""} ${sel?"selected":""}" style="${done?`background:${COLORS[h.color%COLORS.length]}`:""}" data-select-date="${key}" data-month-habit="${h.id}" aria-label="${escapeHTML(h.name)}, ${dateHeading(key)}, ${done?"completed":"not completed"}">${done?"✓":"·"}</button>`;
      }
    }
    if(!habits.length){html=`<div class="day-head">DAY</div>`;for(let d=1;d<=days;d++)html+=`<div class="day-head">${d}</div>`;html+=`<div style="grid-column:1/-1;padding:25px;text-align:center;color:#9b8589;font-size:12px">Add a habit to see your monthly grid.</div>`;}
    grid.innerHTML=html;
    const total=habits.length*days;let done=0;for(let d=1;d<=days;d++)for(const h of habits)if(isDone(dateKey(new Date(year,month,d)),h.id))done++;
    $("#monthCompletion").textContent=`${total?Math.round(done/total*100):0}% this month`;
    const c=completion(selectedDate);$("#selectedDayTitle").textContent=selectedDate===todayISO()?"Today's check-ins":dateHeading(selectedDate);$("#selectedDaySummary").textContent=`${c.done}/${c.total} complete`;
    $("#selectedDayHabits").innerHTML=habits.map(h=>habitHTML(h,selectedDate)).join("")||emptyState("No active habits","Add or resume habits to start tracking.");
    $("#monthlyMessage").textContent=done?`You've checked off ${done} habit ${done===1?"moment":"moments"} this month. Every one counts.`:"A fresh page, full of possibilities. Start whenever you're ready.";
    $("#monthlyStats").innerHTML=`<div><strong>${done}</strong><small>little wins</small></div><div><strong>${habits.length}</strong><small>active habits</small></div><div><strong>${Math.round(done/Math.max(1,total)*100)}%</strong><small>consistency</small></div>`;
  }
  function renderProgress(){
    const d=selectedMonth,year=d.getFullYear(),month=d.getMonth(),days=new Date(year,month+1,0).getDate(),habits=activeHabits();
    let possible=0,done=0,daysLogged=0,best=0,bestDay="—";
    for(let n=1;n<=days;n++){const key=dateKey(new Date(year,month,n));let daily=0;for(const h of habits){possible++;if(isDone(key,h.id)){done++;daily++;}}if(daily)daysLogged++;if(daily>best){best=daily;bestDay=String(n);}}
    const pct=possible?Math.round(done/possible*100):0;
    $("#monthPct").textContent=pct+"%";$("#monthProgressFill").style.width=pct+"%";$("#activeHabitsStat").textContent=habits.length;$("#daysLoggedStat").textContent=daysLogged;$("#bestDayStat").textContent=bestDay;
    $("#habitStats").innerHTML=habits.map(h=>{let n=0;for(let day=1;day<=days;day++)if(isDone(dateKey(new Date(year,month,day)),h.id))n++;const p=Math.round(n/days*100);return `<div class="stat-habit"><span class="habit-icon ${iconColor(h)}">${escapeHTML(h.icon)}</span><div><strong>${escapeHTML(h.name)}</strong><small>${n} of ${days} days</small><div class="mini-track"><span style="width:${p}%;background:${COLORS[h.color%COLORS.length]}"></span></div></div><span class="stat-pct">${p}%</span></div>`;}).join("")||emptyState("Your progress starts here","Add a habit and check it off when you do it.");
  }
  function renderAll(){renderDate();renderQuote();renderDP();renderHome();renderManage();renderMonth();renderProgress();}
  function navigate(view){currentView=view;$$(".view").forEach(v=>v.classList.toggle("active",v.dataset.view===view));$$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.nav===view));window.scrollTo({top:0,behavior:"smooth"});if(view==="month")renderMonth();if(view==="progress")renderProgress();}
  function resetHabitForm(){editingId=null;$("#habitForm").reset();$("#habitActive").checked=true;$("#habitFormTitle").textContent="Plant a new habit";$("#habitSubmit").textContent="＋ Add habit";$("#cancelEdit").hidden=true;}
  function exportFile(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function exportJSON(){exportFile("shivani-blooms-backup-"+todayISO()+".json",JSON.stringify({...data,exportedAt:new Date().toISOString()},null,2),"application/json");showToast("Your backup is ready 🌷");}
  function exportCSV(){
    const rows=[["Date","Habit","Category","Completed","Mood","To-dos"]];
    Object.keys(data.entries).sort().forEach(key=>{const e=data.entries[key];data.habits.forEach(h=>rows.push([key,h.name,h.category,isDone(key,h.id)?"Yes":"No",e.mood||"", (data.todos[key]||[]).map(t=>t.text).join("; ")]));});
    const csv=rows.map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
    exportFile("shivani-blooms-history-"+todayISO()+".csv",csv,"text/csv;charset=utf-8");showToast("Your CSV is ready.");
  }
  function setPhoto(file){
    if(!file)return;if(!file.type.startsWith("image/")){showToast("Please choose an image file.");return;}
    const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const canvas=document.createElement("canvas"),max=500,scale=Math.min(1,max/Math.max(img.width,img.height));canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);data.profilePhoto=canvas.toDataURL("image/jpeg",.82);save();renderDP();showToast("Your photo is set 💗");};img.src=reader.result;};reader.readAsDataURL(file);
  }
  document.addEventListener("click",e=>{
    // Safari can occasionally report a non-Element target (for example, a text node).
    const clicked=e.target instanceof Element?e.target:e.target?.parentElement;
    if(!clicked)return;
    const nav=clicked.closest("[data-nav]");if(nav){navigate(nav.dataset.nav);return;}
    const go=clicked.closest("[data-go]");if(go){navigate(go.dataset.go);return;}
    const check=clicked.closest("[data-habit-check]");
    const habitRow=clicked.closest("[data-habit-row]");
    // Use the saved state as the source of truth, then explicitly sync the visible
    // check button after rerendering. This avoids a stale/blank checkbox on Safari.
    if(check || (habitRow && !clicked.closest("button"))){
      e.preventDefault();
      const target=check||habitRow;
      const key=target.dataset.date||todayISO();
      const id=check?check.dataset.habit:habitRow.dataset.habitRow;
      const entry=entryFor(key);
      const nextDone=!isDone(key,id);
      entry.habits[id]=nextDone;
      save();
      renderAll();
      // Explicit visual sync makes the checkmark visible immediately on touch devices.
      document.querySelectorAll("[data-habit-check]").forEach(button=>{
        if(button.dataset.habit===id && (button.dataset.date||todayISO())===key){
          button.classList.toggle("checked",nextDone);
          button.textContent=nextDone?"✓":"";
          button.setAttribute("aria-label",`${nextDone?"Mark incomplete":"Complete"} ${data.habits.find(h=>h.id===id)?.name||"habit"}`);
        }
      });
      showToast(nextDone?"A little win, just for you ✓":"Updated — it's your journey.");
      return;
    }
    const todoCheck=clicked.closest("[data-todo-check]");if(todoCheck){const list=data.todos[todayISO()]||[];list[Number(todoCheck.dataset.todoCheck)].done=!list[Number(todoCheck.dataset.todoCheck)].done;save();renderHome();return;}
    const todoDelete=clicked.closest("[data-todo-delete]");if(todoDelete){data.todos[todayISO()].splice(Number(todoDelete.dataset.todoDelete),1);save();renderHome();return;}
    const mood=clicked.closest("[data-mood]");if(mood){entryFor(todayISO()).mood=mood.dataset.mood;save();renderHome();showToast("Check-in saved. Be gentle with yourself.");return;}
    const edit=clicked.closest("[data-edit]");if(edit){const h=data.habits.find(x=>x.id===edit.dataset.edit);if(!h)return;editingId=h.id;$("#habitName").value=h.name;$("#habitCategory").value=h.category;$("#habitIcon").value=h.icon;$("#habitGoal").value=h.goal||"";$("#habitActive").checked=h.active;$("#habitFormTitle").textContent="Tend to this habit";$("#habitSubmit").textContent="Save changes";$("#cancelEdit").hidden=false;window.scrollTo({top:0,behavior:"smooth"});return;}
    const pause=clicked.closest("[data-pause]");if(pause){const h=data.habits.find(x=>x.id===pause.dataset.pause);h.active=!h.active;save();renderAll();showToast(h.active?"Habit resumed 🌱":"Habit paused — no pressure.");return;}
    const archive=clicked.closest("[data-archive]");if(archive){const h=data.habits.find(x=>x.id===archive.dataset.archive);if(confirm(`Archive “${h.name}”? Past check-ins will be kept.`)){h.active=false;h.archived=true;save();renderAll();showToast("Habit archived. Its history is kept.");}return;}
    const deleteHabit=clicked.closest("[data-delete-habit]");if(deleteHabit){const h=data.habits.find(x=>x.id===deleteHabit.dataset.deleteHabit);if(!h)return;if(confirm(`Delete “${h.name}”? This removes the habit from your list and monthly overview. Export a backup first if you want to keep its history.`)){data.habits=data.habits.filter(x=>x.id!==h.id);save();renderAll();showToast("Habit removed. Make room for what matters 🌱");}return;}
    const selectDate=clicked.closest("[data-select-date]");if(selectDate){selectedDate=selectDate.dataset.selectDate;renderMonth();return;}
  });
  $("#habitForm").addEventListener("submit",e=>{
    e.preventDefault();const name=$("#habitName").value.trim();if(!name)return;
    if(editingId){const h=data.habits.find(x=>x.id===editingId);Object.assign(h,{name,category:$("#habitCategory").value,icon:$("#habitIcon").value,goal:$("#habitGoal").value.trim(),active:$("#habitActive").checked});}
    else data.habits.push({id:"h-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,6),name,category:$("#habitCategory").value,icon:$("#habitIcon").value,goal:$("#habitGoal").value.trim(),active:$("#habitActive").checked,color:data.habits.length%COLORS.length});
    save();resetHabitForm();renderAll();showToast(editingId?"Habit updated 🌷":"A new habit planted 🌱");navigate("habits");
  });
  $("#cancelEdit").addEventListener("click",resetHabitForm);
  $("#todoForm").addEventListener("submit",e=>{e.preventDefault();const text=$("#todoInput").value.trim();if(!text)return;(data.todos[todayISO()]||(data.todos[todayISO()]=[])).push({text,done:false});$("#todoInput").value="";save();renderHome();showToast("Added to your little list.");});
  $("#quoteRefresh").addEventListener("click",()=>{data.quoteIndex=(data.quoteIndex+1)%quotes.length;save();renderQuote();showToast("A fresh little reminder for you 💌");});
  $("#settingsQuote").addEventListener("click",()=>{$("#quoteRefresh").click();});
  $("#dpButton").addEventListener("click",()=>$("#dpInput").click());$("#profileEdit").addEventListener("click",()=>$("#dpInput").click());$("#profilePhotoText").addEventListener("click",()=>$("#dpInput").click());
  $("#dpInput").addEventListener("change",e=>{setPhoto(e.target.files[0]);e.target.value="";});
  $("#prevMonth").addEventListener("click",()=>{selectedMonth=new Date(selectedMonth.getFullYear(),selectedMonth.getMonth()-1,1);renderMonth();renderProgress();});
  $("#nextMonth").addEventListener("click",()=>{selectedMonth=new Date(selectedMonth.getFullYear(),selectedMonth.getMonth()+1,1);renderMonth();renderProgress();});
  $("#exportJson").addEventListener("click",exportJSON);$("#backupSettings").addEventListener("click",exportJSON);$("#exportCsv").addEventListener("click",exportCSV);
  $("#importButton").addEventListener("click",()=>$("#importInput").click());
  $("#importInput").addEventListener("change",e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const imported=JSON.parse(reader.result);if(!imported||!Array.isArray(imported.habits)||!imported.entries||typeof imported.entries!=="object")throw new Error("Invalid backup");if(confirm("Restore this backup? It will replace the data saved in this browser.")){data={version:1,profilePhoto:imported.profilePhoto||"",quoteIndex:imported.quoteIndex||0,habits:imported.habits,entries:imported.entries,todos:imported.todos||{}};save();renderAll();showToast("Backup restored successfully.");}}catch(err){showToast("That file doesn't look like a valid Shivani Blooms backup.");}e.target.value="";};reader.readAsText(file);});
  // Service workers only run on HTTPS or localhost.
  if("serviceWorker" in navigator && location.protocol!=="file:") window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
  renderAll();
  // Refresh the greeting if the app stays open across a time-of-day boundary.
  setInterval(renderDate,60*1000);
})();