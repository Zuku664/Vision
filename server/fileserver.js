var fs = Npm.require('fs');
WebApp.connectHandlers.use(function(req, res, next) {
    var re = /^\/files\/(.*)$/.exec(req.url);
    if (re !== null) {   // Only handle URLs that start with /uploads_url_prefix/*
        var filePath = process.env.PWD + '/.static~/' + re[1];
        var data = fs.readFileSync(filePath);
        res.writeHead(200, {
                'Content-Type': 'image'
            });
        res.write(data);
        res.end();
    } else {  // Other urls will have default behaviors
        next();
    }
});
