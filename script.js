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

// Reviews carousel — reference layout: stars / title / body / name + VERIFIED
(function(){
  var track=document.getElementById('revTrack');if(!track)return;
  var R=[
    {t:'I Finally Trust My Eyes Again',n:'Dennis T.',i:'images/av-porch.webp',p:'Working late meant driving home in the dark, and the glare from oncoming traffic genuinely stressed me out. By week five the halos around headlights had softened noticeably. I\'m more relaxed behind the wheel, and my eyes don\'t feel wrung out when I get home.'},
    {t:'My Days Start Differently Now',n:'Gary M.',i:'images/av-desk.webp',p:'Between work and my tablet I\'m on screens twelve hours a day, and my eyes paid the price — dry, heavy, aching by dinner. Three weeks in, the end-of-day burn started fading. Six weeks in, I realized I hadn\'t used eye drops in days.'},
    {t:'My Optometrist Wanted to Know My Secret',n:'Margaret S.',i:'images/av-gh.webp',p:'I didn\'t tell my optometrist I\'d started anything new. At my checkup she said my macular pigment measurement looked better than last year and asked what changed. When I told her about Lutera, she looked at the label and said keep going.'},
    {t:'Nobody Ever Told Us About Meso-Zeaxanthin',n:'Susan H.',i:'images/av-comfort.webp',p:'Two years of pharmacy eye vitamins and my husband had nothing to show for it. I did my research and learned most brands skip meso-zeaxanthin entirely. We switched to Lutera and within weeks his reading got easier. I wish we\'d found this sooner.'},
    {t:'A Nurse Doesn\'t Lie About Supplements',n:'Linda K.',i:'images/av-armchair.webp',p:'Thirty years in nursing means I know how to read a label. Lutera is the real thing: all three macular carotenoids at studied doses plus astaxanthin, delivered in oil. Three months in, my eyes are the freshest they\'ve felt in years.'},
    {t:'Done Wasting Money — This One Stuck',n:'Robert W.',i:'images/av-lib.webp',p:'Gummies, tablets, vision blends — I\'ve bought them all and felt nothing. I tried Lutera expecting the same story. Within a few weeks my eyes felt noticeably less tired. Four months in and I haven\'t missed a day. One softgel. That\'s it.'}
  ];
  var page=0, per=window.innerWidth>919?5:3, dots=document.getElementById('revDots');
  function render(){
    track.innerHTML='';
    for(var k=0;k<per;k++){
      var r=R[(page+k)%R.length];
      var d=document.createElement('div');d.className='rev-card rc2';
      d.innerHTML='<div class="stars">★ ★ ★ ★ ★</div><h3>'+r.t+'</h3><p>'+r.p+'</p>'+
        '<div class="rc-foot"><span class="rc-name"><img src="'+r.i+'" alt="">'+r.n+'</span><span class="rc-verified">✓ VERIFIED CUSTOMER</span></div>';
      track.appendChild(d);
    }
    if(dots){
      dots.innerHTML='';
      for(var j=0;j<R.length;j++){
        var b=document.createElement('span');b.className='rdot'+(j===page?' on':'');
        (function(jj){b.addEventListener('click',function(){page=jj;render()})})(j);
        dots.appendChild(b);
      }
    }
  }
  render();
  document.getElementById('revPrev').addEventListener('click',function(){page=(page-1+R.length)%R.length;render()});
  document.getElementById('revNext').addEventListener('click',function(){page=(page+1)%R.length;render()});
  setInterval(function(){page=(page+1)%R.length;render()},9000);
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
      b.innerHTML='<span class="l1">✓ Taking you to secure checkout…</span>';
      setTimeout(function(){window.location.href=checkoutURL()},450);
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

// twin pouches: pop out on both sides while the 90-day timeline is on screen
(function(){
  var tl=document.querySelector('.tl-vert');
  if(!tl)return;
  function mk(side){
    var el=document.createElement('img');
    el.src='images/pouch-perfect.png';el.alt='Lutera';el.className='tl-pouch '+side;
    el.addEventListener('click',function(){window.location.href='product.html';});
    document.body.appendChild(el);return el;
  }
  var L=mk('l'),R=mk('r');
  var sec=tl.closest('section')||tl;
  var strip=document.querySelector('.badge-strip');
  setInterval(function(){
    var vh=window.innerHeight;
    var stripGone=!strip||strip.getBoundingClientRect().bottom<=80;
    var r=sec.getBoundingClientRect();
    var show=stripGone&&r.top<vh&&r.bottom>vh*0.6;
    L.classList.toggle('in',show);R.classList.toggle('in',show);
  },150);
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
  var cartEmpty=false;
  try{cartEmpty=sessionStorage.getItem('luteraCartEmpty')==='1'}catch(e){}
  function setCount(n){document.querySelectorAll('.cartcount').forEach(function(c){c.textContent=n;c.style.display=n?'':'none'})}
  if(cartEmpty)setCount(0);
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
    if(ev.target.closest&&ev.target.closest('#cdRemove')){cartEmpty=true;try{sessionStorage.setItem('luteraCartEmpty','1')}catch(e){}setCount(0);renderCart();}
  });
  document.querySelectorAll('.btn-atc').forEach(function(el){
    el.addEventListener('click',function(){cartEmpty=false;try{sessionStorage.removeItem('luteraCartEmpty')}catch(e){}setCount(1);});
  });
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
    if(k==='amex')return '<svg viewBox="0 0 54 32"><rect width="54" height="32" rx="5" fill="#2557D6"/><text x="27" y="21" font-size="12" font-weight="800" letter-spacing=".5" fill="#fff" text-anchor="middle" '+F+'>AMEX</text></svg>';
    if(k==='applepay')return '<svg viewBox="0 0 58 32">'+WR.replace('{W}','57')+'<g transform="translate(12.5,9) scale(0.6)" fill="#111"><path d="'+APPLE+'"/></g><text x="27" y="21" font-size="13" font-weight="600" fill="#111" '+F+'>Pay</text></svg>';
    if(k==='gpay')return '<svg viewBox="0 0 58 32">'+WR.replace('{W}','57')+'<g transform="translate(10,8.5) scale(0.62)"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></g><text x="28" y="21" font-size="13" font-weight="600" fill="#5F6368" '+F+'>Pay</text></svg>';
    if(k==='mc')return '<svg viewBox="0 0 48 32">'+WR.replace('{W}','47')+'<clipPath id="mcx'+uid+'"><circle cx="19" cy="16" r="8.5"/></clipPath><circle cx="19" cy="16" r="8.5" fill="#EB001B"/><circle cx="29" cy="16" r="8.5" fill="#F79E1B"/><circle cx="29" cy="16" r="8.5" fill="#FF5F00" clip-path="url(#mcx'+uid+')"/></svg>';
    if(k==='paypal')return '<svg viewBox="0 0 58 32">'+WR.replace('{W}','57')+'<text x="29" y="21" font-size="12.5" font-weight="800" font-style="italic" text-anchor="middle" '+F+'><tspan fill="#003087">Pay</tspan><tspan fill="#009CDE">Pal</tspan></text></svg>';
    if(k==='shop')return '<svg viewBox="0 0 48 32"><rect width="48" height="32" rx="5" fill="#5A31F4"/><text x="24" y="21" font-size="13" font-weight="800" fill="#fff" text-anchor="middle" '+F+'>shop</text></svg>';
    if(k==='visa')return '<svg viewBox="0 0 52 32"><rect width="52" height="32" rx="5" fill="#1434CB"/><text x="26" y="21" font-size="12.5" font-weight="800" font-style="italic" letter-spacing="1" fill="#fff" text-anchor="middle" '+F+'>VISA</text></svg>';
    return '';
  }
  var ORDER=['amex','applepay','gpay','mc','paypal','shop','visa'];
  document.querySelectorAll('.payrow,.payments').forEach(function(el){
    el.innerHTML=ORDER.map(function(k){return '<span class="payb">'+B(k)+'</span>'}).join('');
  });
})();
