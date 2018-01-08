


function get_account_basic(account_name){
// information is account_name, [false] if the account has no rewards or other activity
// information is accountname, [key array] where key array is alternating keys and their information (like a dict but idk how to do that in js)

var account_inforamtion = [];
account_inforamtion.push(account_name);


var end = false;
var limit = 0;

var start = 0;
var step_size = 1000;
steem.api.getAccountHistory(our_memo_account, -1, 1, function(err, result) {


start = result[0][0]-step_size;
limit = result[0][0];
finish_account_history(account_name,start,limit,step_size,end)



});}

function finish_account_history(account_name,start,limit,step_size,end){

var x =0
while(true){


  steem.api.getAccountHistory("anarchyhasnogods", start, step_size, function(err, result) {
  //console.log(err,result);

  console.log(err,start,limit,result)
  console.log(err, "w")
  console.log(start,limit,result)


var memo_list = get_memos(result);


if(memo_list){

return memo_list


}


//end
if(end){
return false
}



start -= step_size
if(start <= 0){
start = 1
end = true
}


});






}}



function get_memos(history_list){




for(i=0; i<history_list.length; i++){

var memo = []

try{




if(history_list[i][1]['op'][0] == "transfer"){
  if(history_list[i][1]['op'][1]["from"] == our_account_name){




  memo = history_list[i][1]['op'][1]["memo"]

  return memo

}


}}catch(err){}






}
return false


}




function memo_read(memo){

memo.split(':')
var memo_array = []

for(i=0; i < memo.length/4; i++){
memo_array.push([memo[i+1],memo[i+3]])


}


return memo_array
}


function get_val(key, array_obj){

for(i=0; i < array_obj.length/2; i++)

if(array_obj[i * 2] == key){


return array_obj[i*2 + 1]

}


}
