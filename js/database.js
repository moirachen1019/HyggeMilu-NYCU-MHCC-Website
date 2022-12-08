var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

firebase.initializeApp(firebaseConfig);
db = firebase.database();
st = firebase.storage();



function database_init(){
	firebase.auth().onAuthStateChanged((user) => {
		if(user){
			state="user";

			loginUser = user;
			db_email = loginUser.email;
			db.ref("/users/" + loginUser.uid).once("value")
			.then((d) => {
				if(d.exists()){
					db_type = d.child("type").val();
					db_account = d.child("account").val();
					if(d.child("HyggeMilu").exists()){
						let flag=0;
						for(let i = 1; i <= 8; i++){ //確認各關卡是否有完成
							db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+i+"/finish?").once('value', function (snapshot) {
								finish_flag[i] = snapshot.val();
								if(finish_flag[i]=="yes"){
									$("#Q"+i).addClass("finished");
									document.getElementById("description" + i).innerHTML = document.getElementById("education" + i).innerHTML;
									document.getElementById("complete" + i).src = "img/q"+i+"_done.png";
								}
								else{
									flag=0;
								}
							});
						}
						if( flag ){
							$("#form-link-column").show();
						}
						else{
							$("#form-link-column").hide();
						}
						pages = $(".page");
						total_page = pages.length;
						db.ref("/users/" + loginUser.uid + "/HyggeMilu/score/stress").once('value', function (snapshot) {
							stress = snapshot.val();
							document.getElementById("stress").textContent = stress; 
						});
						db.ref("/users/" + loginUser.uid + "/HyggeMilu/score/heal").once('value', function (snapshot) {
							heal = snapshot.val();
							document.getElementById("heal").textContent = heal; 
						});
						for(let i=1;i<=8;i++){
							updateData(i);
						}
					}
				}
				else{ //在realtime database建立一個資料夾，名稱即為使用者的uid，創造database和auth的連結
					db.ref("/users/" + loginUser.uid).set({
						type: db_type,
						account: db_account
					});
				}
				if(db_type=="student"){
					document.getElementById("type-infor").innerHTML="<b>學號：</b>";
				}else if(db_type=="teacher"){
					document.getElementById("type-infor").innerHTML="<b>教職員號：</b>";
				}else{
					document.getElementById("type-infor").innerHTML="<b>帳號：</b>";
				}
				document.getElementById("account-infor").textContent=db_account;
				document.getElementById("email-infor").textContent=db_email;
			})
			.catch((err) => {
				window.alert('登入或是創建帳號時資料發生錯誤，請聯絡遊戲工作人員');
				firebase.auth().signOut();
				console.log(err.code + ": " + err.message);
				window.alert(err.code + ": " + err.message);
			});
			$("#login-page").hide();
			$("#gohome-infor").show();
			$("#make-page").hide();
			$("#infor-page").show();
			$("#loading").hide();
		}
		else{
				state = "login";
				$("#login-page").show();
				$("#gohome-infor").hide();
				$("#make-page").hide();
				$("#infor-page").hide();
				$("#loading").hide();
		}
	});
}

function changeType(){
	let type=document.getElementById("type").value;
	if(type=="student"){
		document.getElementById("type-make").innerHTML = "<b>學號：</b>";
	}
	else if(type=="teacher"){
		document.getElementById("type-make").innerHTML = "<b>教職員代碼：</b>";
	}
	else if(type=="other"){
		document.getElementById("type-make").innerHTML = "<b>自行設定帳號（英數字）：</b>";
	}
}

function change_state(){
    if(state == "login"){
        state = "make";
		$("#login-page").hide();
		$("#gohome-infor").hide();
		$("#make-page").show();
		$("#infor-page").hide();
    }
    else if(state == "make"){
        state = "login";
		$("#login-page").show();
		$("#gohome-infor").hide();
		$("#make-page").hide();
		$("#infor-page").hide();
    }
}

function confirm(){
    document.getElementById("confirm").disabled = true;
    if(state == "make"){
		let identity = document.getElementById("type").value;
        let password = document.getElementById("password-make").value;
        let email = document.getElementById("email-make").value;
		db_type=identity;
		db_account=document.getElementById("account-make").value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
			db.ref("/users/" + loginUser.uid).set({
				type: db_type,
				account: db_account
			});

		})
        .catch((err) => {
            if(err.code == "auth/email-already-in-use"){
				$("#warning-make").show();
				document.getElementById("warning-make").innerHTML="email已經被使用過了，請改用其他email";
				setTimeout("$('#warning-make').hide();", 4000 );
            }
			else if(err.code == "auth/invalid-email"){
				$("#warning-make").show();
				document.getElementById("warning-make").innerHTML="email格式錯誤";
				setTimeout("$('#warning-make').hide();", 4000 );
			}
			else if(err.code == "auth/weak-password"){
				$("#warning-make").show();
				document.getElementById("warning-make").innerHTML="密碼強度太弱了，建議換其他密碼喔！";
				setTimeout("$('#warning-make').hide();", 4000 );
			}
			else{
				setTimeout("$('#warning-login').show();", 1000 );
				document.getElementById("warning-make").innerHTML="創建錯誤！<br>請確認Email是否已被使用，以及檢查Email格式";
				setTimeout("$('#warning-make').hide();", 5000 );
			}
        });
    }
    else if(state == "login"){
        let email = document.getElementById("email-login").value;
        let password = document.getElementById("password-login").value;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((err) => {
            if(err.code == "auth/invalid-email"){
				$("#warning-login").show();
				document.getElementById("warning-login").innerHTML="email格式錯誤";
				setTimeout("$('#warning-login').hide();", 4000 );
			}
			else if(err.code == "auth/user-not-found"){
				$("#warning-login").show();
				document.getElementById("warning-login").innerHTML="你還沒創建帳號喔！";
				setTimeout("$('#warning-login').hide();", 4000 );
			}
            else if(err.code == "auth/wrong-password"){
				$("#warning-login").show();
				document.getElementById("warning-login").innerHTML="密碼錯誤";
				setTimeout("$('#warning-login').hide();", 4000 );
			}
			else{
				setTimeout("$('#warning-login').show();", 1000 );
				document.getElementById("warning-login").innerHTML="登入錯誤！請確認Email和密碼是否正確<br>還沒有帳號？請先創建";
				setTimeout("$('#warning-login').hide();", 5000 );
			}
        });
    }
    document.getElementById("confirm").disabled = false;
}

function ch_pwd_type(){
	if(state=="login"){
		var pwd = document.getElementById('password-login');
	}
	else if(state="make"){
		var pwd = document.getElementById('password-make');
	}

	if (showHide) {
		pwd.type = 'text';
		showHide = false;
	}
	else {
		pwd.type = 'password';
		showHide = true;
	}
}

function forgot_pwd(){
    var email = document.getElementById("email-login").value;
    if(email == ""){
        window.alert("請先在上方欄位填入遊戲使用的信箱，再按忘記密碼，密碼重置連結會送至此信箱");
    }
    else{
        firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            window.alert("密碼重置連結已送至你的信箱，請至信箱更改新密碼");
        })
        .catch((err) => {
            if(err.code == "auth/invalid-email"){
                window.alert("email格式錯誤");
            }
            else if(err.code == "auth/user-not-found"){
                window.alert("無此信箱紀錄");
            }
            else{
                console.log(err.code + ": " + err.message);
                window.alert("登入或是創建帳號時資料發生錯誤，請聯絡工作人員，或是使用" + ' "登入發生問題"');
            }
        });
    }
}

function logout(){
	firebase.auth().signOut()
	.then(function() {
		$("#login-page").hide();
		$("#make-page").hide();
		$("#infor-page").hide();
		$("#loading").show();
		location.reload();
	})
	.catch((err) => {
		window.alert("出現問題，請聯絡遊戲工作人員，或是使用" + ' "關於遊戲" ' + "頁面的" + ' "登入或創帳發生問題嗎？" ');
		console.log(err.code + ": " + err.message);
	});
}

function insert(question,count){
	let formElement = document.getElementById("q"+question+"_form");
	if(question==6){ //一題單選
		db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/q"+question+"_1" ).set( formElement[count].id )
		.catch((err) => {console.log(err.code + ": " + err.message);});
	} 
	else if(question==2||question==7){ //多選題
		q2_score=0;
		for(let i=0 ; i<count ; i++){
			if(formElement[i].checked){
				var adder = parseInt(formElement[i].value);
				if(question==2){
					q2_score += adder;
				}
				else if(question==7){
					q7_score += adder;
				}
				db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/q"+question+"_"+(i+1) ).set("selected")
				.catch((err) => {console.log(err.code + ": " + err.message);});
			}
			else{
				db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/q"+question+"_"+(i+1) ).set("no")
				.catch((err) => {console.log(err.code + ": " + err.message);});
			}
		}
	}
	else{ //文字、多題單選
		for(let i=0 ; i<count ; i++){
			db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/q"+question+"_"+(i+1) ).set( formElement[i].value )
			.catch((err) => {console.log(err.code + ": " + err.message);});
		}
	}
	updateData(question);
	goEducation(question);
}

function insertImg(question) { //圖片題
	// 取得檔案資訊
	const imgFile = event.target.files[0];

	// 取得 storage 對應的位置
	const storageReference = firebase.storage().ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question);

	// .put() 方法把東西丟到該位置裡
	const task = storageReference.put(imgFile);
	if(question==4){
		img_q4="yes";
	}
	else if(question==8){
		img_q8="yes";
	}
	updateData(question);
}

function updateData(question){
	db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/finish?").once('value', function (snapshot) {
		finish_flag[question] = snapshot.val();
	});
	db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/addStress").once('value', function (snapshot) {
		addStress[question] = snapshot.val();
	});
	switch(question){
		case 1:
			for(let i = 1; i <= 3; i++){
				db.ref("/users/" + loginUser.uid + "/HyggeMilu/q1/q1_"+i).once('value', function (snapshot){
					q1_data[i] = snapshot.val();
					if(q1_data[i]=="undefined"){
						q1_data[i]="";
					}
				});
			}
			break;
		case 2:
			for(let i = 1; i <= 10; i++){
				db.ref("/users/" + loginUser.uid + "/HyggeMilu/q2/q2_"+i).once('value', function (snapshot) {
					q2_data[i] = snapshot.val();
					if(q2_data[i]=="undefined"){
						q2_data[i]="";
					}
				});
			}
			db.ref("/users/" + loginUser.uid + "/HyggeMilu/q2/score").once('value', function (snapshot) {
				q2_score = snapshot.val();
				if(q2_score=="undefined"){
					q2_score="";
				}
			});
			break;
		case 3:
			db.ref("/users/" + loginUser.uid + "/HyggeMilu/q3/q3_1").once('value', function (snapshot) {
				q3_data[1] = snapshot.val();
				if(q3_data[1]=="undefined"){
					q3_data[1]="";
				}
			});
			break;
		case 5:
			for(let i = 1; i <= 3; i++){
				db.ref("/users/" + loginUser.uid + "/HyggeMilu/q5/q5_"+i).once('value', function (snapshot) {
					q5_data[i] = snapshot.val();
					if(q5_data[i]=="undefined"){
						q5_data[i]="";
					}
				});
			}
			db.ref("/users/" + loginUser.uid + "/HyggeMilu/q5/score").once('value', function (snapshot) {
				q5_score = snapshot.val();
			});
			break;
		case 6:
			db.ref("/users/" + loginUser.uid + "/HyggeMilu/q6/q6_1").once('value', function (snapshot) {
				q6_data[1] = snapshot.val();
			});
			db.ref("/users/" + loginUser.uid + "/HyggeMilu/q6/score").once('value', function (snapshot) {
				q6_score = snapshot.val();
			});
			break;
		case 7:
			for(let i = 1; i <= 6; i++){
				db.ref("/users/" + loginUser.uid + "/HyggeMilu/q7/q7_"+i).once('value', function (snapshot) {
					q7_data[i] = snapshot.val();
					if(q7_data[i]=="undefined"){
						q7_data[i]="";
					}
				});
			}
			break;
	}

}