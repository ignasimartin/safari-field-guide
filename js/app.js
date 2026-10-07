(function(){
  var root=document.documentElement;
  // theme
  try{var s=localStorage.getItem("sfg-theme"); if(s) root.setAttribute("data-theme",s);}catch(e){}
  document.getElementById("theme").addEventListener("click",function(){
    var cur=root.getAttribute("data-theme");
    var dark=cur? cur==="dark" : matchMedia("(prefers-color-scheme:dark)").matches;
    var next=dark?"light":"dark"; root.setAttribute("data-theme",next);
    try{localStorage.setItem("sfg-theme",next);}catch(e){}
  });

  function slug(s){return (s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
  var cards=[].slice.call(document.querySelectorAll(".card"));

  // ---- seen state ----
  var SEEN_KEY="sfg-seen-v1", seen={};
  try{seen=JSON.parse(localStorage.getItem(SEEN_KEY)||"{}")||{};}catch(e){seen={};}
  function saveSeen(){try{localStorage.setItem(SEEN_KEY,JSON.stringify(seen));}catch(e){}}

  // ---- photo store (IndexedDB) ----
  var db=null, DB_NAME="sfg-photos", STORE="photos";
  function openDB(){return new Promise(function(res){try{
    var rq=indexedDB.open(DB_NAME,1);
    rq.onupgradeneeded=function(){try{rq.result.createObjectStore(STORE);}catch(e){}};
    rq.onsuccess=function(){res(rq.result);};
    rq.onerror=function(){res(null);};
  }catch(e){res(null);}});}
  function idbGet(k){return new Promise(function(res){if(!db)return res(null);try{
    var t=db.transaction(STORE,"readonly").objectStore(STORE).get(k);
    t.onsuccess=function(){res(t.result||null);}; t.onerror=function(){res(null);};
  }catch(e){res(null);}});}
  function idbSet(k,v){return new Promise(function(res){if(!db)return res(false);try{
    var t=db.transaction(STORE,"readwrite").objectStore(STORE).put(v,k);
    t.onsuccess=function(){res(true);}; t.onerror=function(){res(false);};
  }catch(e){res(false);}});}
  function idbDel(k){return new Promise(function(res){if(!db)return res(false);try{
    var t=db.transaction(STORE,"readwrite").objectStore(STORE).delete(k);
    t.onsuccess=function(){res(true);}; t.onerror=function(){res(false);};
  }catch(e){res(false);}});}

  // ---- progress ----
  var prog=document.getElementById("seenProg"), bar=document.getElementById("seenBar");
  function updateProgress(){
    var total=cards.length,n=0;
    cards.forEach(function(c){if(seen[c.dataset.key])n++;});
    if(prog) prog.textContent=n+" / "+total+" seen";
    if(bar) bar.style.width=(total?Math.round(n/total*100):0)+"%";
  }

  // ---- image downscale ----
  function resizeImage(file,cb){
    try{
      var img=new Image(), url=URL.createObjectURL(file);
      img.onload=function(){
        var max=1280,w=img.width,h=img.height,sc=Math.min(1,max/Math.max(w,h));
        var cw=Math.max(1,Math.round(w*sc)),ch=Math.max(1,Math.round(h*sc));
        var cv=document.createElement("canvas");cv.width=cw;cv.height=ch;
        cv.getContext("2d").drawImage(img,0,0,cw,ch);
        URL.revokeObjectURL(url);
        try{cb(cv.toDataURL("image/jpeg",0.82));}catch(e){cb(null);}
      };
      img.onerror=function(){URL.revokeObjectURL(url);cb(null);};
      img.src=url;
    }catch(e){cb(null);}
  }

  var CHECK='<svg viewBox="0 0 24 24" aria-hidden="true"><path class="tick" d="M5 12.5l4.5 4.5L19 7"/></svg>';
  var CAM='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>';
  var EYE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3.2"/></svg>';

  cards.forEach(function(card){
    var sci=(card.querySelector(".sci")||{}).textContent||"";
    var cname=(card.querySelector(".cname")||{}).textContent||"animal";
    var key=slug(sci)||slug(cname); card.dataset.key=key; card._key=key;
    var wrap=card.querySelector(".ill-wrap"), body=card.querySelector(".card-body");

    // Expedició layout: lift the species name and category tags onto the photo
    var namesEl=card.querySelector(".names");
    if(wrap&&namesEl&&namesEl.parentNode!==wrap){ wrap.appendChild(namesEl); }
    var tagsEl=card.querySelector(".tags");
    // tags stay in the body (shown below the photo, on the meta row)

    // seen toggle
    var btn=document.createElement("button");
    btn.type="button"; btn.className="seen-btn";
    btn.setAttribute("aria-pressed", seen[key]?"true":"false");
    btn.innerHTML=CHECK; btn.setAttribute("aria-label","Marcar com a vist");
    btn.addEventListener("click",function(){
      if(seen[key]) delete seen[key]; else seen[key]=1;
      var on=!!seen[key];
      btn.setAttribute("aria-pressed",on?"true":"false");
      card.classList.toggle("is-seen",on);
      saveSeen(); updateProgress(); apply();
    });
    wrap.appendChild(btn);
    card.classList.toggle("is-seen",!!seen[key]);

    // seen badge (hidden by CSS in this theme, kept for compatibility)
    var badge=document.createElement("span");
    badge.className="seen-badge"; badge.setAttribute("aria-hidden","true");
    badge.innerHTML='<svg viewBox="0 0 24 24"><path class="tick" d="M5 12.5l4.5 4.5L19 7"/></svg>';
    wrap.appendChild(badge);

    // user photo layer
    var pimg=document.createElement("img");
    pimg.className="user-photo"; pimg.alt="Your photo of "+cname; pimg.style.display="none";
    wrap.appendChild(pimg);
    var ptag=document.createElement("div"); ptag.className="photo-tag"; ptag.style.display="none";
    ptag.innerHTML='<span>Your photo</span><button type="button" class="photo-x" aria-label="Remove your photo">&times;</button>';
    wrap.appendChild(ptag);

    // add/replace control
    var addBtn=document.createElement("button");
    addBtn.type="button"; addBtn.className="addphoto"; addBtn.innerHTML=CAM+'<span>Add your photo</span>'; addBtn.title="Add your photo"; addBtn.setAttribute("aria-label","Add your photo");
    var file=document.createElement("input"); file.type="file"; file.accept="image/*"; file.style.display="none";
    var anchor=body.querySelector(".photolink"); if(anchor) anchor.parentNode.removeChild(anchor);
    var metarow=document.createElement("div"); metarow.className="metarow";
    if(tagsEl){ if(tagsEl.parentNode) tagsEl.parentNode.removeChild(tagsEl); metarow.appendChild(tagsEl); }
    metarow.appendChild(addBtn);
    var descEl=body.querySelector(".desc"); body.insertBefore(metarow, descEl);
    body.appendChild(file);

    function showPhoto(data){
      if(data){ pimg.src=data; pimg.style.display=""; ptag.style.display="";
        addBtn.querySelector("span").textContent="Replace photo"; addBtn.title="Replace photo"; addBtn.setAttribute("aria-label","Replace photo"); }
      else { pimg.removeAttribute("src"); pimg.style.display="none"; ptag.style.display="none";
        addBtn.querySelector("span").textContent="Add your photo"; addBtn.title="Add your photo"; addBtn.setAttribute("aria-label","Add your photo"); }
    }
    card._showPhoto=showPhoto;
    addBtn.addEventListener("click",function(){file.click();});
    file.addEventListener("change",function(){
      var f=file.files&&file.files[0]; if(!f){return;}
      addBtn.classList.add("busy");
      resizeImage(f,function(data){
        addBtn.classList.remove("busy");
        if(!data){alert("Sorry, that image couldn't be added.");return;}
        showPhoto(data);
        idbSet(key,data).then(function(ok){ if(!ok){try{alert("Photo shown for now, but this browser wouldn't save it for next time.");}catch(e){}} });
      });
      file.value="";
    });
    ptag.querySelector(".photo-x").addEventListener("click",function(){ showPhoto(null); idbDel(key); });
  });

  // ---- search + filters ----
  var q=document.getElementById("q"), empty=document.getElementById("empty");
  var chips=[].slice.call(document.querySelectorAll(".chip"));
  var segs=[].slice.call(document.querySelectorAll(".seg"));
  var filter="All", term="", seenMode="all";
  function apply(){
    var shown=0;
    cards.forEach(function(c){
      var cat=c.getAttribute("data-cat")||"", tg=c.getAttribute("data-tags")||"";
      var okF=filter==="All"||cat===filter||cat.indexOf(filter)===0||("|"+tg+"|").indexOf("|"+filter+"|")>-1;
      var okT=!term||(c.getAttribute("data-search")||"").indexOf(term)>-1;
      var isSeen=!!seen[c.dataset.key];
      var okS=seenMode==="all"||(seenMode==="seen"&&isSeen)||(seenMode==="unseen"&&!isSeen);
      var vis=okF&&okT&&okS; c.style.display=vis?"":"none"; if(vis) shown++;
    });
    document.querySelectorAll("section").forEach(function(sec){
      var any=[].slice.call(sec.querySelectorAll(".card")).some(function(c){return c.style.display!=="none";});
      sec.style.display=any?"":"none";
      var cnt=sec.querySelector("[data-count]");
      if(cnt) cnt.textContent=[].slice.call(sec.querySelectorAll(".card")).filter(function(c){return c.style.display!=="none";}).length;
    });
    empty.classList.toggle("show",shown===0);
    updateHeaders();
  }
  function updateHeaders(){
    var activeChip = chips.filter(function(c){return c.getAttribute("data-filter")===filter;})[0];
    var label = activeChip ? activeChip.textContent.trim() : null;
    document.querySelectorAll(".section-head h2").forEach(function(h2){
      var def = h2.getAttribute("data-default");
      h2.innerHTML = (filter==="All"||!label) ? def : label;
    });
  }
  q.addEventListener("input",function(){term=q.value.trim().toLowerCase(); apply();});
  chips.forEach(function(ch){ch.addEventListener("click",function(){
    chips.forEach(function(x){x.setAttribute("aria-pressed","false");});
    ch.setAttribute("aria-pressed","true"); filter=ch.getAttribute("data-filter"); apply();
    var firstVisible=cards.filter(function(c){return c.style.display!=="none";})[0];
    if(firstVisible) firstVisible.scrollIntoView({behavior:"smooth",block:"start"});
  });});
  segs.forEach(function(sg){sg.addEventListener("click",function(){
    segs.forEach(function(x){x.setAttribute("aria-pressed","false");});
    sg.setAttribute("aria-pressed","true"); seenMode=sg.getAttribute("data-seen"); apply();
  });});

  var reset=document.getElementById("resetSeen");
  if(reset) reset.addEventListener("click",function(){
    if(!confirm("Clear all your ticks? Your added photos are kept.")) return;
    seen={}; saveSeen();
    cards.forEach(function(c){c.classList.remove("is-seen");var b=c.querySelector(".seen-btn");if(b)b.setAttribute("aria-pressed","false");});
    updateProgress(); apply();
  });

  updateProgress();
  openDB().then(function(d){ db=d;
    cards.forEach(function(c){
      idbGet(c._key).then(function(data){ if(data) c._showPhoto(data); });
    });
  });
})();
