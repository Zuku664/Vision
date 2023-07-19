FlowRouter.route('/', {
  name: 'home',
  subscriptions: function(params, queryParams) {
    // using Fast Render
    this.register('posts', Meteor.subscribe('posts'));
    this.register('siteDetails', Meteor.subscribe('siteDetails'));
  },
  action(){
    BlazeLayout.render('index');
  },
  fastRender: true
});

FlowRouter.route('/admin', {
  name: "admin",
  action(){
    if(Meteor.userId()){
      currentPage.set('admin')
      BlazeLayout.render('admin');
    }else{
      BlazeLayout.render('signin');
    }
  }
})

FlowRouter.route('/admin/:_id', {
  name: 'adminRoute',
  action: function(params, queryParams) {
    BlazeLayout.render('admin');
    let theseParms = params._id;
    currentPage.set('admin')
    var context = ['post','apps','settings','raids','twitch']
    var bttns = ['.new', '.fa-file', '.fa-cog', '.fa-trophy', '.fa-twitch']
    adminLoc.set(theseParms);
  }
});


FlowRouter.route('/admin-login', {
  name: "login",
  action(){
    BlazeLayout.render('signin');
  }
})

FlowRouter.route('/p/:_id', {
  name: 'post',
  subscriptions: function(params, queryParams) {
    // using Fast Render
    this.register('posts2', Meteor.subscribe('posts2'));
    this.register('siteDetails', Meteor.subscribe('siteDetails'));
  },
  action: function(params, queryParams) {
    BlazeLayout.render('index');
    let theseParms = params._id;
    currentPage.set('article')
    currentPost.set(theseParms);
    postFromSlug.set(params._id)
  }
});

FlowRouter.route('/feed', {
  name: 'home2',
  subscriptions: function(params, queryParams) {
    // using Fast Render
    this.register('posts', Meteor.subscribe('posts'));
    this.register('siteDetails', Meteor.subscribe('siteDetails'));
  },
  action: function(params, queryParams) {
    BlazeLayout.render('index');
    currentPage.set('feed')
  }
});

FlowRouter.route('/about', {
  name: 'about',
  subscriptions: function(params, queryParams) {
    // using Fast Render
    this.register('posts', Meteor.subscribe('posts'));
    this.register('siteDetails', Meteor.subscribe('siteDetails'));
  },
  action: function(params, queryParams) {
    BlazeLayout.render('index');
    currentPage.set('about')
  }
});

FlowRouter.route('/apply', {
  name: 'apply',
  subscriptions: function(params, queryParams) {
    // using Fast Render
    this.register('siteDetails', Meteor.subscribe('siteDetails'));
  },
  action: function(params, queryParams) {
    BlazeLayout.render('index');
    currentPage.set('apply')
  }
});

FlowRouter.route('/streams', {
  name: 'streams',
  subscriptions: function(params, queryParams) {
    // using Fast Render
    this.register('posts', Meteor.subscribe('posts'));
    this.register('siteDetails', Meteor.subscribe('siteDetails'));
  },
  action: function(params, queryParams) {
    BlazeLayout.render('index');
    currentPage.set('streams')
  }
});
