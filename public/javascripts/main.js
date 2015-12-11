// Following code copied from example on bootsnip.com
// http://bootsnipp.com/snippets/featured/todo-example

var o = 0;
var c = 0;
var todoItems = [];
var doneItems = [];

// all done btn
$("#checkAll").click(function() {
    AllDone();
});

//create todo
$('.add-todo').on('keypress',function (e) {
	e.preventDefault
	if (e.which == 13) {
           if($(this).val() != '') {
           var todo = $(this).val();
            createTodo(todo); 
            countTodos();
           } else {
               // some validation
           }
      }
});

// mark task as done
$('.todolist').on('change','#sortable li input[type="checkbox"]',function() {
    if($(this).prop('checked')) {
        var doneItem = $(this).parent().parent().find('label').text();
        $(this).parent().parent().parent().addClass('remove');
        done(doneItem);
        countTodos();
    }
});

//delete done task from "already done"
$('.todolist').on('click','.remove-item',function() {
    removeItem(this);
});

// count tasks
function countTodos() {
    var count = $("#sortable li").length;
    $('.count-todos').html(count);
}

//create task
function createTodo(todoText) {
    var markup = '<li class="ui-state-default"><div class="checkbox"><label><input type="checkbox" value="" />'+ todoText +'</label></div></li>';
    $('#sortable').append(markup);
    $('.add-todo').val('');
	todoItems.push(todoText);
	if (Modernizr.localstorage) {
		localStorage.setItem("o"+ todoItems.length, todoText);
	}
} // works fine

//mark task as done
function done(doneText) {
    var markup = '<li>'+ doneText +'<button class="btn btn-default btn-xs pull-right remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>';
    $('#done-items').append(markup);
    $('.remove').remove();
	doneItems.push(doneText);
	if (Modernizr.localstorage) {
		localStorage.setItem("c"+ doneItems.length, doneText);
	}
	todoItems.splice(todoItems.indexOf(doneText), 1); //this line has problem
} //works fine

//mark all tasks as done
function AllDone() {
    var myArray = [];

    $('#sortable li').each( function() {
         myArray.push($(this).text());   
    });
    
    // add to done
    for (i = 0; i < myArray.length; i++) {
        $('#done-items').append('<li>' + myArray[i] + '<button class="btn btn-default btn-xs pull-right remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>');
    }
    
    // myArray
    $('#sortable li').remove();
    countTodos();
}

//remove done task from list
function removeItem(element) {
    $(element).parent().remove();
	if (Modernizr.localstorage) {
		localStorage.setItem("c"+ doneItems.length, doneText);
		localStorage.removeItem("o"+ doneItems.length, doneText);
	}
	doneItems.splice(doneItems.indexOf(doneText), 1); //this line has problem
}

// load to do list items
function loadList() {
	if (Modernizr.localstorage) {
		var key = 0;
		var value = "";
		var len = localStorage.length;
		
		if (len) {
			for (i = 0; i < len; i++) {
				key = localStorage.key(i);
				value = localStorage[key];
				if (key.substr(0, 1) == 'o') {
					todoItems[o++] = value;
				} else if (key.substr(0, 1) == 'c') {
					doneItems[c++] = value;
				}
			}
			for	(i = 0; i < todoItems.length; i++) {
				var markup = '<li id="o'+ i +'" class="ui-state-default"><div class="checkbox"><label><input type="checkbox" value="" />'+ todoItems[i] +'</label></div></li>';
				$('#sortable').append(markup);
			}
			for	(i = 0; i < doneItems.length; i++) {
				console.log();
				var markup = '<li id="c'+ i +'">'+ doneItems[i] +'<button class="btn btn-default btn-xs pull-right remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>';
				$('#done-items').append(markup);
			}
		}
	}
}

// location features
function getLoc() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(locSucess, locErr);
	} else {
		alert("Location not available!");
	}
}

function locSucess(p) {
  latitude = p.coords.latitude;
	longitude = p.coords.longitude;
  if (Modernizr.localstorage) {
		localStorage.setItem("latitude", latitude);
		localStorage.setItem("longitude", longitude);
	}
  if (latitude != "") {
    document.getElementById("loc").innerHTML = latitude + ', ' + longitude;
    document.getElementById("btnloc").classList.add('hide');
    document.getElementById("loc").classList.add('show');
  }
}

function locErr(e) {
	switch(e.code) {
		case e.PERMISSION_DENIED:
		alert("Location denied!");
		break;
		case e.POSITION_UNAVAILABLE:
        alert("Location not available!");
        break;
		case e.TIMEOUT:
        alert("Timed out!");
        break;
		default:
        alert("Unknown error!");
        break;
	}
}


window.onload = function () {
	loadList();
	$("#sortable").sortable();
	$("#sortable").disableSelection();
	countTodos();
	
	//  save page views in session data
	if (sessionStorage.pageLoadCount) {
		sessionStorage.pageLoadCount = Number(sessionStorage.pageLoadCount) + 1;
	} else {
		sessionStorage.pageLoadCount = 1;
	}
	document.getElementById("viewno").innerHTML = sessionStorage.pageLoadCount;
	
}