// ! 設定壓力和療癒初始值

var stress = 0;
var heal = 20;
var q2_score = 0;
q2_score=parseInt(q2_score);
var q2_flag="no";
var q5_score = 0;
q5_score=parseInt(q5_score);
var q6_score = 0;
var q7_score = 0;
q7_score=parseInt(q7_score);
var q7_flag="no";
var information, pages, total_page, now_page = 1;
var content = [];
var state = "none";
var showHide = true;
var db, st, loginUser, db_email = "", db_type = "student", db_account = "1231233",  db_image = {};

var nseq = [3, 3, 4, 3, 4, 3, 3, 4], nimg = [1, 0, 0, 1, 0, 0, 0, 0];

var finish_flag = [];
var addStress = [];

var q1_data = [];
var q2_data = [];
var q3_data = [];
var img_q4 = "no";
var q5_data = [];
var q6_data = [];
var q7_data = [];
var img_q8 = "no";