//return value of global currentPage for use in Blaze
Template.registerHelper("currentPage", function(){
  return currentPage.get()
})

Template.registerHelper("adminLoc", function(){
  return adminLoc.get()
})

Template.registerHelper('bossExists', function(){
  if(images.findOne({})){
    return true;
  }
})

//adds logic to Blaze
Template.registerHelper("equals", function(a, b){
  return a === b
})

//carousel image loader
Template.registerHelper("caroImg", function(a, b){
  return currentImage.get()
})

Template.registerHelper('markdown', function (text, options) {
  kramed.setOptions({
    renderer: new kramed.Renderer()
    , gfm: true
    , tables: true
    , breaks: false
    , pedantic: false
    , sanitize: true
    , smartLists: true
    , smartypants: false
  });

  text = kramed(text);
  //text = $(text).text()

  text = text.replace(/\n{1,9}/g, '<br>');
  text = text.replace(/\\n/g, '');
  text = text.replace(/\\/g, '');


  text = text.slice(0, -5);

  return new Spacebars.SafeString(text);
});

Template.news.helpers({
  posts : () =>{
    if(newsFilter.get() == 'News'){
      return posts.find({cataSux: "News"}, {sort:{date_created: -1}});
    }else if(newsFilter.get() == "Boss"){
      return posts.find({cataSux: "Boss"}, {sort:{date_created: -1}})
    }else{
      return posts.find({}, {sort:{date_created: -1}})
    }
  }
})

Template.feed.helpers({
  'image': ()=>{
    return images.find({}, {sort: {date_created: -1}})
  }
})

Template.admin.helpers({
  amount: () =>{
    return counts.find({})
  }
})

Template.appSet.helpers({
  question: ()=>{
    return questions.find({})
  }
})

Template.loadApps.helpers({
  app: ()=>{
    if(appSort.get() == '' || appSort.get() == 'All'){
      return apps.find({}, {sort:{date_created: -1}})
    }else{
      return apps.find({cataSux: appSort.get()}, {sort:{date_created: -1}})
    }
  }
})

Template.viewApp.helpers({
  viewApp: ()=>{
    return apps.find({_id: currentApp.get()})
  }
})

Template.editRaid.helpers({
  'editRaid': ()=>{
    return raids.find({_id: currentRaid.get()})
  }
})

Template.twitch.helpers({
  'daStuff': ()=>{
    return twitch.find({_id: 'data'})
  }
})
Template.streams.helpers({
  'daRules': ()=>{
    return twitch.find({_id:'data'})
  }
})

Template.article.helpers({
  posts : () =>{
    if(currentPage.get() == 'article'){
      //no point sending them to client if you cant see them
      return posts.find({_id: currentPost.get()});
    }
  },
  about: () =>{
    if(currentPage.get() == 'about'){
      return siteDetails.findOne({_id: 'about'})
    }
  }
})

Template.newsHeader.helpers({
  posts : () =>{
    return posts.find({_id: currentPost.get()});
  }
})

Template.index.helpers({
  title: ()=>{
    return siteDetails.findOne({_id: 'title'})
  },
  about: ()=>{
    return siteDetails.findOne({_id: 'about'})
  },
  background: ()=>{
    return siteDetails.findOne({_id: 'background'})
  }
})

Template.nav.helpers({
  tabard: ()=>{
    console.log(siteDetails.findOne({_id: 'tabard'}))
    return siteDetails.findOne({_id: 'tabard'})
  }
})

Template.applyPage.helpers({
  question: ()=>{
    return questions.find({})
  }
})

Template.loadPost.helpers({
  post: ()=>{
    return posts.find({}, {sort: {date_created: -1}})
  }
})

Template.editPost.helpers({
  post: ()=>{
    return posts.find({_id: currentPost.get()})
  }
})

Template.loadRaid.helpers({
  raid: ()=>{
    return raids.find({}, {sort:{date: -1}})
  }
})

Template.raidStatus.helpers({
  raid: ()=>{
    return raids.find({}, {sort: {date: -1}})
  }
})

Template.settings.helpers({
  rc: ()=>{
    return siteDetails.findOne({_id: 'recruiting'})
  },
  st: () =>{
    return siteDetails.findOne({_id: 'title'})
  },
  at: () =>{
    return siteDetails.findOne({_id: 'about'})
  }
})

Template.recruiting.helpers({
  rc: ()=>{
    return siteDetails.findOne({_id: 'recruiting'});
  },
  rDn: ()=>{
    //if any of the specs are there, let this class show up in the list
    if( siteDetails.findOne({_id: 'recruiting', dnB:true}) || siteDetails.findOne({_id: 'recruiting', dnU:true}) || siteDetails.findOne({_id: 'recruiting', dnF:true})){
      return true;
    }
  },
  rDh: ()=>{
    if( siteDetails.findOne({_id: 'recruiting', dhH:true})|| siteDetails.findOne({_id: 'recruiting', dhV:true})){
      return true;
    }
  },
  rDr: ()=>{
    if( siteDetails.findOne({_id: 'recruiting', drB:true})|| siteDetails.findOne({_id: 'recruiting', drF:true})| siteDetails.findOne({_id: 'recruiting', drR:true})||siteDetails.findOne({_id: 'recruiting', drG:true})){
      return true;
    }
  },
  rhu: ()=>{
    if( siteDetails.findOne({_id: 'recruiting', huM:true})||siteDetails.findOne({_id: 'recruiting', huS:true}) || siteDetails.findOne({_id: 'recruiting', huB:true})){
      return true;
    }
  },
  rMa: ()=>{
    if( siteDetails.findOne({_id: 'recruiting', maF:true})|| siteDetails.findOne({_id: 'recruiting', maFr:true})||siteDetails.findOne({_id: 'recruiting', maA:true})){
      return true;
    }
  },
  rMo: ()=>{
    if( siteDetails.findOne({_id: 'recruiting', moM:true})||   siteDetails.findOne({_id: 'recruiting', moW:true})||siteDetails.findOne({_id: 'recruiting', moB:true})){
      return true;
    }
  },
  rPa: ()=>{
    if(  siteDetails.findOne({_id: 'recruiting', paH:true})||siteDetails.findOne({_id: 'recruiting', paR:true}) ||siteDetails.findOne({_id: 'recruiting', paP:true})){
      return true;
    }
  },
  rPr: ()=>{
    if( siteDetails.findOne({_id: 'recruiting', prS:true}) ||siteDetails.findOne({_id: 'recruiting', prD:true}) ||siteDetails.findOne({_id: 'recruiting', prH:true})){
      return true;
    }
  },
  rRo: ()=>{
    if( siteDetails.findOne({_id: 'recruiting', roA:true}) ||siteDetails.findOne({_id: 'recruiting', roS:true}) ||siteDetails.findOne({_id: 'recruiting', roC:true})){
      return true;
    }
  },
  rSh: ()=>{
    if(  siteDetails.findOne({_id: 'recruiting', shE:true})||siteDetails.findOne({_id: 'recruiting', shR:true}) ||siteDetails.findOne({_id: 'recruiting', shEn:true})){
      return true;
    }
  },
  rWa: ()=>{
    if( siteDetails.findOne({_id: 'recruiting', waA:true}) ||siteDetails.findOne({_id: 'recruiting', waD:true}) ||siteDetails.findOne({_id: 'recruiting', waDe:true})){
      return true;
    }
  },
  rWar: ()=>{
    if(  siteDetails.findOne({_id: 'recruiting', warA:true})|| siteDetails.findOne({_id: 'recruiting', warF:true})||siteDetails.findOne({_id: 'recruiting', warP:true})){
      return true;
    }
  },
})
