function registerInfo() {
    let userInfo = JSON.parse(localStorage.getItem("AllUsers"));
    let info = {};

    info.fullname = $("#fullname").val();
    info.username = $("#username").val();
    info.pass = $("#password").val();

    if (userInfo == null) userInfo = [];

    if (info.fullname == '' || info.username == '' || info.pass == '') {
        swal('error', 'Please fill out all empty fields', 'error')
        return;
    }
    userInfo.push(info);

    localStorage.setItem("AllUsers", JSON.stringify(userInfo));
    window.open('index.html', '_self')
}


function login() {
    let userInfo = JSON.parse(localStorage.getItem("AllUsers"));
    let name = $("#user").val();
    let pass = $("#pass").val();

    if (userInfo !== null) {
        let user = userInfo.find(info => name == info.username && pass == info.pass)
        if (user) {
            swal("Success", "You will be logged in.", "success")
            localStorage.setItem("Logged User", JSON.stringify(user));
            window.open('bookmarks.html', '_self');
        }
        else {
            swal("Invalid", "The user/password is invalid.", "error");
            return;
        }
    }
    else {
        swal("Error", "The user/password is invalid. If you are a new user, click on 'Create an account'.", "error");
        return;
    };

}


function welcomeUser() {
    let user = JSON.parse(localStorage.getItem("Logged User"));
    $("#name").html(user.fullname)
}


function addBookmark() {
    let user = JSON.parse(localStorage.getItem("Logged User"));
    let bookmarks = JSON.parse(localStorage.getItem(user.fullname));

    let bookmark = {
        website: $("#website").val(),
        link: $("#URL").val()
    };

    let pattern = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
    let validate = pattern.test(bookmark.link);

    if (bookmarks == null) bookmarks = [];
    if (validate == true) {
        bookmarks.push(bookmark);
    }
    else {
        swal("Error", "The URL you entered is not a vaild entry", "error")
        return
    }

    localStorage.setItem(user.fullname, JSON.stringify(bookmarks));
    $("#website").focus();
    $("#website").val('');
    $("#URL").val('');

    displayBookmarks()
}



function displayBookmarks() {
    let user = JSON.parse(localStorage.getItem("Logged User"));
    let bookmarks = JSON.parse(localStorage.getItem(user.fullname));

    let div = '';
    let pages = 0;
    // let listcontinued = `<ul class="my-3 pagination justify-content-center" id="bookmark-nav">
    //                         <li class="page-item first"><a href="#" class="page-link">First</a></li>
    //                         <li class="page-item prev"><a href="#" class="page-link">Previous</a></li>`;

    bookmarks.forEach((bookmark, i) => {
        pages++
        div += `<div class="justify-content-center p-3 bookmark page" id="page${pages}">
                    <h2>${bookmark.website}
                    <div class="row">
                    <button class="col-sm my-1 btn btn-light" onclick="window.open('${bookmark.link}', '_self')">Visit</button>
                    <button class="col-sm my-1 btn btn-danger" onclick="deleteBookmark(${i})">Delete</button> 
                    <button class="col-sm my-1 btn btn-success" onclick="editURL(${i})">Edit URL</button>
                    </div>
                    </h2>
                </div>`
    })
    // for(let i = 1; i <= bookmarks.length; i++){
    //     listcontinued +=  `<li class="page-item"><a href ="#" class="page-link">${i}</a></li>`
    //  }
    //  listcontinued +=`<li class="page-item next"><a href="#"class="page-link">Next</a></li>
    //                     <li class="page-item last"><a href="#" class="page-link">Last</a></li>
    //                 </ul>`
    // $("#pages").html(listcontinued)
    $("#bookmarks").html(div)

    if (bookmarks.length > 0) {
        $("#p3").hide()
        $("#pages").show()
        $("#pages").twbsPagination('destroy');
        $("#pages").twbsPagination({
            totalPages: bookmarks.length,
            startPage: 1,
            visiblePages: 5,
            first: 'First',
            prev: 'Previous',
            next: 'Next',
            last: 'Last',

            onPageClick: function (event, page) {
                $(".bookmark-block").removeClass("bookmark-block"),
                    $("#page" + page).addClass("bookmark-block")
            }
        })
    }
    else {
        $("#p3").show()
        $("#pages").hide()
    }
}


function editURL(i) {
    let user = JSON.parse(localStorage.getItem("Logged User"));
    let bookmarks = JSON.parse(localStorage.getItem(user.fullname));

    let newURL = prompt("Enter the new URL below")
    let pattern = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
    if (pattern.test(newURL) == true) {
        bookmarks[i].link = newURL;
        localStorage.setItem(user.fullname, JSON.stringify(bookmarks));
        swal('Success!', `The new URL is ${newURL}`, "success")
    }
    else {
        swal("Error", "The URL you entered is not a vaild entry", "error")
        return
    }
    displayBookmarks()
}


function deleteBookmark(i) {
    let user = JSON.parse(localStorage.getItem("Logged User"));
    let bookmarks = JSON.parse(localStorage.getItem(user.fullname));
    let confirmation = confirm("Are you sure? \nIf you delete this item you may not be able to recover this item.")
    if (confirmation == true) {
        swal("Item Deleted", "This item was deleted", "success");
        bookmarks.splice(i, 1);
    }
    else {
        swal("Item saved", "This item will be kept", "success");
    }

    localStorage.setItem(user.fullname, JSON.stringify(bookmarks));
    displayBookmarks()
}


