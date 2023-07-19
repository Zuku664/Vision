//defaults to feed (home)
currentPage = new ReactiveVar("feed");

//gets currentPost
currentPost = new ReactiveVar();

//admin page location
adminLoc = new ReactiveVar("dash");

//the news filter
newsFilter = new ReactiveVar('news')

//for application viewing
currentApp = new ReactiveVar('currentApp')

//for viewing existing raid
currentRaid = new ReactiveVar('currentRaid')

//for deleting stuff
deleting = new ReactiveVar('')

//for loading image in carousel
currentImage = new ReactiveVar('')

//for lazy loading
postLimitServer = new ReactiveVar(7)

//test
imageTest = new ReactiveVar()

//get post ID from slug, load
postFromSlug = new ReactiveVar()

//set app sorting
appSort = new ReactiveVar('')
