// Modules are ids 1-1000
// Add module buttons are 1001-2000
// Delete module buttons are 2001-3000



function build_modules(module_info){
  if(module_info.length == 0){

return

  }

  var size = -1;
  for(i = 0; i <= 1000; i++){


    try{

      document.getElementById(''+i).remove();}




  catch(err) {

      i = 1000000000000
  }}

for (i = 0; i < module_info.length; i++) {
  //This takes every set of module info and uses it
  //Position a div -> import correct html file into div
  var div = document.createElement("div");
  div.setAttribute('id', "" + i);
  div.style.position = "absolute";
  div.style.padding = '0px';
  div.style.margin = '0px';
  div.style.top = ""+module_info[i][1] + "px";
  div.style.left = ""+module_info[i][0] + "px";

  //document.write(div.);


  if (div.classList) {
    div.classList.add(module_info[i][3]);
  } else {
    div.className += " "+ module_info[i][3];
   }


  document.getElementById("main").appendChild(div);

  $("#"+i).load(module_info[i][2]);
  size += 1;

}
return size;
}





function drop_down_load() {
if(drop_down_loaded == false){




  $("#edit_add").load("dropdown.html")
  $("#edit_delete").load("dropdown2.html")
}
not_used = []
used = []
drop_down_loaded = true

  var is_false = false
  for (i = 0; i < all_possible_modules.length; i++) {
      is_false = false
      for (ii = 0; ii < module_info.length; ii++) {



  if(module_info[ii][2] == all_possible_modules[i][0]){
  is_false = true
  used.push([module_info[ii][2], all_possible_modules[i][1]])

  }}
  if(is_false != true){
  not_used.push([all_possible_modules[i][0],all_possible_modules[i][1]])
  }}
waitthing()
  }

function waitthing(){
try{

drop_down_populate()

}

catch(err){

 setTimeout(waitthing, 50);

}



}


function drop_down_populate() {


  //$("#edit_delete").load("dropdown.html");

  for(c = 1000; c <= 2000; c++){
try{
  document.getElementById(''+c).remove();
  account.log(c)
}
catch(err){

  }}

for(c = 2000; c <= 3000; c++){
try{
document.getElementById(''+c).remove();
console.log(c)

}
catch(err){}}


  for(c=0; c < not_used.length; c++){


    var button = document.createElement("button");
    button.innerHTML = not_used[c][0];
    //button.addEventListener("click", add_module)
    button.setAttribute('tabindex', "-1");
    var new_id = c + 1000
    button.setAttribute('id', "" + new_id);


    document.getElementById("add"+not_used[c][1]).appendChild(button);
    var num = c

    button.addEventListener ("click", function(event) {

    num = event.target.id - 1000

    add_module(not_used[num][0])


    });
  }




  for(c=0; c < used.length; c++){


    var button = document.createElement("button");
    button.innerHTML = used[c][0];
    //button.addEventListener("click", add_module)
    button.setAttribute('tabindex', "-1");
    var new_id = c + 2000
    button.setAttribute('id', "" + new_id);


    document.getElementById("del"+used[c][1]).appendChild(button);
    var num = c

    button.addEventListener ("click", function(event) {

      num = event.target.id - 2000


      delete_module(used[num][0])


    });
  }


}




function edit_mode() {
drop_down_load()

  for(i = 0; i <= 1000; i++){


    try {



  var element = document.getElementById(""+i),
      x = $(element).position().left, y = $(element).position().top;

  interact(element)
    .draggable({
      snap: {
        targets: [
          interact.createSnapGrid({ x: 10, y: 10 })
        ],
        range: Infinity,
        relativePoints: [ { x: 0, y: 0 } ]
      },
      inertia: false,
      restrict: {
        restriction: element.parentNode,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
        endOnly: true
      }
    })
    .on('dragmove', function (event) {
      x = event.dx + $(event.target).position().left;
      y = event.dy + $(event.target).position().top;

      event.target.style.top = "" + y + "px";
      event.target.style.left = "" + x + "px";
    });
  }

    catch(err) {
        i = 1000000000000
    }


// Create delete, add, and save buttons.

}




document.getElementById('edit_mode_button').style.visibility = 'hidden';
document.getElementById('save_edit_button').style.visibility = 'visible';


}





function add_module(module_){




module_info.push([0 ,0 ,module_, "light"])

build_modules(module_info)

edit_mode()


}


function delete_module(module_name)  {

  for (i = 0; i < module_info.length; i++) {

    try{
    if (module_info[i][2] == module_name) {
      document.getElementById(""+i).remove();
      module_info.splice(i,1);

      break

  }}


  catch(err){}


  }
build_modules(module_info)}


function save_edits(){
  drop_down_loaded = false
  document.getElementById('edit_mode_button').style.visibility = 'visible';
  document.getElementById('save_edit_button').style.visibility = 'hidden';

  var myNode = document.getElementById("edit_add");
while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
}


 myNode = document.getElementById("edit_delete");
while (myNode.firstChild) {
  myNode.removeChild(myNode.firstChild);
}
  var all_modules = []

  for(i = 0; i <= 1000; i++){


    try {
      var element_var = document.getElementById(""+i);
      var positon_var = $(element_var).position();
      var name = module_info[i][2]
      var theme = module_info[i][3]
      all_modules.push([positon_var.left, positon_var.top, name, theme])



      interact.isSet(element_var);         // false
      interact(element_var).draggable();   // `qqfalse
      interact(element_var).resizable();
      interact(element_var).draggable(false);



    }


      catch(err) {

          i = 1000000000000
      }




}
old_info = module_info
module_info = all_modules
build_modules(module_info)

}

//dropdown is needed on every page for edit add/remove


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
