// Evergreen 2-hour countdown (per-visitor, loops — same mechanic as top DR stores)
(function(){
  var KEY='lutera_sale_end', DUR=2*60*60*1000;
  var end=parseInt(localStorage.getItem(KEY)||'0',10);
  if(!end||end<Date.now()){end=Date.now()+DUR;localStorage.setItem(KEY,String(end));}
  function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    var left=end-Date.now();
    if(left<=0){end=Date.now()+DUR;localStorage.setItem(KEY,String(end));left=DUR;}
    var h=Math.floor(left/3600000),m=Math.floor(left%3600000/60000),s=Math.floor(left%60000/1000);
    document.querySelectorAll('[data-t=h]').forEach(function(e){e.textContent=pad(h)});
    document.querySelectorAll('[data-t=m]').forEach(function(e){e.textContent=pad(m)});
    document.querySelectorAll('[data-t=s]').forEach(function(e){e.textContent=pad(s)});
    document.querySelectorAll('[data-ends]').forEach(function(e){e.textContent=pad(h)+':'+pad(m)+':'+pad(s)});
  }
  tick();setInterval(tick,1000);
})();

// "people looking" counter drifts between 14 and 26
(function(){
  var el=document.querySelector('.js-looking');if(!el)return;
  var n=19;
  setInterval(function(){
    n+=Math.random()>0.5?1:-1;
    if(n<14)n=14;if(n>26)n=26;
    el.textContent=n;
  },7000);
})();

// Bundle tier picker + subscription pricing (single price engine)
function refreshPrice(){
  var sub=document.querySelector('.subrow input');
  var isSub=sub&&sub.checked;
  document.querySelectorAll('.tiers .tier').forEach(function(t){
    var price=isSub?t.getAttribute('data-sub'):t.getAttribute('data-price');
    var pEl=t.querySelector('.pricing .p');if(pEl)pEl.textContent='$'+price;
  });
  var t=document.querySelector('.tiers .tier.selected');if(!t)return;
  var final=parseFloat(isSub?t.getAttribute('data-sub'):t.getAttribute('data-price'));
  var w=t.getAttribute('data-was');
  document.querySelectorAll('.js-price').forEach(function(e){e.textContent='$'+final.toFixed(2)});
  document.querySelectorAll('.js-was').forEach(function(e){e.textContent='$'+w});
  var pct=Math.round((1-final/parseFloat(w))*100);
  var sb=document.querySelector('.js-save');if(sb)sb.textContent='SAVE '+pct+'%';
  var spn=document.querySelector('.js-savepct');if(spn)spn.textContent=pct;
  document.querySelectorAll('.tier .t-sub').forEach(function(el){
    var tt=el.closest('.tier');
    var pr=parseFloat(isSub?tt.getAttribute('data-sub'):tt.getAttribute('data-price'));
    el.textContent='You save '+Math.round((1-pr/parseFloat(tt.getAttribute('data-was')))*100)+'%';
  });
}
document.querySelectorAll('.tiers .tier').forEach(function(t){
  t.addEventListener('click',function(){
    document.querySelectorAll('.tiers .tier').forEach(function(x){x.classList.remove('selected')});
    t.classList.add('selected');
    refreshPrice();
  });
});
(function(){
  var sub=document.querySelector('.subrow input');
  if(sub){sub.addEventListener('change',refreshPrice);refreshPrice();}
})();

// Sticky ATC appears after scrolling past buy box
(function(){
  var bar=document.querySelector('.sticky-atc'),box=document.querySelector('.buybox');
  if(!bar||!box)return;
  window.addEventListener('scroll',function(){
    var r=box.getBoundingClientRect();
    bar.classList.toggle('show',r.bottom<0);
  });
})();

// Tabs
document.querySelectorAll('.tab-btns button').forEach(function(b){
  b.addEventListener('click',function(){
    document.querySelectorAll('.tab-btns button').forEach(function(x){x.classList.remove('active')});
    document.querySelectorAll('.tab-panel').forEach(function(x){x.classList.remove('active')});
    b.classList.add('active');
    document.getElementById(b.getAttribute('data-tab')).classList.add('active');
  });
});

// Inline SVG line icons (replaces emoji — matches reference line-icon style)
(function(){
  var P='stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  var I={
    shield:'<path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z" '+P+'/><path d="M9 12l2 2 4-4" '+P+'/>',
    tag:'<path d="M4 4h7l9 9-7 7-9-9z" '+P+'/><circle cx="8.5" cy="8.5" r="1.4" '+P+'/>',
    gift:'<rect x="4" y="10" width="16" height="10" rx="1.5" '+P+'/><path d="M12 10v10M4 10h16M8 10c-2 0-3-1-3-2.5S6.5 5 8 6c1.5 1 3 4 4 4 1-0 2.5-3 4-4 1.5-1 3 0 3 1.5S18 10 16 10" '+P+'/>',
    percent:'<circle cx="7.5" cy="7.5" r="2.2" '+P+'/><circle cx="16.5" cy="16.5" r="2.2" '+P+'/><path d="M18 5L6 19" '+P+'/>',
    x:'<circle cx="12" cy="12" r="8.5" '+P+'/><path d="M9 9l6 6M15 9l-6 6" '+P+'/>',
    dna:'<path d="M8 4c0 5 8 5 8 8s-8 3-8 8M16 4c0 5-8 5-8 8s8 3 8 8" '+P+'/><path d="M9 7h6M9 17h6" '+P+'/>',
    wheat:'<path d="M12 21V8M12 8c-2.5 0-4-1.8-4-4 2.5 0 4 1.8 4 4zm0 0c2.5 0 4-1.8 4-4-2.5 0-4 1.8-4 4zM12 13c-2.5 0-4-1.8-4-4 2.5 0 4 1.8 4 4zm0 0c2.5 0 4-1.8 4-4-2.5 0-4 1.8-4 4z" '+P+'/>',
    eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" '+P+'/><circle cx="12" cy="12" r="3" '+P+'/>',
    drop:'<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" '+P+'/>',
    leaf:'<path d="M5 19C5 9 12 4 20 4c0 8-5 15-15 15z" '+P+'/><path d="M5 19c3-5 7-9 11-11" '+P+'/>',
    sun:'<circle cx="12" cy="12" r="4" '+P+'/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" '+P+'/>'
    ,search:'<circle cx="11" cy="11" r="6.5" '+P+'/><path d="M16 16l5 5" '+P+'/>'
    ,user:'<circle cx="12" cy="8" r="3.6" '+P+'/><path d="M4.5 20c1.4-3.6 4.2-5.4 7.5-5.4s6.1 1.8 7.5 5.4" '+P+'/>'
    ,bag:'<path d="M5.5 8h13l-1 12.5h-11z" '+P+'/><path d="M9 10V6.5a3 3 0 016 0V10" '+P+'/>'
    ,alert:'<circle cx="12" cy="12" r="8.5" '+P+'/><path d="M12 7.5V13M12 16.2v.3" '+P+'/>'
  };
  document.querySelectorAll('[data-i]').forEach(function(el){
    var k=el.getAttribute('data-i');
    var special=el.classList.contains('wico')||el.classList.contains('hicon');var col=special?'currentColor':'#C2A159';var wd=special?'100%':'60%';var svg='<svg viewBox="0 0 24 24" width="'+wd+'" height="'+wd+'" style="color:'+col+'">'+I[k]+'</svg>';if(I[k]){if(el.classList.contains('hicon')){el.insertAdjacentHTML('afterbegin',svg);}else{el.innerHTML=svg;}}
  });
})();

// Reviews — full-bleed marquee of tall phone-style photo cards
(function(){
  var track=document.getElementById('revTrack');if(!track)return;
  var R=[
    {n:'Carol B.',i:'images/ugc2-carol.webp',p:'Movie night with my grandkids is fun again. Ordering more!'},
    {n:'Amy R.',i:'images/ugc2-amy.webp',p:'Most brands skip meso-zeaxanthin. Lutera doesn\'t \u2014 my husband\'s reading got easier in weeks.'},
    {n:'Frank D.',i:'images/ugc2-frank.webp',p:'A month in and my evening reading doesn\'t wear my eyes out anymore.'},
    {n:'Tyler J.',i:'images/ugc2-tyler.webp',p:'Twelve hours of screens a day \u2014 the end-of-day burn is finally fading.'},
    {n:'Colleen M.',i:'images/ugc2-colleen.webp',p:'30 years of nursing taught me to read labels. This is the real thing.'},
    {n:'Mark H.',i:'images/ugc2-mark.webp',p:'Night driving used to stress me out. I\'m so much more relaxed behind the wheel now.'},
    {n:'Paul G.',i:'images/ugc2-paul.webp',p:'I\'ve tried them all and felt nothing \u2014 until Lutera. Four months, zero missed days.'},
    {n:'Janet C.',i:'images/ugc2-janet.webp',p:'My optometrist asked what changed at my checkup. She said keep going.'}
  ];
  var html='';
  for(var rep=0;rep<2;rep++){
    R.forEach(function(r){
      html+='<div class="pcard2"><img src="'+r.i+'" alt=""><div class="po"><span class="stars">★★★★★</span>'+
        '<p>&ldquo;'+r.p+'&rdquo;</p><span class="pn">&mdash; '+r.n+' &middot; Verified Buyer</span></div></div>';
    });
  }
  track.classList.add('rev-marq');
  track.innerHTML='<div class="rm-track">'+html+'</div>';
  ['revPrev','revNext','revDots'].forEach(function(id){var e=document.getElementById(id);if(e)e.style.display='none'});
})();

// Gallery thumbs
document.querySelectorAll('.thumbs .t').forEach(function(t){
  t.addEventListener('click',function(){
    document.querySelectorAll('.thumbs .t').forEach(function(x){x.classList.remove('active')});
    t.classList.add('active');
    var main=document.querySelector('.main-img');
    if(t.querySelector('img')&&main){main.innerHTML='';main.appendChild(t.querySelector('img').cloneNode());}
  });
});

// Proven Benefits flip cards
document.querySelectorAll('.pcard').forEach(function(cd){
  cd.addEventListener('click',function(){cd.classList.toggle('flipped')});
});

// Scroll-reveal: elements fade/zoom in as they enter the viewport
(function(){
  var sel='section h2,.benefit4 .card,.pcard,.tl-item,.feel-gold .tile2,.feel-gold .rings,.stat-banner,.ugc-strip .u,.vcard,.gbanner,.compare,.faq details,.reason,.rev-carousel,.section-sub,.proven .psub';
  var els=Array.prototype.slice.call(document.querySelectorAll(sel));
  els.forEach(function(el,i){el.classList.add('reveal');el.style.transitionDelay=((i%4)*90)+'ms'});
  var pending=els.slice();
  function check(){
    var vh=window.innerHeight;
    pending=pending.filter(function(el){
      var r=el.getBoundingClientRect();
      if(r.top<vh-50&&r.bottom>0){el.classList.add('in');return false}
      return true;
    });
  }
  window.addEventListener('scroll',check,{passive:true});
  window.addEventListener('resize',check);
  var iv=setInterval(function(){check();if(!pending.length)clearInterval(iv)},250);
  check();
})();

// Count-up stats when the section scrolls into view (interval-driven, works everywhere)
(function(){
  var pcts=Array.prototype.slice.call(document.querySelectorAll('.pct[data-n]'));
  if(!pcts.length)return;
  var started=false;
  function runCount(){
    pcts.forEach(function(el){
      var row=el.closest('.s');
      if(row&&!row.querySelector('.bar')){
        var b=document.createElement('div');b.className='bar';b.innerHTML='<span></span>';
        row.appendChild(b);
        setTimeout(function(){b.firstChild.style.width=el.getAttribute('data-n')+'%';},120);
      }
    });
    var start=Date.now(), dur=1300;
    var t=setInterval(function(){
      var k=Math.min(1,(Date.now()-start)/dur);
      var ease=1-Math.pow(1-k,3);
      pcts.forEach(function(el){
        el.textContent=Math.round(parseInt(el.getAttribute('data-n'),10)*ease)+'%';
      });
      if(k>=1)clearInterval(t);
    },40);
  }
  var iv=setInterval(function(){
    var sec=document.querySelector('.stat-banner2');
    if(!sec)return clearInterval(iv);
    var r=sec.getBoundingClientRect();
    if(!started&&r.top<window.innerHeight-80&&r.bottom>0){started=true;runCount();clearInterval(iv)}
  },250);
})();

// Live order toasts (sales-pop) — product page only
(function(){
  if(!document.querySelector('.pdp'))return;
  var ORDERS=[
    ['Rita W. from Mesa, AZ','just ordered the 90-day supply'],
    ['Stanley H. from Waco, TX','just claimed Buy 2 Get 1 Free'],
    ['Heather C. from Boise, ID','just ordered the 150-day supply'],
    ['Alfred M. from Macon, GA','just ordered the 90-day supply'],
    ['Adline J. from Tampa, FL','just subscribed & saved 15%'],
    ['Somona M. from Salem, OR','just claimed Buy 2 Get 1 Free'],
    ['Tina J. from Tulsa, OK','just ordered the 90-day supply'],
    ['Sibusiso M. from Reno, NV','just ordered the 150-day supply'],
    ['Eric M. from Dayton, OH','just claimed Buy 2 Get 1 Free'],
    ['Tracy G. from Provo, UT','just ordered the 90-day supply'],
    ['Harvey B. from Erie, PA','just subscribed & saved 15%']
  ];
  var el=document.createElement('div');
  el.className='order-toast';
  document.body.appendChild(el);
  // swipe to dismiss (mobile)
  var tx=null;
  el.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;el.style.transition='none'},{passive:true});
  el.addEventListener('touchmove',function(e){if(tx===null)return;var dx=e.touches[0].clientX-tx;el.style.transform='translateX('+dx+'px)';el.style.opacity=Math.max(0,1-Math.abs(dx)/150)},{passive:true});
  el.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;el.style.transition='';if(Math.abs(dx)>60)el.classList.remove('show');setTimeout(function(){el.style.transform='';el.style.opacity=''},350);tx=null});
  // shuffle so a returning visitor never sees the same name first
  for(var s=ORDERS.length-1;s>0;s--){var j=Math.floor(Math.random()*(s+1));var tmp=ORDERS[s];ORDERS[s]=ORDERS[j];ORDERS[j]=tmp;}
  var i=0;
  function show(){
    var o=ORDERS[i%ORDERS.length];i++;
    var mins=2+Math.floor(Math.random()*12);
    el.innerHTML='<img src="images/tier-1pack.png" alt="">'+
      '<div><div class="ot-name">'+o[0]+'</div><div class="ot-sub">'+o[1]+'</div>'+
      '<div class="ot-meta"><span class="st">★★★★★</span> <span class="vf">✓ Verified</span> <span class="ago">'+mins+' minutes ago</span></div></div>';
    el.classList.add('show');
    setTimeout(function(){el.classList.remove('show')},6000);
  }
  setTimeout(function(){show();setInterval(show,30000)},9000);
})();

// ATC -> instant Shopify checkout with the selected bundle
function checkoutURL(){
  var t=document.querySelector('.tiers .tier.selected');
  var v=t?t.getAttribute('data-variant'):'42744068243541';
  return 'https://ru1ttu-nw.myshopify.com/cart/'+v+':1';
}
(function(){
  document.querySelectorAll('.btn-atc').forEach(function(b){
    b.addEventListener('click',function(){
      if(window.openCartDrawer){window.openCartDrawer();}
      else{window.location.href=checkoutURL();}
    });
  });
})();

// Mobile menu
(function(){
  var b=document.getElementById('burger'),m=document.getElementById('mobileMenu'),x=document.getElementById('mmClose');
  if(!b||!m)return;
  function toggle(){m.classList.toggle('open');b.classList.toggle('open')}
  b.addEventListener('click',toggle);
  if(x)x.addEventListener('click',toggle);
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open');b.classList.remove('open')})});
})();

// floating petals (hero + gold sections)
(function(){
  ['.hero','.feel-gold','.stat-banner2'].forEach(function(sel){
    var host=document.querySelector(sel);if(!host)return;
    host.style.position='relative';host.style.overflow='hidden';
    for(var i=0;i<7;i++){
      var p=document.createElement('span');p.className='petal';
      p.style.left=(4+Math.floor(93*((i*37)%100)/100))+'%';
      p.style.animationDuration=(7+(i*13)%8)+'s';
      p.style.animationDelay=(-((i*29)%11))+'s';
      p.style.width=(10+(i*7)%9)+'px';
      host.appendChild(p);
    }
  });
})();

// big Lutera bags click through to the landing page
(function(){
  document.querySelectorAll('.feel-gold .rings img,.stat-banner2 .bag img,.compare th.lut .colimg,.gseal img').forEach(function(im){
    im.style.cursor='pointer';
    im.addEventListener('click',function(){window.location.href='product.html';});
  });
})();

// functional header: search overlay, account modal, cart drawer
(function(){
  var wrap=document.createElement('div');
  wrap.innerHTML='<div class="ov-backdrop" id="ovBack"></div>'+
    '<div class="search-box" id="searchBox"><button class="ov-close" data-close>&times;</button>'+
    '<input id="searchInput" type="text" placeholder="Search Lutera..."><div class="search-hints">'+
    '<a href="product.html">Triple Carotenoid Formula</a><a href="product.html#faq">FAQ</a>'+
    '<a href="track.html">Track my order</a><a href="contact.html">Contact support</a></div></div>'+
    '<div class="acct-modal" id="acctModal"><button class="ov-close" data-close>&times;</button>'+
    '<h3>Customer Accounts</h3><p>Accounts unlock at checkout &mdash; track orders, manage your refill subscription, and access your free At-Home Eye Exam anytime.</p>'+
    '<a class="btn" href="product.html">Shop Lutera &rarr;</a></div>'+
    '<div class="cart-drawer" id="cartDrawer"><div class="cd-head"><h3>Your Cart</h3><button class="ov-close" data-close style="position:static">&times;</button></div>'+
    '<div class="cd-ship">&#127881; You unlocked <b>FREE SHIPPING</b> + the Free At-Home Eye Exam!<div class="csbar"><span></span></div></div>'+
    '<div class="cd-empty" id="cdEmpty" style="display:none"><span class="ce-ico">&#128722;</span><b>Your cart is empty</b><span>Your eyes will thank you later.</span><a class="btn" href="product.html">Shop Lutera &rarr;</a></div>'+
    '<div class="cd-body" id="cdBody"><div class="cd-item"><img src="images/pouch-perfect.png" alt=""><div><b>Lutera Triple Carotenoid Formula</b><span class="cdq" id="cdQty">Buy 2 Get 1 FREE &middot; 90-day supply</span></div><div class="cd-right"><span class="cdp" id="cdPrice">$59.99</span><button class="cd-remove" id="cdRemove" aria-label="Remove from cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/></svg></button></div></div>'+'<div class="cd-gift"><span class="gico">&#128065;</span><div><b>FREE At-Home Eye Exam</b><span class="gsub">60-second vision benchmark &middot; instant access</span></div><div class="gprice"><span class="gwas">$9.99</span><span class="free-badge">FREE</span></div></div>'+'<div class="cd-gift" id="cdShipGift"><span class="gico">&#128666;</span><div><b>FREE Priority Shipping</b><span class="gsub">Arrives in 5&ndash;7 business days</span></div><div class="gprice"><span class="gwas">$5.99</span><span class="free-badge">FREE</span></div></div></div>'+
    '<div class="cd-foot"><div class="cd-savings"><span>&#127881; You\'re saving today</span><span class="amt" id="cdSave">$129.97</span></div>'+'<div class="cd-sub"><span>Subtotal</span><span id="cdSub">$59.99</span></div>'+
    '<a class="btn big" id="cdCheckout" href="https://ru1ttu-nw.myshopify.com/cart/42744068243541:1" style="text-align:center;display:block">CHECKOUT &rarr;</a>'+
    '<div class="cd-note">&#128737; 90-Day Money-Back Guarantee &middot; Secure checkout</div></div></div>';
  document.body.appendChild(wrap);
  var back=document.getElementById('ovBack');
  function closeAll(){back.classList.remove('open');['searchBox','acctModal'].forEach(function(id){document.getElementById(id).classList.remove('open')});document.getElementById('cartDrawer').classList.remove('open')}
  function open(id){closeAll();back.classList.add('open');document.getElementById(id).classList.add('open');if(id==='searchBox')setTimeout(function(){document.getElementById('searchInput').focus()},100)}
  back.addEventListener('click',closeAll);
  wrap.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',closeAll)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
  var TIERQ={'42743984324693':'Buy One \u00b7 30-day supply','42744068243541':'Buy 2 Get 1 FREE \u00b7 90-day supply','42744094752853':'Buy 3 Get 2 FREE \u00b7 150-day supply'};
  var cartEmpty=true;
  try{cartEmpty=sessionStorage.getItem('luteraCartHas')!=='1'}catch(e){}
  function setCount(n){document.querySelectorAll('.cartcount').forEach(function(c){c.textContent=n;c.style.display=n?'':'none'})}
  setCount(cartEmpty?0:1);
  function renderCart(){
    var dr=document.getElementById('cartDrawer');
    document.getElementById('cdEmpty').style.display=cartEmpty?'flex':'none';
    document.getElementById('cdBody').style.display=cartEmpty?'none':'';
    var foot=dr.querySelector('.cd-foot');if(foot)foot.style.display=cartEmpty?'none':'';
    var ban=dr.querySelector('.cd-ship');if(ban)ban.style.display=cartEmpty?'none':'';
    if(cartEmpty)return;
    var tier=document.querySelector('.tiers .tier.selected');
    var big=tier&&tier.getAttribute('data-ship')==='free';
    if(tier){var v=tier.getAttribute('data-variant');if(TIERQ[v])document.getElementById('cdQty').textContent=TIERQ[v];}
    var shipRow=document.getElementById('cdShipGift');
    if(shipRow)shipRow.style.display=big?'flex':'none';
    if(ban)ban.innerHTML=big
      ?'&#127881; You unlocked <b>FREE PRIORITY SHIPPING</b> + the Free At-Home Eye Exam!<div class="csbar"><span style="width:100%"></span></div>'
      :'&#128666; Upgrade to <b>Buy 3 Get 2 FREE</b> to unlock FREE Priority Shipping!<div class="csbar"><span style="width:66%"></span></div>';
    var p=document.querySelector('.buybox .js-price');
    if(p){document.getElementById('cdPrice').textContent=p.textContent;document.getElementById('cdSub').textContent=p.textContent;
      var w=document.querySelector('.buybox .js-was');
      if(w){var save=(parseFloat(w.textContent.replace('$',''))-parseFloat(p.textContent.replace('$','')))+9.99+(big?5.99:0);
      document.getElementById('cdSave').textContent='$'+save.toFixed(2);}}
    var co=document.getElementById('cdCheckout');
    if(co&&typeof checkoutURL==='function')co.href=checkoutURL();
  }
  document.addEventListener('click',function(ev){
    if(ev.target.closest&&ev.target.closest('#cdRemove')){cartEmpty=true;try{sessionStorage.removeItem('luteraCartHas')}catch(e){}setCount(0);renderCart();}
  });
  window.openCartDrawer=function(){cartEmpty=false;try{sessionStorage.setItem('luteraCartHas','1')}catch(e){}setCount(1);renderCart();open('cartDrawer');};
  var icons=document.querySelectorAll('.hicon');
  icons.forEach(function(ic){
    var k=ic.getAttribute('data-i');
    ic.addEventListener('click',function(){
      if(k==='search')open('searchBox');
      else if(k==='user')open('acctModal');
      else if(k==='bag'){renderCart();open('cartDrawer');}
    });
  });
  var si=document.getElementById('searchInput');
  si.addEventListener('keydown',function(e){if(e.key==='Enter')window.location.href='product.html'});
})();

// gallery: arrows + swipe through all images
(function(){
  var main=document.querySelector('.main-img');if(!main)return;
  var thumbs=Array.prototype.slice.call(document.querySelectorAll('.thumbs .t'));
  if(!thumbs.length)return;
  var srcs=thumbs.map(function(t){return t.querySelector('img').src});
  var idx=0;
  function show(n){
    idx=(n+srcs.length)%srcs.length;
    main.querySelector('img').src=srcs[idx];
    thumbs.forEach(function(t,j){t.classList.toggle('active',j===idx)});
  }
  var L=document.createElement('button');L.className='g-arrow gl';L.innerHTML='&#8249;';
  var R=document.createElement('button');R.className='g-arrow gr';R.innerHTML='&#8250;';
  main.appendChild(L);main.appendChild(R);
  L.addEventListener('click',function(e){e.stopPropagation();show(idx-1)});
  R.addEventListener('click',function(e){e.stopPropagation();show(idx+1)});
  thumbs.forEach(function(t,j){t.addEventListener('click',function(){show(j)})});
  var x0=null;
  main.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  main.addEventListener('touchend',function(e){
    if(x0===null)return;
    var dx=e.changedTouches[0].clientX-x0;
    if(Math.abs(dx)>40)show(idx+(dx<0?1:-1));
    x0=null;
  },{passive:true});
})();

// Real payment brand badges — replaces text chips in .payrow and footer .payments
(function(){
  var F='font-family="Arial,Helvetica,sans-serif"';
  var WR='<rect x="0.5" y="0.5" width="{W}" height="31" rx="5" fill="#fff" stroke="#E3E6EA"/>';
  var APPLE='M17.05 12.54c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.29-1.27 3.15-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.75-4.14zM14.44 4.9c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.09 3.18 1.15.09 2.33-.58 3.04-1.45z';
  var uid=0;
  function B(k){
    uid++;
    if(k==='amex')return '<svg viewBox="0 0 54 32">'+WR.replace('{W}','53')+'<path fill="#2557D6" transform="translate(13,2) scale(1.167)" d="M16.015 14.378c0-.32-.135-.496-.344-.622-.21-.12-.464-.135-.81-.135h-1.543v2.82h.675v-1.027h.72c.24 0 .39.024.478.125.12.13.104.38.104.55v.35h.66v-.555c-.002-.25-.017-.376-.108-.516-.06-.08-.18-.18-.33-.234l.02-.008c.18-.072.48-.297.48-.747zm-.87.407l-.028-.002c-.09.053-.195.058-.33.058h-.81v-.63h.824c.12 0 .24 0 .33.05.098.048.156.147.15.255 0 .12-.045.215-.134.27zM20.297 15.837H19v.6h1.304c.676 0 1.05-.278 1.05-.884 0-.28-.066-.448-.187-.582-.153-.133-.392-.193-.73-.207l-.376-.015c-.104 0-.18 0-.255-.03-.09-.03-.15-.105-.15-.21 0-.09.017-.166.09-.21.083-.046.177-.066.272-.06h1.23v-.602h-1.35c-.704 0-.958.437-.958.84 0 .9.776.855 1.407.87.104 0 .18.015.225.06.046.03.082.106.082.18 0 .077-.035.15-.08.18-.06.053-.15.07-.277.07zM0 0v10.096L.81 8.22h1.75l.225.464V8.22h2.043l.45 1.02.437-1.013h6.502c.295 0 .56.057.756.236v-.23h1.787v.23c.307-.17.686-.23 1.12-.23h2.606l.24.466v-.466h1.918l.254.465v-.466h1.858v3.948H20.87l-.36-.6v.585h-2.353l-.256-.63h-.583l-.27.614h-1.213c-.48 0-.84-.104-1.08-.24v.24h-2.89v-.884c0-.12-.03-.12-.105-.135h-.105v1.036H6.067v-.48l-.21.48H4.69l-.202-.48v.465H2.235l-.256-.624H1.4l-.256.624H0V24h23.786v-7.108c-.27.135-.613.18-.973.18H21.09v-.255c-.21.165-.57.255-.914.255H14.71v-.9c0-.12-.018-.12-.12-.12h-.075v1.022h-1.8v-1.066c-.298.136-.643.15-.928.136h-.214v.915h-2.18l-.54-.617-.57.6H4.742v-3.93h3.61l.518.602.554-.6h2.412c.28 0 .74.03.942.225v-.24h2.177c.202 0 .644.045.903.225v-.24h3.265v.24c.163-.164.508-.24.803-.24h1.89v.24c.194-.15.464-.24.84-.24h1.176V0H0zM21.156 14.955c.004.005.006.012.01.016.01.01.024.01.032.02l-.042-.035zM23.828 13.082h.065v.555h-.065zM23.865 15.03v-.005c-.03-.025-.046-.048-.075-.07-.15-.153-.39-.215-.764-.225l-.36-.012c-.12 0-.194-.007-.27-.03-.09-.03-.15-.105-.15-.21 0-.09.03-.16.09-.204.076-.045.15-.05.27-.05h1.223v-.588h-1.283c-.69 0-.96.437-.96.84 0 .9.78.855 1.41.87.104 0 .18.015.224.06.046.03.076.106.076.18 0 .07-.034.138-.09.18-.045.056-.136.07-.27.07h-1.288v.605h1.287c.42 0 .734-.118.9-.36h.03c.09-.134.135-.3.135-.523 0-.24-.045-.39-.135-.526zM18.597 14.208v-.583h-2.235V16.458h2.235v-.585h-1.57v-.57h1.533v-.584h-1.532v-.51M13.51 8.787h.685V11.6h-.684zM13.126 9.543l-.007.006c0-.314-.13-.5-.34-.624-.217-.125-.47-.135-.81-.135H10.43v2.82h.674v-1.034h.72c.24 0 .39.03.487.12.122.136.107.378.107.548v.354h.677v-.553c0-.25-.016-.375-.11-.516-.09-.107-.202-.19-.33-.237.172-.07.472-.3.472-.75zm-.855.396h-.015c-.09.054-.195.056-.33.056H11.1v-.623h.825c.12 0 .24.004.33.05.09.04.15.128.15.25s-.047.22-.134.266zM15.92 9.373h.632v-.6h-.644c-.464 0-.804.105-1.02.33-.286.3-.362.69-.362 1.11 0 .512.123.833.36 1.074.232.238.645.31.97.31h.78l.255-.627h1.39l.262.627h1.36v-2.11l1.272 2.11h.95l.002.002V8.786h-.684v1.963l-1.18-1.96h-1.02V11.4L18.11 8.744h-1.004l-.943 2.22h-.3c-.177 0-.362-.03-.468-.134-.125-.15-.186-.36-.186-.662 0-.285.08-.51.194-.63.133-.135.272-.165.516-.165zm1.668-.108l.464 1.118v.002h-.93l.466-1.12zM2.38 10.97l.254.628H4V9.393l.972 2.205h.584l.973-2.202.015 2.202h.69v-2.81H6.118l-.807 1.904-.876-1.905H3.343v2.663L2.205 8.787h-.997L.01 11.597h.72l.26-.626h1.39zm-.688-1.705l.46 1.118-.003.002h-.915l.457-1.12zM11.856 13.62H9.714l-.85.923-.825-.922H5.346v2.82H8l.855-.932.824.93h1.302v-.94h.838c.6 0 1.17-.164 1.17-.945l-.006-.003c0-.78-.598-.93-1.128-.93zM7.67 15.853l-.014-.002H6.02v-.557h1.47v-.574H6.02v-.51H7.7l.733.82-.764.824zm2.642.33l-1.03-1.147 1.03-1.108v2.253zm1.553-1.258h-.885v-.717h.885c.24 0 .42.098.42.344 0 .243-.15.372-.42.372zM9.967 9.373v-.586H7.73V11.6h2.237v-.58H8.4v-.564h1.527V9.88H8.4v-.507"/></svg>';
    if(k==='applepay')return '<svg viewBox="0 0 58 32">'+WR.replace('{W}','57')+'<path fill="#111" transform="translate(7,-4.8) scale(1.83)" d="M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072l1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z"/></svg>';
    if(k==='gpay')return '<svg viewBox="0 0 58 32">'+WR.replace('{W}','57')+'<g transform="translate(10,8.5) scale(0.62)"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></g><text x="28" y="21" font-size="13" font-weight="600" fill="#5F6368" '+F+'>Pay</text></svg>';
    if(k==='mc')return '<svg viewBox="0 0 48 32">'+WR.replace('{W}','47')+'<clipPath id="mcx'+uid+'"><circle cx="19" cy="16" r="8.5"/></clipPath><circle cx="19" cy="16" r="8.5" fill="#EB001B"/><circle cx="29" cy="16" r="8.5" fill="#F79E1B"/><circle cx="29" cy="16" r="8.5" fill="#FF5F00" clip-path="url(#mcx'+uid+')"/></svg>';
    if(k==='paypal')return '<svg viewBox="0 0 58 32">'+WR.replace('{W}','57')+'<path fill="#003087" transform="translate(8,5) scale(0.92)" d="M7.016 19.198h-4.2a.562.562 0 0 1-.555-.65L5.093.584A.692.692 0 0 1 5.776 0h7.222c3.417 0 5.904 2.488 5.846 5.5-.006.25-.027.5-.066.747A6.794 6.794 0 0 1 12.071 12H8.743a.69.69 0 0 0-.682.583l-.325 2.056-.013.083-.692 4.39-.015.087zM19.79 6.142c-.01.087-.01.175-.023.261a7.76 7.76 0 0 1-7.695 6.598H9.007l-.283 1.795-.013.083-.692 4.39-.134.843-.014.088H6.86l-.497 3.15a.562.562 0 0 0 .555.65h3.612c.34 0 .63-.249.683-.585l.952-6.031a.692.692 0 0 1 .683-.584h2.126a6.793 6.793 0 0 0 6.707-5.752c.306-1.95-.466-3.744-1.89-4.906z"/><text x="37" y="20.5" font-size="11.5" font-weight="800" font-style="italic" text-anchor="middle" '+F+'><tspan fill="#003087">Pay</tspan><tspan fill="#009CDE">Pal</tspan></text></svg>';
    if(k==='shop')return '<svg viewBox="0 0 48 32"><rect width="48" height="32" rx="5" fill="#5A31F4"/><text x="24" y="21" font-size="13" font-weight="800" fill="#fff" text-anchor="middle" '+F+'>shop</text></svg>';
    if(k==='visa')return '<svg viewBox="0 0 52 32"><rect width="52" height="32" rx="5" fill="#1434CB"/><path fill="#fff" transform="translate(4,-6) scale(1.83)" d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"/></svg>';
    return '';
  }
  var ORDER=['amex','applepay','gpay','mc','paypal','shop','visa'];
  document.querySelectorAll('.payrow,.payments').forEach(function(el){
    el.innerHTML=ORDER.map(function(k){return '<span class="payb">'+B(k)+'</span>'}).join('');
  });
})();

// Dynamic delivery window: today+7 to today+15, refreshes itself daily
(function(){
  var a=document.getElementById('shipA'),b=document.getElementById('shipB');
  if(!a||!b)return;
  var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function ord(n){var v=n%100;if(v>=11&&v<=13)return n+'th';switch(n%10){case 1:return n+'st';case 2:return n+'nd';case 3:return n+'rd';default:return n+'th'}}
  function fmt(d){return DAYS[d.getDay()]+', '+MON[d.getMonth()]+' '+ord(d.getDate())}
  var t=new Date();
  var d1=new Date(t.getFullYear(),t.getMonth(),t.getDate()+4);
  var d2=new Date(t.getFullYear(),t.getMonth(),t.getDate()+9);
  a.textContent=fmt(d1);b.textContent=fmt(d2);
})();
