BlazeLayout.setRoot('body');

Deps.autorun( function(){Meteor.subscribe('posts', postLimitServer.get())});
Meteor.subscribe('posts');
Deps.autorun( function(){Meteor.subscribe('posts2', postFromSlug.get())});
Meteor.subscribe('raids');
Meteor.subscribe('questions');
Meteor.subscribe('apps');
Deps.autorun( function(){Meteor.subscribe('siteDetails')});
Meteor.subscribe('counts');
Meteor.subscribe("images");
Meteor.subscribe("twitch");

var currentFilter = 0;
Meteor.newsFilter =({
  'change' : () =>{
    if(currentFilter == 0){
      newsFilter.set('Boss');
      currentFilter = 1;
    }else{
      newsFilter.set('News');
      currentFilter = 0;
    }
  }
})

addQU = 0
var firstQues
Meteor.addQues = ({
  'addQues': () =>{
    if(addQU == 0){
      addQU += 1
    }
    var thisQues = '"qu'+addQU+'"'
    $('.questions').append('<input class="quesName" placeholder="Question" id='+thisQues+'</input>')
    if(firstQues == true){
      firstQues = false
    }else{
      console.log('firing')
      addQU += 1
    }
  },
  'remQues': () =>{
    var remNum = addQU - 1
    var ques = '#qu'+remNum
    $( ques ).remove();
    if(addQU > 0){
      addQU -= 1
    }
  },
  'postQues': ()=>{
    let ques = []
    var test = addQU
    for(var i = 0; i < test; i++){
      console.log($('#qu'+[i]).val()+"::")
      ques.push($('#qu'+[i]).val()+"::")
    }
    Meteor.call('addQues', ques, addQU)
    addQU = 0
    location.reload();
  }
})

addCC = 0
Meteor.addBoss = ({
  'addBoss': () =>{
    addCC += 1
    let bossCon = '"bossCon'+addCC+'"'
    let thisAbn = '"abn'+addCC+'"'
    let thisAbsN = '"absN'+addCC+'"'
    let thisAbsH = '"absH'+addCC+'"'
    let thisAbsM = '"absM'+addCC+'"'

    $('#bossCon').append('<div class="bosses" id='+bossCon+'><input class="bossName" placeholder="Boss Name" id='+thisAbn+'/> \
    <table> \
    <th>&nbsp;N&nbsp;&nbsp;&nbsp;H&nbsp;&nbsp;&nbsp;M</th> \
    <tr> \
    <td> \
    <input type="checkbox" id='+thisAbsN+'/> \
    <input type="checkbox" id='+thisAbsH+'/> \
    <input type="checkbox" id='+thisAbsM+'/> \
    </td> \
    </tr> \
    </table></div>')
  },
  'remBoss' : () =>{
    let bossCon = '#bossCon'+addCC
    $( bossCon ).remove();
    addCC -= 1
  },
  'postBoss': () =>{
    let title = $('.postTitle').val()
    let bossName = []
    let bossStatN = []
    let bossStatH = []
    let bossStatM = []

    for(var i = 0; i < addCC+1; i++){
      bossName.push($('#abn'+[i]).val()+"::")
      if ($('#absN'+[i]).is(":checked"))
      {
        bossStatN.push('DEAD')
      }else{
        bossStatN.push('ALIVE')
      }
      if ($('#absH'+[i]).is(":checked"))
      {
        bossStatH.push('DEAD')
      }else{
        bossStatH.push('ALIVE')
      }
      if ($('#absM'+[i]).is(":checked"))
      {
        bossStatM.push('DEAD')
      }else{
        bossStatM.push('ALIVE')
      }
    }
    Meteor.call('addRaid', title, bossName, bossStatN, bossStatH, bossStatM, addCC)
    location.reload();
  }
})

var addCE = 0 - 1
var sendCE = 0
Meteor.editBoss = ({
  'addBoss': (target) =>{
    if(target >= 0){
      addCE += target
      sendCE = addCE + 1
    }
    addCE += 1
    sendCE += 1
    let bossCon = '"editBossCon'+addCE+'"'
    let thisAbn = '"editAbn'+addCE+'"'
    let thisAbsN = '"editAbsN'+addCE+'"'
    let thisAbsH = '"editAbsH'+addCE+'"'
    let thisAbsM = '"editAbsM'+addCE+'"'

    $('#editBossCon').append('<div class="bosses" id='+bossCon+'><input class="bossName" placeholder="Boss Name" id='+thisAbn+'/> \
    <table> \
    <th>&nbsp;N&nbsp;&nbsp;&nbsp;H&nbsp;&nbsp;&nbsp;M</th> \
    <tr> \
    <td> \
    <input type="checkbox" id='+thisAbsN+'/> \
    <input type="checkbox" id='+thisAbsH+'/> \
    <input type="checkbox" id='+thisAbsM+'/> \
    </td> \
    </tr> \
    </table></div>')
    addCE -= target
  },
  'remBoss' : (target) =>{
    addCE += target
    let bossCon = '#editBossCon'+addCE
    $( bossCon ).remove();
    sendCE = addCE
    addCE -= target + 1
  },
  'postBoss': (target, num) =>{
    let title = $('#editBossTitle').val()
    let bossName = []
    let bossStatN = []
    let bossStatH = []
    let bossStatM = []
    if(addCE >= -1 && addCE >= sendCE - 1){
      count = num -1
    }else{
      count = sendCE - 1
    }
    for(var i = 0; i < count+1; i++){
      bossName.push($('#editAbn'+[i]).val()+"::")
      if ($('#editAbsN'+[i]).is(":checked"))
      {
        bossStatN.push('DEAD')
      }else{
        bossStatN.push('ALIVE')
      }
      if ($('#editAbsH'+[i]).is(":checked"))
      {
        bossStatH.push('DEAD')
      }else{
        bossStatH.push('ALIVE')
      }
      if ($('#editAbsM'+[i]).is(":checked"))
      {
        bossStatM.push('DEAD')
      }else{
        bossStatM.push('ALIVE')
      }
    }
    Meteor.call('updateRaid', title, bossName, bossStatN, bossStatH, bossStatM, count, target)
    location.reload();
  }
})


var addTU = 0 - 1
var sendTU = 0
Meteor.twitch = ({
  'addUsr': (target) =>{
    if(target >= 0){
      addTU += target
      sendTU = addTU + 1
    }
    addTU += 1
    sendTU += 1
    let twitchCon = '"twitchCon'+addTU+'"'
    let thisAbn = '"editTu'+addTU+'"'

    $('#twitchCon').append('<div class="bosses" id='+twitchCon+'><input class="twitchName" placeholder="Username" id='+thisAbn+'/> </div>')
    addTU -= target
  },
  'remUsr' : (target) =>{
    addTU += target
    let bossCon = '#twitchCon'+addTU
    $( bossCon ).remove();
    sendTU = addTU
    addTU -= target + 1
  },
  'postTwitch': (num) =>{
    let apiKey = $('#APIkey').val()
    let twitchName = []

    if(addTU >= -1 && addTU >= sendTU - 1){
      count = num -1
    }else{
      count = sendTU - 1
    }
    for(var i = 0; i < count+1; i++){
      twitchName.push($('#editTu'+[i]).val())
    }
    Meteor.call('updateTwitch', apiKey, twitchName, count)
    location.reload();
  }
})


Meteor.pushState ={
  pushState:(target) =>{
    window.history.pushState("object or string", "Title", "/"+window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
    if(target == 'feed' || target == 'streams' || target == 'apply' || target == 'about'){
      history.pushState('', document.title, target);
    }
    else{
      history.pushState('', document.title, "p/"+target);
    }
  }
}
