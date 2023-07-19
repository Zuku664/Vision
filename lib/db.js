posts = new Mongo.Collection('posts');
raids = new Mongo.Collection('raids');
questions = new Mongo.Collection('questions');
apps = new Mongo.Collection('apps');
userCount = new Mongo.Collection('userCount');
siteDetails = new Mongo.Collection('siteDetails');
twitch = new Mongo.Collection('twitch')

counts = new Mongo.Collection('counts');

images = new Mongo.Collection('images')

//denys anyone access to these (unless the above allow is met)
posts.deny({
  update: function() {
    return true;
  },

  insert: function() {
    return true;
  }
});

twitch.deny({
  update: function() {
    return true;
  },

  insert: function() {
    return true;
  }
});

images.deny({
  update: function() {
    return true;
  },

  insert: function() {
    return true;
  }
});

apps.deny({
  update: function() {
    return true;
  },

  insert: function() {
    return true;
  }
});

questions.deny({
  update: function() {
    return true;
  },

  insert: function() {
    return true;
  }
});

raids.deny({
  update: function() {
    return true;
  },

  insert: function() {
    return true;
  }
});

Meteor.users.deny({
  update: function() {
    return true;
  }
});

userCount.deny({
  update: function() {
    return true;
  },

  insert: function() {
    return true;
  }
});

siteDetails.deny({
  update: function() {
    return true;
  },

  insert: function() {
    return true;
  }
});


counts.deny({
  update: function() {
    return true;
  },

  insert: function() {
    return true;
  }
});
