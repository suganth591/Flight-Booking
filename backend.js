  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
  import { getFirestore,Timestamp} from  "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-firestore.min.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
  import { collection, doc, getDoc , setDoc ,getDocs,query,where } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-firestore.min.js"; 
  var user_email,user_name;
  var admin_email,admin_name;
  const firebaseConfig = {
    apiKey: "AIzaSyD8dZkmZb8-2iBAQe-HgW-KNFXtv0xUoVc",
    authDomain: "flight-553e0.firebaseapp.com",
    databaseURL: "https://flight-553e0-default-rtdb.firebaseio.com",
    projectId: "flight-553e0",
    storageBucket: "flight-553e0.appspot.com",
    messagingSenderId: "246939508208",
    appId: "1:246939508208:web:6095f552a6f9379e315135",
    measurementId: "G-Q51QH66MK2"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  export async function add_user(){
    document.getElementById('warnings').innerHTML="<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>";
    var name=document.getElementById('name');
    var email=document.getElementById('email');
    var password=document.getElementById('password');
    var warn="";
    if(name.value=="" || email.value=="" || password.value==""){
      warn+="Fill all fields<br>";
      if(name.value==""){
        name.focus();      
      }else if(email.value==""){
        email.focus();
      }else{
        password.focus();
      }
    }
    else if(name.value.length<3){
      warn+="Name should be Minimum 3 Characters<br>";
      name.focus();
    }
    else if(ValidateEmail(email.value)){
      email.focus();
      warn+="Enter Valid Email Address<br>";
    }
    else if(password.value.length<7){
      password.value="";
      password.focus();
      warn+="Minimum Password Length should be 7<br>";
    }
    else if(await emailexist(email.value)){
      email.focus();
      warn+="User with email already registered.<br>Try Logging in (or) Check your email once.<br>"
    }
    if(warn==""){
    await setDoc(
      doc(db,"users",email.value),
      {
        "name":name.value,
        "email":email.value,
        "password":password.value
      },{
        merge:true
      }
    );
    document.getElementById('warnings').innerHTML="Registration Success.<br>Redirecting You to login Page<br>";
    document.getElementById('warnings').style.color='green';
    alert("User Registered Keep remember of your credentials");
    window.location.replace("user_login.html");
    }else{
      document.getElementById('warnings').innerHTML=warn;
    }
  }
  async function emailexist(email){
    document.getElementById('warnings').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
    var users=collection(db,"users");
    var q=query(users,where("email","==",email));
    var qs=await getDocs(q);
    while(qs==undefined){
      sleep(100);
    }
      if(qs.empty==true){
        return false;
      }
      return true;
  }
  async function emailexistadmin(email){
    document.getElementById('warnings').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
    var users=collection(db,"admin");
    var q=query(users,where("email","==",email));
    var qs=await getDocs(q);
    while(qs==undefined){
      sleep(100);
    }
      if(qs.empty==true){
        return false;
      }
      return true;
  }
  function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (String(input).match(validRegex)) {
      return false;
    } else {
      return true;
    }
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  async function user_login(){
    document.getElementById('warnings').innerHTML="";
    document.getElementById('warnings').innerHTML="";
    var email=document.getElementById('email');
    var password=document.getElementById('password');
    var warn="";
    if(email.value==''||password.value==""){
      warn+="Fill out all Fields";
      if(email.value==""){
        email.focus();
      }else{
        password.focus();
      }
    }
    if(warn!=""){
      document.getElementById('warnings').innerHTML=warn;
      return;
    }
    if(await emailexist(email.value)){
      var q= await getDoc(doc(db,'users',email.value));
      var data=q.data();
      if(data['password']==password.value){
        document.getElementById('warnings').innerHTML="Login Success";
        document.getElementById('warnings').style.color='green';
        window.sessionStorage.setItem("user-flight-name",data['name']);
        window.sessionStorage.setItem("user-flight-email",data['email']);
        window.location.replace("user_page.html");
      }else{
        document.getElementById('warnings').innerHTML="Invalid Credentials";
      }
    }else{
      document.getElementById('warnings').innerHTML="User with email not found<br>Try signing up";
    }
  }
  function logout(){
    window.sessionStorage.clear();
    window.location.replace("user_login.html");
  }
  async function inituser(){
        if(window.sessionStorage.getItem('user-flight-email')==undefined){
          document.write("<h1>Unauthorized access.</h1><br>Redirecting to Login Page in <span id='timing'>5</span> S");
          setTimeout(logout,5000);
          for(let i=5;i>=0;i--){
            document.getElementById('timing').innerHTML=i;
            await sleep(1000);
          }
        }else{
          user_email=window.sessionStorage.getItem('user-flight-email');
          user_name=window.sessionStorage.getItem('user-flight-name');
          return;
        }
  }
  async function initadmin(initv){
    if(window.sessionStorage.getItem('admin-flight-email')==undefined){
      document.write("<h1>Unauthorized access.</h1><br>Redirecting to Login Page in <span id='timing'>5</span> S");
      setTimeout(logout,5000);
      for(let i=5;i>=0;i--){
        document.getElementById('timing').innerHTML=i;
        await sleep(1000);
      }
    }else{
      if(initv==1){
      startrender();
      }
      admin_email=window.sessionStorage.getItem('admin-flight-email');
      admin_name=window.sessionStorage.getItem('admin-flight-name');
      return;
    }
}
  async function changepassword(){
    document.getElementById('warnings').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
    var cur=document.getElementById('currpass');
    var ch1=document.getElementById('chpass1');
    var ch2=document.getElementById('chpass2');
    var currpass=cur.value;
    var chpass1=ch1.value;
    var chpass2=ch2.value;
    var user=await getDoc(doc(db,"users",user_email));
    user=user.data();
    if(chpass1==""||chpass2==""||currpass==""){
      document.getElementById('warnings').innerHTML="Fill out all fields";
      if(currpass==""){
        cur.focus();
      }else if(chpass1==""){
        ch1.focus();
      }else{
        ch2.focus();
      }
    }
    else if(chpass1!=chpass2){
      document.getElementById('warnings').innerHTML="Password not Matched";
      ch1.focus();
    }else if(chpass1.length<7){
      document.getElementById('warnings').innerHTML="Password Should be Minimum 7 characters";
      ch1.focus();
    }
    else if(currpass!=user['password']){
      document.getElementById('warnings').innerHTML="Invalid Current Password";
      cur.focus();
    }else if(currpass==chpass1){
      document.getElementById('warnings').innerHTML="New Password can't be Current Password";
      ch1.focus();
    }
    else{
      await setDoc(doc(db,"users",user_email),{
        "password":chpass1
      },{
        merge:true
      });
      document.getElementById('warnings').innerHTML="<span style='color:green'>Password Updated</span>";
      await sleep(1000);
      cur.value="";
      ch1.value="";
      ch2.value="";
      document.getElementById('warnings').innerHTML="";
      document.getElementById('chpwdclose').click();
      
    }
  }
  function red_home(){
    document.getElementById('iframe1').src="user_home.html";
    document.getElementById('home').className="nav-link active";
    document.getElementById('booknow').className="nav-link";
    document.getElementById('bookings').className="nav-link";
  }
  function red_bookings(){
    try{
    document.getElementById('iframe1').src="user_bookings.html";
    document.getElementById('bookings').className="nav-link active";
    document.getElementById('home').className="nav-link";
    document.getElementById('booknow').className="nav-link";
    }catch(e){
      window.location.href='user_bookings.html';
      parent.document.getElementById('bookings').className="nav-link active";
      parent.document.getElementById('home').className="nav-link";
      parent.document.getElementById('booknow').className="nav-link";
    }
  }
  function red_booknow(){
    try{
    document.getElementById('iframe1').src="user_booknow.html";
    document.getElementById('booknow').className="nav-link active";
    document.getElementById('home').className="nav-link";
    document.getElementById('bookings').className="nav-link";
    }catch{
      window.location.href='user_booknow.html';
      parent.document.getElementById('booknow').className="nav-link active";
      parent.document.getElementById('home').className="nav-link";
      parent.document.getElementById('bookings').className="nav-link";
    }
  }
  async function admin_login(){
    document.getElementById('warnings').innerHTML="";
    document.getElementById('warnings').innerHTML="";
    var email=document.getElementById('email');
    var password=document.getElementById('password');
    var warn="";
    if(email.value==''||password.value==""){
      warn+="Fill out all Fields";
      if(email.value==""){
        email.focus();
      }else{
        password.focus();
      }
    }
    if(warn!=""){
      document.getElementById('warnings').innerHTML=warn;
      return;
    }
    if(await emailexistadmin(email.value)){
      var q= await getDoc(doc(db,'admin',email.value));
      var data=q.data();
      if(data['password']==password.value){
        document.getElementById('warnings').innerHTML="Login Success";
        document.getElementById('warnings').style.color='green';
        window.sessionStorage.setItem("admin-flight-name",data['name']);
        window.sessionStorage.setItem("admin-flight-email",data['email']);
        window.location.replace("admin_page.html");
      }else{
        document.getElementById('warnings').innerHTML="Invalid Credentials";
      }
    }else{
      document.getElementById('warnings').innerHTML="Admin Not Found";
    }
  }
  async function addflight(){
    document.getElementById('addbtn').disabled=true;
    document.getElementById('warnings').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
    var name=document.getElementById('flightname');
    var from=document.getElementById('flightfrom');
    var to=document.getElementById('flightto');
    var date=document.getElementById('flightdate');
    var time=document.getElementById('flighttime');
    var ft=date.value+" "+time.value;
    var dt=new Date(ft);
    var now=new Date();
    if(name.value==""||from.value==""||to.value==""||date.value==""||time.value==""){
      document.getElementById('warnings').innerHTML="Fill all fields";
      if(name.value==""){
        name.focus();
      }else if(from.value==""){
        from.focus();
      }else if(to.value==""){
        to.focus();
      }else if(date.value==""){
        date.focus();
      }else{
        time.focus();
      }
    }else{
    if(dt>now){
    var q=query(collection(db,"flight"));
    var qs=await getDocs(q);
    await setDoc(doc(db,"flight",String(qs.size)),{
      "count":60,
      "name":name.value,
      "from":from.value,
      "to":to.value,
      "date":date.value,
      "time":time.value,
      "ft":dt,
      "available":1,
      "id":qs.size,
      "booked":0
    });
    document.getElementById('warnings').innerHTML="<span class='text-success'>Flight added</span>";
    await sleep(1000);
    name.value="";
    from.value="";
    to.value="";
    date.value="";
    time.value="";
    document.getElementById('warnings').innerHTML="";
    document.getElementById('addbtn').disabled=false;
    document.getElementById('flightaddclose').click();
  }else{
    document.getElementById('warnings').innerHTML="Date & Time can't be less than current time";
  }
}
document.getElementById('addbtn').disabled=false;
  }
  async function render(){
    const q = query(collection(db, "flight"));
    const qs = await getDocs(q);
    if(qs.size==0){
      document.getElementById('flightinfo').innerHTML="No flights available";
    }else{
      document.getElementById('flightinfo').innerHTML="  <h3>Upcoming Flights</h3><br><ol class='list-group list-group-numbered' id='flight-list-available'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div></ol><span id='upcoming-fight-warn'></span><br><h3>Previous Flights</h3><ol class='list-group list-group-numbered' id='flight-list-previous'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div></ol><span id='previous-flight-warn'></span>";
    var list=document.getElementById('flight-list-available');
    list.innerHTML="";
    var arr=[];
    qs.forEach(
      (doc)=>{
        arr.push(doc.data());
      }
    );
    var dt=new Date();
    var c=0
    for(let i=0;i<arr.length;i++){
      console.log();
      if(new Date(arr[i]['date']+" "+arr[i]['time'])>dt && arr[i]['available']==1){
        c=1;
      list.innerHTML+="<li class='list-group-item' style='margin:10px'><br><br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Flight Name : </b>"+arr[i]['name']+"<button class='btn btn-warning float-end' onclick='modalopenflight(\""+arr[i]['id']+"\")'>Edit</button>"+"<br><div class='me-auto'>&nbsp;&nbsp;&nbsp;&nbsp;<b>From : </b>"+arr[i]['from']+"&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>To : </b>"+arr[i]['to']+"&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Date & Time : </b><strong><mark>"+arr[i]['date']+" at "+arr[i]['time']+"</mark></strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Total Seats : </b>"+arr[i]['count']+"<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Seats Booked : </b>"+arr[i]['booked']+"<button class='btn btn-success float-end' onclick='modalopenbooking(\""+arr[i]['id']+"\")'>View Bookings</button><br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Seats Remaining : </b>"+(arr[i]['count']-arr[i]['booked'])+"</div>"+"</li>";
      }
    }
    if(c==0){
      document.getElementById("upcoming-flight-warn").innerHTML='No Upcoming Filghts';
    }
    c=0;
    list=document.getElementById('flight-list-previous');
    list.innerHTML="";
    for(let i=0;i<arr.length;i++){
      if(new Date(arr[i]['date']+" "+arr[i]['time'])<dt && arr[i]['available']==1){
      c=1;
      list.innerHTML+="<li class='list-group-item' style='margin:10px'><br><br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Flight Name : </b>"+arr[i]['name']+"<button class='btn btn-warning float-end' onclick='modalopenflight(\""+arr[i]['id']+"\")'>Edit</button>"+"<br><div class='me-auto'>&nbsp;&nbsp;&nbsp;&nbsp;<b>From : </b>"+arr[i]['from']+"&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>To : </b>"+arr[i]['to']+"&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Date & Time : </b><strong><mark>"+arr[i]['date']+" at "+arr[i]['time']+"</mark></strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Total Seats : </b>"+arr[i]['count']+"<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Seats Booked : </b>"+arr[i]['booked']+"<button class='btn btn-success float-end' onclick='modalopenbooking(\""+arr[i]['id']+"\")'>View Bookings</button><br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Seats Remaining : </b>"+(arr[i]['count']-arr[i]['booked'])+"</div>"+"</li>";
    }
    }
    if(c==0){
      document.getElementById("previous-flight-warn").innerHTML='No Previous Filghts';
    }
  }
  }

function startrender(){
  setInterval(render,5000);
}
var fid;
async function modalopenflight(par){
  fid=par;
  var d=await getDoc(doc(db,"flight",par));
  d=d.data();
    var name=document.getElementById('flightnamedet');
    var from=document.getElementById('flightfromdet');
    var to=document.getElementById('flighttodet');
    var date=document.getElementById('flightdatedet');
    var time=document.getElementById('flighttimedet');
    name.value=d['name'];
    from.value=d['from'];
    to.value=d['to'];
    date.value=d['date'];
    time.value=d['time'];
    document.getElementById('viewdetails').click();
}
async function updateflight(){
    document.getElementById('warnings1').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
    var name=document.getElementById('flightnamedet');
    var from=document.getElementById('flightfromdet');
    var to=document.getElementById('flighttodet');
    var date=document.getElementById('flightdatedet');
    var time=document.getElementById('flighttimedet');
    var ft=date.value+" "+time.value;
    var dt=new Date(ft);
    var now=new Date();
    if(name.value==""||from.value==""||to.value==""||date.value==""||time.value==""){
      document.getElementById('warnings').innerHTML="Fill all fields";
      if(name.value==""){
        name.focus();
      }else if(from.value==""){
        from.focus();
      }else if(to.value==""){
        to.focus();
      }else if(date.value==""){
        date.focus();
      }else{
        time.focus();
      }
    }else{
    if(dt>now){
    console.log("Updating");
    await setDoc(doc(db,"flight",fid),{
      "count":60,
      "name":name.value,
      "from":from.value,
      "to":to.value,
      "date":date.value,
      "time":time.value,
      "ft":dt,
    },{merge:true});
    document.getElementById('warnings1').innerHTML="<span class='text-success'>Flight Updated</span>";
    await sleep(1000);
    document.getElementById('warnings1').innerHTML="";
    document.getElementById('flightviewclose').click();
  }else{
    document.getElementById('warnings1').innerHTML="Date & Time can't be less than current time";
  }
}
}
async function deleteflight(){
  document.getElementById('updflight').disabled=true;
  document.getElementById('warnings1').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
  if(confirm("Once Deleted You Cannot Recover it.\nDo you Want To continue?")){
    await setDoc(doc(db,"flight",fid),{
      "available":0,
    },{merge:true});
    document.getElementById('warnings1').innerHTML="<span class='text-success'>Flight Deleted</span>";
    await sleep(1000);
    document.getElementById('updflight').disabled=false;
    document.getElementById('warnings1').innerHTML="";
    document.getElementById('flightviewclose').click();
  }else{
  document.getElementById('updflight').disabled=false;
  document.getElementById('warnings1').innerHTML="<span class='text-success'>Delete Cancelled</span>";
  }
}
var searchdate="";
var searchtime="";
async function searchflights(){
  document.getElementById('flight-bookings').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
  searchdate=document.getElementById('flightsearchdate').value;
  searchtime=document.getElementById('flightsearchtime').value;
}
async function searchrenderinterval(){
  var q="";
  var arr=[];
  if(searchdate=="" && searchtime==""){
    q=query(collection(db,"flight"),where("available","==",1));
  }else if(searchdate!="" && searchtime==""){
    q=query(collection(db,"flight"),where("available","==",1),where("date","==",searchdate));
  }else if(searchtime!="" && searchdate==""){
    q=query(collection(db,"flight"),where("available","==",1),where("time","==",searchtime));
  }else{
    q=query(collection(db,"flight"),where("available","==",1),where("time","==",searchtime),where("date","==",searchdate));
  }
  var qs= await getDocs(q);
  qs.forEach(
    (doc)=>{
      arr.push(doc.data());
    }
  );
  if(arr.length>0){
  var list=document.getElementById('flight-bookings');
  list.innerHTML="";
  var dt=new Date();
    var c=0
    for(let i=0;i<arr.length;i++){
      if(new Date(arr[i]['date']+" "+arr[i]['time'])>dt){
        c=1;
        list.innerHTML+="<li class='list-group-item' style='margin:10px'><br><br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Flight Name : </b>"+arr[i]['name']+"<button class='btn btn-warning float-end' onclick='bookticket(\""+arr[i]['id']+"\")'>Book Ticket</button>"+"<br><div class='me-auto'>&nbsp;&nbsp;&nbsp;&nbsp;<b>From :</b>"+arr[i]['from']+"&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>To : </b>"+arr[i]['to']+"&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Date & Time : </b><strong><mark>"+arr[i]['date']+" at "+arr[i]['time']+"</mark></strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<b>Seats Remaining : </b>"+(arr[i]['count']-arr[i]['booked'])+"</div>"+"</li>";
      }
    }
    if(c==0){
      document.getElementById("flight-warnings").innerHTML='No available Filghts';
      document.getElementById('flight-bookings').innerHTML="";

    }else{
      document.getElementById("flight-warnings").innerHTML='';
    }
}else{
  document.getElementById("flight-warnings").innerHTML='No available Filghts';
  document.getElementById('flight-bookings').innerHTML="";
}
}
function searchrender(){
  setInterval(searchrenderinterval,3000);
}
var bid="";
async function bookticket(par){
  bid=par;
  var d=await getDoc(doc(db,"flight",par));
  d=d.data();
  var name=document.getElementById('flightnamebook');
  var from=document.getElementById('flightfrombook');
  var to=document.getElementById('flighttobook');
  var date=document.getElementById('flightdatebook');
  var time=document.getElementById('flighttimebook');
  name.value=d['name'];
  from.value=d['from'];
  to.value=d['to'];
  date.value=d['date'];
  time.value=d['time'];
  document.getElementById('namebook').value=user_name;
  document.getElementById('emailbook').value=user_email;
  document.getElementById('viewbooking').click();
}
async function bookflight(){
  document.getElementById('updflight').disabled=true;
  document.getElementById('warnings2').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
  var name=document.getElementById('flightnamebook');
  var from=document.getElementById('flightfrombook');
  var to=document.getElementById('flighttobook');
  var date=document.getElementById('flightdatebook');
  var time=document.getElementById('flighttimebook');
  var seats=document.getElementById('numbook').value;
  if(seats<6 && seats > 0){
    var fli=await getDoc(doc(db,"flight",bid));
    fli=fli.data();
    var booked=fli['booked']*1+seats*1;
    var nums="";
    for(let i=fli['booked']*1+1;i<=fli['booked']*1+seats*1;i++){
        nums+=i+" ";
    }
    var ava=fli['count']-booked;
    if(ava<0){
      document.getElementById("warnings2").innerHTML=seats+" Seats not available";
      document.getElementById('updflight').disabled=false;
      return;
    }
  var d=new Date().toLocaleString();
  console.log(d);
  var qs= await getDocs(collection(db,"flight-"+String(bid)));
  await setDoc(doc(db,"flight-"+String(bid),String(qs.size)),
  {
    "name":user_name,
    "email":user_email,
    "seats":seats,
    "booktime":d,
    "fid":bid
  },{merge:true}
  );
  qs= await getDocs(collection(db,"user-"+user_email));
  await setDoc(doc(db,"user-"+user_email,String(qs.size)),
  {
    "from":from.value,
    "to":to.value,
    "name":name.value,
    "date":date.value,
    "time":time.value,
    "booktime":d,
    "fid":bid,
    "seats":seats,
    "allocated":nums
  },{
    merge:true
  }
  );
  await setDoc(doc(db,"flight",bid),
  {
    "booked":booked
  },{
    merge:true
  }
  );
  document.getElementById('warnings2').innerHTML="<span class='text-success'>Ticket Booked</span>";
  await sleep(2000);
  document.getElementById('warnings2').innerHTML="";
  document.getElementById('numbook').value=1;
  document.getElementById('updflight').disabled=false;
  document.getElementById('flightbookclose').click();
}else{
  document.getElementById("warnings2").innerHTML="You can not Book More than 5 seats at a time and should book Minimum One Seat";
  document.getElementById('updflight').disabled=false;
}
}
async function bookingsrenderinterval(){
  var arr=[];
  var d=await getDocs(collection(db,"user-"+user_email));
  d.forEach(
    (doc)=>{
      arr.push(doc.data());
    }
  );
  if(arr.length==0){
    document.getElementById('booking-warnings').innerHTML="No Booking History";
    document.getElementById('booking-history').innerHTML="";
    return;
  }else{
    document.getElementById('booking-warnings').innerHTML="";
  }
  var list=document.getElementById('booking-history');
  var temp="";
  var status=""
  for(let i=arr.length-1;i>=0;i--){
    var flight=await getDoc(doc(db,"flight",arr[i]['fid']));
    flight=flight.data();
    if(flight['available']=='1'){
    if(new Date(arr[i]['date']+" "+arr[i]['time'])>new Date()){
      status="<span class='text-success' style='font-weight:bolder;'>Active</span>";
    }else{
      status="<span class='text-warning' style='font-weight:bolder;'>Expired</span>";
    }
  }else{
    status="<span class='text-danger' style='font-weight:bolder;'>Flight Cancelled</span>";
  }
    temp+="<li class='list-group-item ticket"+(i%3)+"' style='margin:10px'><br><br>&nbsp;&nbsp;&nbsp;&nbsp;";
    if(arr[i]['name']==flight['name']){
    temp+="<b>Flight Name : </b>"+arr[i]['name']+"<br>&nbsp;&nbsp;&nbsp;&nbsp;";
    }else{
      temp+="<b>Flight Name : </b><del>"+arr[i]['name']+"</del>&nbsp;<ins>"+flight['name']+"</ins><br>&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    temp+="<b>Booking Time : </b>"+arr[i]['booktime']+"<br>&nbsp;&nbsp;&nbsp;&nbsp;";
    if(arr[i]['date']==flight['date']){
    temp+="<b>Departure Date : </b>"+arr[i]['date']+"<br>&nbsp;&nbsp;&nbsp;&nbsp;";
    }else{
      temp+="<b>Departure Date : </b><del>"+arr[i]['date']+"</del>&nbsp;<ins>"+flight['date']+"</ins><br>&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    if(arr[i]['time']==flight['time']){
    temp+="<b>Departure time : </b>"+arr[i]['time']+"<br>&nbsp;&nbsp;&nbsp;&nbsp;";
    }else{
      temp+="<b>Departure time : </b><del>"+arr[i]['time']+"</del>&nbsp;<ins>"+flight['time']+"</ins><br>&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    if(arr[i]['from']==flight['from']){
    temp+="<b>From : </b>"+arr[i]['from']+"<br>&nbsp;&nbsp;&nbsp;&nbsp;";
    }else{
      temp+="<b>From : </b><del>"+arr[i]['from']+"</del>&nbsp;<ins>"+flight['from']+"</ins><br>&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    if(arr[i]['to']==flight['to']){
      temp+="<b>To : </b>"+arr[i]['to']+"<br>&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    else{
      temp+="<b>To : </b><del>"+arr[i]['to']+"</del>&nbsp;<ins>"+flight['to']+"</ins><br>&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    temp+="<b>Tickets Booked : </b>"+arr[i]['seats']+"<br>&nbsp;&nbsp;&nbsp;&nbsp;";
    temp+="<b>Seat Number(s) : </b>"+arr[i]['allocated']+"<br>&nbsp;&nbsp;&nbsp;&nbsp;";
    temp+="<b>Status : </b> "+status+"<br><br></li>";
  }
  list.innerHTML=temp;
}
function bookingsrender(){
  setInterval(bookingsrenderinterval,4000);
}
async function modalopenbooking(vid){
document.getElementById('passengermodal').click();
document.getElementById("passenger-warning").innerHTML="";
document.getElementById('passenger-history').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
var fli=await getDocs(collection(db,"flight-"+vid));
var arr=[];
fli.forEach(
  (doc)=>{
    arr.push(doc.data());
  }
);
if(arr.length==0){
  document.getElementById("passenger-warning").innerHTML="No Tickets Booked at the moment";
  document.getElementById('passenger-history').innerHTML="";
  return;
}else{
  var list=document.getElementById('passenger-history');
  list.innerHTML="";
  for(let i=arr.length-1;i>=0;i--){
    list.innerHTML+="<li class='list-group-item' style='margin:10px'><b>Passenger Name : </b>"+arr[i]['name']+"<br><b>Seats Booked : </b>"+arr[i]['seats']+"<br><b>Booking Time : </b>"+arr[i]['booktime']+"</li>";
  }
}
}
  window.add_user=add_user;
  window.user_login=user_login;
  window.inituser=inituser;
  window.logout=logout;
  window.changepassword=changepassword;
  window.red_home=red_home;
  window.red_booknow=red_booknow;
  window.red_bookings=red_bookings;
  window.admin_login=admin_login;
  window.initadmin=initadmin;
  window.addflight=addflight;
  window.updateflight=updateflight;
  window.modalopenflight=modalopenflight;
  window.deleteflight=deleteflight;
  window.searchrender=searchrender;
  window.searchflights=searchflights;
  window.bookticket=bookticket;
  window.bookflight=bookflight;
  window.bookingsrender=bookingsrender;
  window.modalopenbooking=modalopenbooking;


  
