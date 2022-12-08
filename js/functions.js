function open_blocker(flag = false){
	$("#next").hide();
	$("#prev").hide();
	if(flag) $("#blocker").addClass("black").show();
	$("#blocker").show();
}

function close_blocker(flag = false){
	if(flag) $("#blocker").removeClass("black").hide();
	$("#blocker").hide();
	if(now_page < total_page && state == "user") $("#next").show();
	if(now_page > 2 && state == "user") $("#prev").show();
}

function page(from, to){
	if(from < to){
		var p = pages.eq(-from);
		p.addClass("page_down");
		from += 1;
	}
	else{
		from -= 1;
		var p = pages.eq(-from);
		p.removeClass("page_down");
		setTimeout(function(){
		}, 300);
	}

	if(from != to){
		setTimeout(function(){
			page(from, to);
		}, 100);
	}
	else{
		now_page = to;
		setTimeout(function(){
			close_blocker();
		}, 500);
	}
}

function goto_page(idx){
	open_blocker();
	page(now_page, idx);
}

function goToList(){
	firebase.auth().onAuthStateChanged((user) => {
		if(user){
			goto_page(2);
		}
		else{
			goto_page(3);
		}
	});
	document.getElementById("stress").textContent = stress; 
	document.getElementById("heal").textContent = heal; 
	$("#grade").show();
}

function checkSequence(question) {
	if(document.getElementById("Q"+(question-1)).classList.contains("finished")){
		goto_page(question+3);
	}
	else{
		window.alert("請按照順序完成喔！");
	}
}

function goGameDescription(){
	goto_page(3);
	$("#gameDescription").show();
	$("#infor-content").hide();
	$("#goInfor").show();
}

function goInformation(){
	$("#gameDescription").hide();
	$("#goInfor").hide();
	$("#forget-page").hide();
	$("#infor-content").show();
}

function goForgot_pwd() {
	$("#forget-page").show();
	$("#infor-content").hide();
}

function goMission(question){
	if(addStress[question]!="yes"){
		changeStress(10);
		db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/addStress" ).set("yes")
		.catch((err) => {console.log(err.code + ": " + err.message);});
		addStress[question]="yes";
		db.ref("/users/" + loginUser.uid + "/HyggeMilu/score/stress" ).set( stress )
		.catch((err) => {console.log(err.code + ": " + err.message);});
	}
	let target1,target2,target3;
	target1 = "description" + question;
	target2 = "mission" + question;
	target3 = "#q"+question+"_nosubmit";
	document.getElementById(target1).innerHTML=document.getElementById(target2).innerHTML;
	if(question==2||question==5||question==6||question==7){ //單選多選題需要
		$("#q"+question+"_form").show();
		$("#q"+question+"_answer").hide();
	}
	$(target3).hide();
}

function goBackMission(question){
	let target1,target2,target3;
	target1 = "description" + question;
	target2 = "mission" + question;
	target3 = "#q"+question+"_submit";
	document.getElementById(target1).innerHTML=document.getElementById(target2).innerHTML;
	switch(question){
		case 1:
			for(let i = 1; i <= 3; i++){
				document.getElementById("q1_"+i).value = q1_data[i];
			}
			break;
		case 2:
			for(let i = 1; i <= 10; i++){
				if(q2_data[i]=="selected"){
					$("#q2"+i).addClass("selected");
				}
			}
			$("#q2_form").hide();
			$("#q2_answer").show();
			break;
		case 3:
			document.getElementById("q3_1").value = q3_data[1];
			break;
		case 4:
			let fileRef4 = firebase.storage().ref("/users/" + loginUser.uid + "/HyggeMilu/q4")
			// .ref() 指向已存在 storage 中的檔案位置後 可以透過 getDownloadURL 取得連結
			fileRef4.getDownloadURL().then(function (url) {
				let preview4 = document.getElementById('preview4');
				preview4.src = url;
			})
		case 5:
			for(let i = 1; i <= 3; i++){
				document.getElementById("q5_"+i+"_ans").innerHTML = q5_data[i];
			}
			$("#q5_form").hide();
			$("#q5_answer").show();
			break;
		case 6:
			if(q6_data[1]=="A"){
				$("#AA").addClass("selected");
			}
			else if(q6_data[1]=="B"){
				$("#BB").addClass("selected");
			}
			else if(q6_data[1]=="C"){
				$("#CC").addClass("selected");
			}
			else if(q6_data[1]=="D"){
				$("#DD").addClass("selected");
			}
			$("#q6_form").hide();
			$("#q6_answer").show();
			break;
		case 7:
			for(let i = 1; i <= 6; i++){
				if(q7_data[i]=="selected"){
					$("#q7"+i).addClass("selected");
				}
			}
			$("#q7_form").hide();
			$("#q7_answer").show();
			break;
		case 8:
			let fileRef8 = firebase.storage().ref("/users/" + loginUser.uid + "/HyggeMilu/q8")
			// .ref() 指向已存在 storage 中的檔案位置後 可以透過 getDownloadURL 取得連結
			fileRef8.getDownloadURL().then(function (url) {
				let preview8 = document.getElementById('preview8');
				preview8.src = url;
			})
			break
	}
	$(target3).hide();
}

function goEducation(question){
	switch(question){
		case 1:
			if( ( (document.getElementById("q1_1").value) != "" )&&( (document.getElementById("q1_2").value) != "")&&( (document.getElementById("q1_3").value) != "") ){
				if(finish_flag[1]!="yes"){
					changeHeal(10);
					let flag=1;
					for(let i=1;i<=8;i++){
						if(i!=question){
							if(finish_flag[i]!="yes"){
								flag=0;
								break;
							}
						}
					}
					if(flag){
						window.alert("恭喜你完成探險！請填寫本頁最下方表單以參加抽獎");
						$("#form-link-column").show();
						$(".finished-form").show();
					}
				}
				document.getElementById("score_q1").innerHTML = "恭喜你的療癒值提升 10 分，獲得寶物！";
				showEducation(1);
			}
			else{
				window.alert("探險沒有成功> < 請完成回答");
				goMission(question);
			}
			break;
		case 2:
			if(q2_score>=0 && ( (q2_flag=="yes")||finish_flag[2]=="yes" ) ){
				if(finish_flag[2]!="yes"){
					changeHeal(q2_score);
					let flag=1;
					for(let i=1;i<=8;i++){
						if(i!=question){
							if(finish_flag[i]!="yes"){
								flag=0;
								break;
							}
						}
					}
					if(flag){
						window.alert("恭喜你完成探險！請填寫本頁最下方表單以參加抽獎");
						$("#form-link-column").show();
						$(".finished-form").show();
					}
					db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/score").set(q2_score)
					.catch((err) => {console.log(err.code + ": " + err.message);});
				}
				else{
					db.ref("/users/" + loginUser.uid + "/HyggeMilu/q2/score").once('value', function (snapshot) {
						q2_score = snapshot.val();
					});
				}
				document.getElementById("score_q2").innerHTML = "恭喜你的療癒值提升" + q2_score + "分，獲得寶物！";
				showEducation(2);
			}
			else{
				window.alert("探險沒有成功> < 請再試一次");
				q2_flag="no";
				goMission(question);
			}
			break;
		case 3:
			if( (document.getElementById("q3_1").value) != ""){
				if(finish_flag[3]!="yes"){
					let flag=1;
					for(let i=1;i<=8;i++){
						if(i!=question){
							if(finish_flag[i]!="yes"){
								flag=0;
								break;
							}
						}
					}
					if(flag){
						window.alert("恭喜你完成探險！請填寫本頁最下方表單以參加抽獎");
						$("#form-link-column").show();
						$(".finished-form").show();
					}
				}
				document.getElementById("score_q3").innerHTML = "恭喜你的療癒值提升 10 分，獲得寶物！";
				showEducation(3);
			}
			else{
				window.alert("探險沒有成功> < 請完成回答");
				goMission(question);
			}
			break;
		case 4:
			if(img_q4=="yes" || finish_flag[4]=="yes"){
				if(finish_flag[4]!="yes"){
					let flag=1;
					for(let i=1;i<=8;i++){
						if(i!=question){
							if(finish_flag[i]!="yes"){
								flag=0;
								break;
							}
						}
					}
					if(flag){
						window.alert("恭喜你完成探險！請填寫本頁最下方表單以參加抽獎");
						$("#form-link-column").show();
						$(".finished-form").show();
					}
				}
				document.getElementById("score_q4").innerHTML = "恭喜你的療癒值提升 10 分，獲得寶物！";
				showEducation(4);
			}
			else{
				window.alert("探險沒有成功> < 請上傳圖片");
				goMission(question);
			}
			break;
		case 5:
			if( q5_score>=6 ){
				if(finish_flag[5]!="yes"){
					changeHeal(q5_score);
					let flag=1;
					for(let i=1;i<=8;i++){
						if(i!=question){
							if(finish_flag[i]!="yes"){
								flag=0;
								break;
							}
						}
					}
					if(flag){
						window.alert("恭喜你完成探險！請填寫本頁最下方表單以參加抽獎");
						$("#form-link-column").show();
						$(".finished-form").show();
					}
					db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/score").set(q5_score)
					.catch((err) => {console.log(err.code + ": " + err.message);});
				}
				else{
					db.ref("/users/" + loginUser.uid + "/HyggeMilu/q5/score").once('value', function (snapshot) {
						q5_score = snapshot.val();
					});
				}
				document.getElementById("score_q5").innerHTML = "恭喜你的療癒值提升" + q5_score + "分，獲得寶物！";
				showEducation(5);
			}
			else{
				window.alert("探險沒有成功> < 請再試一次");
				goMission(question);
			}
			break;
		case 6:
			if( (q6_score != 0)){
				if(finish_flag[6]!="yes"){
					changeHeal(q6_score);
					let flag=1;
					for(let i=1;i<=8;i++){
						if(i!=question){
							if(finish_flag[i]!="yes"){
								flag=0;
								break;
							}
						}
					}
					if(flag){
						window.alert("恭喜你完成探險！請填寫本頁最下方表單以參加抽獎");
						$("#form-link-column").show();
						$(".finished-form").show();
					}
					db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/score").set(q6_score)
					.catch((err) => {console.log(err.code + ": " + err.message);});
				}
				else{
					db.ref("/users/" + loginUser.uid + "/HyggeMilu/q6/score").once('value', function (snapshot) {
						q6_score = snapshot.val();
					});
				}
				if(q6_score>0){
					document.getElementById("score_q6").innerHTML = "恭喜你的療癒值提升" + q6_score + "分，獲得寶物！";
				}else{
					document.getElementById("score_q6").innerHTML = "糟糕！你的療癒值下降" + -q6_score + "分，應該可以有更好的應對方式的...";
				}
				showEducation(6);
			}
			else{
				window.alert("探險沒有成功> < 請再試一次");
				goMission(question);
			}
			break;
		case 7:
			if(q7_score>=0 && ( (q7_flag=="yes")||finish_flag[7]=="yes" ) ){
				if(finish_flag[7]!="yes"){
					changeHeal(q7_score);
					let flag=1;
					for(let i=1;i<=8;i++){
						if(i!=question){
							if(finish_flag[i]!="yes"){
								flag=0;
								break;
							}
						}
					}
					if(flag){
						window.alert("恭喜你完成探險！請填寫本頁最下方表單以參加抽獎");
						$("#form-link-column").show();
						$(".finished-form").show();
					}
					db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/score").set(q7_score)
					.catch((err) => {console.log(err.code + ": " + err.message);});
				}
				else{
					db.ref("/users/" + loginUser.uid + "/HyggeMilu/q7/score").once('value', function (snapshot) {
						q7_score = snapshot.val();
					});
				}
				document.getElementById("score_q7").innerHTML = "恭喜你的療癒值提升"+q7_score+"分，獲得寶物！";
				showEducation(7);
			}
			else{
				window.alert("探險沒有成功> < 請再試一次");
				q7_flag="no";
				goMission(question);
			}
			break;
		case 8:
			if(img_q8=="yes" || finish_flag[8]=="yes"){
				if(finish_flag[8]!="yes"){
					changeHeal(10);
					let flag=1;
					for(let i=1;i<=8;i++){
						if(i!=question){
							if(finish_flag[i]!="yes"){
								flag=0;
								break;
							}
						}
					}
					if(flag){
						window.alert("恭喜你完成探險！請填寫本頁最下方表單以參加抽獎");
						$("#form-link-column").show();
						$(".finished-form").show();
					}
				}
				document.getElementById("score_q8").innerHTML = "恭喜你的療癒值提升 10 分，獲得寶物！";
				showEducation(8);
			}
			else{
				window.alert("探險沒有成功> < 請上傳圖片");
				goMission(question);
			}
			break;
	}
	db.ref("/users/" + loginUser.uid + "/HyggeMilu/score/stress" ).set( stress );
	db.ref("/users/" + loginUser.uid + "/HyggeMilu/score/heal" ).set( heal );
}

function showEducation(question){
	let target1,target2,target3,target4;
	target1 = "description" + question;
	target2 = "education" + question;
	target3 = "complete" + question;
	target4 = "img/q"+question+"_done.png";
	document.getElementById(target1).innerHTML = document.getElementById(target2).innerHTML;
	document.getElementById(target3).src = target4;
	$("#Q"+question).addClass("finished");
	db.ref("/users/" + loginUser.uid + "/HyggeMilu/q"+question+"/finish?").set("yes")
	.catch((err) => {console.log(err.code + ": " + err.message);});
	finish_flag[question]="yes";
}

function changeStress(number){
	stress += number;
	document.getElementById("stress").innerHTML = stress; 
}

function changeHeal(number){
	heal += number;
	document.getElementById("heal").innerHTML = heal; 
}

function q5(index){
	if(index == 1){
		if( document.getElementById("q5_1").value=="說到做到" ){
			q5_1 = 4;
		}
		else{
			q5_1 = 0;
		}
	}else if(index==2){
		if( document.getElementById("q5_2").value=="重視" ){
			q5_2 = 3;
		}
		else{
			q5_2 = 0;
		}	
	}else if(index==3){
		if( document.getElementById("q5_3").value=="做到自己答應的事" ){
			q5_3 = 3;
		}
		else{
			q5_3 = 0;
		}		
	}else if(index==4){
		q5_1 = parseInt(q5_1);
		q5_2 = parseInt(q5_2);
		q5_3 = parseInt(q5_3);
		q5_score = q5_1 + q5_2 + q5_3;
		insert(5,3);
	}

}

function q6(){
	let q6_answer=document.getElementsByName("q6_1");
	for(let i=0; i<4; i++){
		if(q6_answer[i].checked){
			q6_score = q6_answer[i].value;
			q6_score=parseInt(q6_score);
			insert(6,i);
			break;
		}
	}

}

function previewImg(question){
	var file = $('#img'+question)[0].files[0];
	var reader = new FileReader;
	reader.onload = function(e) {
	$('#preview'+question).attr('src', e.target.result);
	};
	reader.readAsDataURL(file);
}

function q2(){
	q2_flag="yes";
}
function q7(){
	q7_flag="yes";
}