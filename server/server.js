Meteor.startup(function () {
  fs = Npm.require('fs');

  // converts old app dates to new format
  var testingsometing = apps.find({}).fetch()
  for(var i = 0; i < testingsometing.length; i++){
    if(!testingsometing[i].date_created){
      var id = testingsometing[i]._id
      var date = testingsometing[i].date
      var date_created = date
      var res = date.toString().split(" ");
      date = res[1] + " " + res[2] + " " + res[3]
      apps.update({_id: id}, {$set: {date: date, date_created:date_created}})
    }
  }
})

//checks to see if default site values are set, creates template for later
var needed = ['title', 'about', 'tabard', 'background', 'favicon', 'recruiting']
var firstTime = 0;
for(var i = 0; i < needed.length; i++){
  if(siteDetails.findOne({_id: needed[i]})){
    //horray!!
  }else{
    //lets create em
    siteDetails.insert({_id: needed[i]})
    firstTime = 1;
  }
}
if(firstTime == 1){
  //wow
  siteDetails.update({_id: 'recruiting'}, {$set:{dnB: 'checked', dnU: 'checked', dnF: 'checked', dhH: 'checked', dhV: 'checked', drB: 'checked', drF: 'checked', drR: 'checked', drG: 'checked', huM: 'checked', huS: 'checked', huB: 'checked', maF: 'checked', maFr: 'checked', maA: 'checked', moM: 'checked', moW: 'checked', moB: 'checked', paH: 'checked', paR: 'checked', paP: 'checked', prS: 'checked', prD: 'checked', prH: 'checked', roA: 'checked', roS: 'checked', roC: 'checked', shE: 'checked', shR: 'checked', shEn: 'checked', waA: 'checked', waD: 'checked', waDe: 'checked', warA: 'checked', warF: 'checked', warP: 'checked'}})
  userCount.insert({count:0})
  counts.insert({_id:"data", postCount:0, appCount:0, raidCount: 0})
  firstTime = 0
}


//creates initial account
Meteor.methods({
  'accountCheck' : () =>{
    if(userCount.findOne({count: 0})){
      return true;
    }else{
      return false;
    }
  },
  'phraseCheck': (secret) =>{
    if(secret == "SnowyTableSanDiegoFifteenTwelve"){
      return true;
    }
  },
  'createAcc': (usm, psw) =>{
    if(userCount.findOne({count:0})){
      Accounts.createUser({
        username: usm,
        password: psw
      });
    }
    userCount.insert({count: 1});
    userCount.remove({count: 0});
  }
})

Meteor.methods({
  'post': (imageData, title, content, cata) =>{
    if(Meteor.user()){
      // our data URL string from canvas.toDataUrl();
      var imageDataUrl = imageData;
      // declare a regexp to match the non base64 first characters
      var dataUrlRegExp = /^data:image\/\w+;base64,/;
      // remove the "header" of the data URL via the regexp
      var base64Data = imageDataUrl.replace(dataUrlRegExp, "");
      // declare a binary buffer to hold decoded base64 data
      var imageBuffer = new Buffer(base64Data, "base64");
      var id = ShortId.generate();
      var isoDate = new Date()
      var res = isoDate.toString().split(" ");
      var date = res[1] + " " + res[2] + " " + res[3]
      var path = process.env["PWD"] + '/.static~/';

      var cata = cata;
      if(cata.includes("News")){
        cata = "News"
      }else if(cata.includes("Boss")){
        cata = "Boss"
      }else{
        //if no catagory is supplied, assume it's just news
        cata = "News"
      }
      posts.insert({_id: id, title: title, content: content, imgPath: '/files/' + id+".jpeg", date:date, cataSux:cata, date_created: new Date()})
      counts.update({_id:"data"}, {$inc:{postCount: 1}})
      if(cata == "Boss"){
        images.insert({_id: id, title:title, imgPath: '/files/' + id+".jpeg", date_created: new Date()})
      }
      if(imageData == ''){
        var rand = Math.floor(Math.random() * 3) + 1
        var img = ''
        if(rand == 1){
          img = 'default1.jpg'
        }else if(rand == 2){
          img = 'default2.jpg'
        }else{
          img = 'default3.jpg'
        }
        posts.update({_id: id}, {$set: {imgPath: '/'+img}})
        if(cata == "Boss"){
          images.update({_id: id}, {$set: {imgPath: '/' + img}})
        }
      }
      var canReload = false
      fs.writeFile(path+id+'.jpeg', imageBuffer,
      function (err) {
        if (err) throw err;
        console.log('Done!');
        canReload = true
      })
      if(canReload == true){
        return true
      }
    }
  },
  'addRaid': (title, bossName, bossStatN, bossStatH, bossStatM, addCC) =>{
    if(Meteor.user()){
      //okay, I'm posting each boss and it's stats in an array. I need to break it up to show it, but I'm sure I can do that Client side.
      raids.insert({title: title, bossName:bossName, bossStatN:bossStatN, bossStatH:bossStatH, bossStatM:bossStatM, length: addCC, date: new Date()})
      counts.update({_id:"data"}, {$inc:{raidCount: 1}})
    }
  },
  'addQues': (ques, quesCount) =>{
    if(Meteor.user()){
      questions.remove({})
      questions.insert({ques:ques, quesCount:quesCount})
    }
  }
});

Meteor.methods({
  'updateSite': (specStatus, title, about, tabard, background, favicon) =>{
    if(Meteor.user()){
      var spec = ['dnB','dnU','dnF','dhH','dhV','drB','drF','drR','drG','huM','huS','huB','maF','maFr','maA','moM','moW','moB','paH','paR','paP','prS','prD','prH','roA','roS','roC','shE','shR','shEn','waA','waD','waDe','warA','warF','warP']
      var images = []
      var canReload = []
      if(tabard != ''){
        images.push('tabard')
        canReload.push('0')
      }
      if(background != ''){
        images.push('background')
        canReload.push('0')
      }
      if(favicon != ''){
        images.push('favicon')
        canReload.push('0')
      }
      var path = process.env["PWD"] + '/.static~/';
      for(var i = 0; i < images.length; i++){
        console.log(images[i])
        // our data URL string from canvas.toDataUrl();
        var imageDataUrl = eval(images[i]);
        // declare a regexp to match the non base64 first characters
        var dataUrlRegExp = /^data:image\/\w+;base64,/;
        // remove the "header" of the data URL via the regexp
        var base64Data = imageDataUrl.replace(dataUrlRegExp, "");
        // declare a binary buffer to hold decoded base64 data
        var imageBuffer = new Buffer(base64Data, "base64");

        var ext;

        if(images[i] != 'favicon'){
          ext = '.png'
        }else{
          ext = '.ico'
        }

        fs.writeFile(path+images[i]+ext, imageBuffer,
        function (err) {
          if (err) throw err;
          console.log('Done!');
          canReload[i] = 1
        })
        siteDetails.update({_id:images[i]}, {$set:{path: '/files/' + images[i]+ext}})
      }

      var reloadLength = canReload.length
      if(reloadLength == null){
        return true
      }else if(reloadLength == 0 && canReload[0] == 1){
        return true
      }else if(reloadLength == 1 && canReload[0] == 1 && canReload[1] == 1){
        return true
      }

      siteDetails.update({_id: 'recruiting'}, {$set:{dnB: specStatus[0], dnU: specStatus[1], dnF: specStatus[2], dhH: specStatus[3], dhV: specStatus[4], drB: specStatus[5], drF: specStatus[6], drR: specStatus[7], drG: specStatus[8], huM: specStatus[9], huS: specStatus[10], huB: specStatus[11], maF: specStatus[12], maFr: specStatus[13], maA: specStatus[14], moM: specStatus[15], moW: specStatus[16], moB: specStatus[17], paH: specStatus[18], paR: specStatus[19], paP: specStatus[20], prS: specStatus[21], prD: specStatus[22], prH: specStatus[23], roA: specStatus[24], roS: specStatus[25], roC: specStatus[26], shE: specStatus[27], shR: specStatus[28], shEn: specStatus[29], waA: specStatus[30], waD: specStatus[31], waDe: specStatus[32], warA: specStatus[33], warF: specStatus[34], warP: specStatus[35]}})

      if(title != "" && title != undefined && title != null){
        siteDetails.update({_id:'title'}, {$set:{title: title}})
      }
      if(about != "" && about != undefined && about != null){
        siteDetails.update({_id:'about'}, {$set:{about: about}})
      }
    }
  },
  'updateRaid': (title, bossName, bossStatN, bossStatH, bossStatM, addCE, target)=>{
    if(Meteor.user()){
      if(addCE < 0){
        addCE = 0
      }
      raids.update({_id:target}, {$set:{title: title, bossName:bossName, bossStatN:bossStatN, bossStatH:bossStatH, bossStatM:bossStatM, length: addCE}})
    }
  },
  'updatePost': (title, content, id, imageData, cata) =>{
    if(Meteor.user()){
      // our data URL string from canvas.toDataUrl();
      if(imageData != ''){
        var imageDataUrl = imageData;
        // declare a regexp to match the non base64 first characters
        var dataUrlRegExp = /^data:image\/\w+;base64,/;
        // remove the "header" of the data URL via the regexp
        var base64Data = imageDataUrl.replace(dataUrlRegExp, "");
        // declare a binary buffer to hold decoded base64 data
        var imageBuffer = new Buffer(base64Data, "base64");
        var path = process.env["PWD"] + '/.static~/';
        posts.update({_id: id}, {$set: {imgPath: '/files/' + id+".jpeg"}})
        //if we find an image with our ID
        if(images.findOne({_id:id})){
          //update it
          images.update({_id:id}, {$set:{imgPath:  '/files/' + id+".jpeg"}})
        }
      }
      if(cata == 'Boss Fight'){
        cata = "Boss"
      }
      if(cata == "News"){
        images.remove({_id: id})
      }else if(cata == "Boss"){
        var thisDate = posts.findOne({_id: id}).date_created
        if(images.findOne({_id: id})){
          //do something
        }else{
          var imagePath = posts.findOne({_id:id}).imgPath
          images.insert({_id:id, date_created:thisDate, imgPath: imagePath})
        }
      }
      console.log(cata)
      if(cata != null){
        posts.update({_id: id}, {$set: {title: title, content:content, cataSux:cata}})
      }else{
        posts.update({_id: id}, {$set: {title: title, content:content}})
      }
      var canReload = false
      fs.writeFile(path+id+'.jpeg', imageBuffer,
      function (err) {
        if (err) throw err;
        console.log('Done!');
        canReload = true
      })
      if(canReload == true){
        return true
      }
    }
  },
  'updateTwitch': (apiKey, names, counts)=>{
    if(Meteor.user()){
      if(counts < 0){
        counts = 0
      }
      if(twitch.findOne({_id: 'data'})){
        twitch.update({_id:'data'}, {$set:{apiKey: apiKey, names:names, counts:counts}})
        console.log('updating')
      }else{
        twitch.insert({_id: "data", apiKey: apiKey, names:names, counts:counts})
        console.log('inserting')
      }
    }
  }
})

Meteor.methods({
  'sendApp': (questions, resps, amt) =>{
    var isoDate = new Date()
    var res = isoDate.toString().split(" ");
    var date = res[1] + " " + res[2] + " " + res[3]
    apps.insert({username: resps[0].replace("::", ""), questions: questions, resps:resps, amt:amt, date: date, date_created: new Date(), cataSux: 'Unviewed'})
    counts.update({_id:"data"}, {$inc:{appCount: 1}})
    return 'success'
  },
  'updateApp': (id, cata) =>{
    apps.update({_id: id}, {$set: {cataSux: cata}})
    return "done"
  }
})

Meteor.methods({
  'deletePost': (post)=>{
    if(Meteor.user()){
      var filePath = process.env["PWD"] + '/.static~/'+post+'.jpeg';
      fs.unlinkSync(filePath);
      posts.remove({_id:post})
      images.remove({_id:post})
      counts.update({_id:"data"}, {$inc:{postCount: -1}})
    }
  },
  'deleteApp': (appId)=>{
    if(Meteor.user()){
      apps.remove({_id: appId})
      counts.update({_id:"data"}, {$inc:{appCount: -1}})
    }
  },
  'deleteRaid': (raidId)=>{
    if(Meteor.user()){
      raids.remove({_id: raidId})
      counts.update({_id:"data"}, {$inc:{raidCount: -1}})
    }
  }
})

// Makes you SEO friendly baby
WebApp.rawConnectHandlers.use(
  Meteor.bindEnvironment(function (req, res, next) {
    var title = siteDetails.findOne({_id: 'title'}).title
    var about = siteDetails.findOne({_id:'about'}).about
    var tabard = siteDetails.findOne({_id: 'tabard'}).path
    if(title == undefined || title == null || title == ''){
      req.dynamicHead = (req.dynamicHead || "") + '<title>OpenGuild-CMS | FinchMFG</title>';
    }else{
      req.dynamicHead = (req.dynamicHead || "") + '<title>'+title+'</title>';
    }

    if(about == undefined || about == null || about == ''){
      req.dynamicHead = (req.dynamicHead || "") + '<meta name="description" content="Awesome open source Wow Raid software by FinchMFG" />';
    }else{
      req.dynamicHead = (req.dynamicHead || "") +  '<meta name="description" content="'+about+'"/>';
    }

    if(tabard == undefined || tabard == null || tabard == ''){
      req.dynamicHead = (req.dynamicHead || "") + '<meta name="tabard" content="blessed" />';
    }else{
      req.dynamicHead = (req.dynamicHead || "") + '<meta name="tabard" content="'+tabard+'" />';
    }
    next();
  })
);

//Meteor SEO SSR for BOTS mang
const SeoRouter = Picker.filter((request, response) => {
  let botAgents = [
    /^facebookexternalhit/i, // Facebook
    /^linkedinbot/i, // LinkedIn
    /^twitterbot/i, // Twitter
    /^slackbot-linkexpanding/i, // Slack
    /^googlebot/i
  ]

  return /_escaped_fragment_/.test(request.url) || botAgents.some(i => i.test(request.headers['user-agent']))
})

SeoRouter.route('/', (params, request, response) => {
  SSR.compileTemplate('index', Assets.getText('index.html'))
  Template.index.helpers({
    getDocType: function() {
      return "<!DOCTYPE html>";
    },
    title: function(){
      return siteDetails.findOne({_id: "title"}).title
    },
    meta: function(){
      return siteDetails.findOne({_id: "about"}).about
    },
    tabard: function(){
      try{
        return siteDetails.findOne({_id: "tabard"}).path
      }catch(e){
        return
      }
    }
  });

  let html = SSR.render('index')

  response.setHeader('Content-Type', 'text/html;charset=utf-8');
  response.end(html)
})

//END
