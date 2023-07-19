function setActive(target){
  var bttns = ['#home', '#about', '#streams', '#apply']
  for (var i = 0; i < bttns.length; i++){
    $(bttns[i]).removeClass('activeBttn')
  }
  $(bttns[target]).addClass('activeBttn')
}
Meteor.setActive ={
  setActive: (target)=>{
    setActive(target)
  }
}
Template.nav.events({
  //on click Home in Nav
  'click #home': () => {
    //set the current page to feed (home)
    currentPage.set("feed")
    newsFilter.set("")
    Meteor.pushState.pushState('feed')
    setActive(0)
  },
  'click #about': () =>{
    currentPage.set("about")
    Meteor.pushState.pushState('about')
    setActive(1)
  },
  'click #streams': () =>{
    currentPage.set("streams")
    Meteor.pushState.pushState('streams')
    setActive(2)
  },
  'click #apply': () =>{
    currentPage.set("apply")
    Meteor.pushState.pushState('apply')
    setActive(3)
  }
})

function setAdminActive(target){
  var bttns = ['.fa-tachometer', '.new', '.fa-file', '.fa-cog', '.fa-trophy', '.fa-twitch']
  for (var i = 0; i < bttns.length; i++){
    $(bttns[i]).removeClass('activeAdmin')
  }
  $(bttns[target]).addClass('activeAdmin')
}
Meteor.adminAct = ({
  adminAct: (target) =>{
    setAdminActive(target)
  }
})

Template.admin.events({
  'click .fa-tachometer': ()=>{
    adminLoc.set('dash');
    history.pushState('', document.title, "/admin");
    setAdminActive(0)
  },
  'click .new': ()=>{
    adminLoc.set('post');
    history.pushState('', document.title, "/admin/post");
    setAdminActive(1)
  },
  'click .fa-file': ()=>{
    adminLoc.set('apps');
    history.pushState('', document.title, "/admin/apps");
    setAdminActive(2)
  },
  'click .fa-cog': ()=>{
    adminLoc.set('settings');
    history.pushState('', document.title, "/admin/settings");
    setAdminActive(3)
  },
  'click .fa-trophy': ()=>{
    adminLoc.set('raids');
    history.pushState('', document.title, "/admin/raids");
    setAdminActive(4)
  },
  'click .fa-twitch': ()=>{
    adminLoc.set('twitch');
    history.pushState('', document.title, "/admin/twitch");
    setAdminActive(5)
  }
})

Template.adminHeader.events({
  'click .page': ()=>{
    if(currentPage.get() != 'admin'){
      currentPage.set('admin')
      if(Meteor.userId()){
        BlazeLayout.render('admin');
        history.pushState('', document.title, "admin");
      }else{
        BlazeLayout.render('signin');
      }
    }else{
      currentPage.set('feed')
      history.pushState('', document.title, "/");
      BlazeLayout.render('index');
    }
  }
})

Template.applyPage.events({
  'click button': ()=>{
    //store the questions for if they change
    var questions = []
    var resps = []
    for(var i = 0; i < amt; i++){
      questions.push(ques[i]+"::")
      resps.push($('#qu'+i).val()+"::")
    }
    Meteor.call("sendApp", questions, resps, amt, function(err, res){
      if(!err){
        currentPage.set('appSent')
      }
    })
  }
})
Template.viewApp.events({
  'click button': ()=>{
    var id = currentApp.get()
    var cata = $('#appCata').find(":selected").text();
    Meteor.call('updateApp', id, cata, function(err, resp){
      if(!err){
        location.reload()
      }
    })
  }
})

function addImageUp(target, target2, target3, type){
  //get image, resizes image in canvas then converts to base64 and sends to the server
  // the server then inserts it into the public directory with an id of the post._id
  // and serves it to the client on request
  var input = document.getElementById(target3);
  input.addEventListener('change', handleFiles);

  var canvas = document.getElementById(target);
  var ctx = canvas.getContext("2d");

  function handleFiles(e) {
    var ctx = document.getElementById(target).getContext('2d');
    var img = new Image;
    //CREATES new image from selected file
    img.src = URL.createObjectURL(e.target.files[0]);
    //when its loaded do this
    img.onload = function() {
      canvas.height = img.height
      canvas.width = img.width
      /// step 1
      var oc = document.createElement('canvas'),
      octx = oc.getContext('2d');

      oc.width = img.width
      oc.height = img.height
      octx.drawImage(img, 0, 0, oc.width, oc.height);

      /// step 2
      octx.drawImage(oc, 0, 0, oc.width, oc.height);

      ctx.drawImage(oc, 0, 0, oc.width, oc.height,0, 0, canvas.width, canvas.height);

      if(type != 'tabard'){
        var jpegUrl = canvas.toDataURL("image/jpeg");
      }else{
        var jpegUrl = canvas.toDataURL("image/png");
      }
      $(target2).val(jpegUrl)
    }
  }
}

Template.newPost.events({
  'click .upload': () =>{
    addImageUp('canvas', '#imageData', 'input')
  },
  'click #post': () =>{
    var imageData = $('#imageData').val()
    var title = $('#title').val()
    var content = $('.content').val()
    var cata = $('.flair').html()
    //if nothing is selected
    if(!cata){
      //default to news
      cata = "News"
    }
    $('#post').prop('disabled', true);
    Meteor.call('post', imageData, title, content, cata, function(err, result){
      if(!err){
        location.reload();
      }
    })
  }
})

Template.editPost.events({
  'click .upload': () =>{
    addImageUp('canvas2', '#imageData2', 'input')
  },
  'click #editPost': ()=>{
    var imageData = $('#imageData2').val()
    var title = $('#editTitle').val()
    var content = $('#editContent').val()
    var id = currentPost.get()
    var cata = $('.flair').html()
    $('#editPost').prop('disabled', true);
    Meteor.call('updatePost', title, content, id, imageData, cata, function(err, resp){
      if(!err){
        location.reload();
      }
    })
  }
})

Template.settings.events({
  'click #tabardIn':()=>{
    addImageUp('tabardCan', '#tabardUp', 'tabardIn', 'tabard')
  },
  'click #backgroundIn':()=>{
    addImageUp('backgroundCan', '#backgroundUp', 'backgroundIn')
  },
  'click #faviIn':()=>{
    addImageUp('faviCan', '#faviUp', 'faviIn')
  },
  'click #saveSettings':()=>{
    var specLength = 36;
    var spec = ['dnB','dnU','dnF','dhH','dhV','drB','drF','drR','drG','huM','huS','huB','maF','maFr','maA','moM','moW','moB','paH','paR','paP','prS','prD','prH','roA','roS','roC','shE','shR','shEn','waA','waD','waDe','warA','warF','warP']
    //'''
    var specStatus = []
    for(var i = 0; i < specLength; i++){
      specStatus.push($('#'+spec[i]).prop('checked'));
    }

    var title = $('.postTitle').val();
    var about = $('.content').val()
    var tabard = ''
    var background = ''
    var favi = ''

    if($('#tabardUp').val() != ''){
      tabard = $('#tabardUp').val()
    }
    if($('#backgroundUp').val() != ''){
      background = $('#backgroundUp').val()
    }
    if($('#faviUp').val() != ''){
      favi = $('#faviUp').val()
    }

    Meteor.call('updateSite', specStatus, title, about, tabard, background, favi, function(err, res){
      if(!err){
        location.reload();
      }
    })
  }
});

Template.modals.events({
  'click .delY': ()=>{
    var type = deleting.get()
    type = type.split('::')
    var id = type[1]
    type = type[0]

    if(type == "post"){
      Meteor.call('deletePost', id)
    }else if(type == 'raid'){
      Meteor.call('deleteRaid', id)
    }else{
      Meteor.call('deleteApp', id)
    }
    deleting.set('')
    $('.deleteModal').hide()
  },
  'click .delN': ()=>{
    deleting.set('')
    $('.deleteModal').hide()
  }
})

Template.login.events({
  "click .loginBttn" : () =>{
    var usm = $(".username").val();
    var psw = $('.password').val();

    //try to login
    Meteor.loginWithPassword(usm, psw, function(err, result){
      if(err){
        //if you cant login see if there is an account
        Meteor.call('accountCheck', function(err, result){
          if(result == true){
            //no account show secret modal
            $('.firstCreateModal').show();
          }else{
            alert("Opps, something isn't right")
          }
        })
      }
    });
  },
  //calls the server with the phrase on initial account create
  "click .secretPhraseBttn" : () =>{
    var usm = $(".username").val();
    var psw = $('.password').val();
    var secretPhrase = $('.secretPhrase').val();
    Meteor.call('phraseCheck', secretPhrase, function(err, result){
      if(result == true){
        //if right, create account with that info
        Meteor.call('createAcc', usm, psw);
        Meteor.loginWithPassword(usm, psw);
      }else{
        //if wrong alert
        alert("Wrong secret phrase");
      }
    })
  }
})
