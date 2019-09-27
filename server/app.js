const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const geodist = require('geodist');
const users = {};
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');

});

app.get("/users", function (req, res) {
    res.send({"a": "b"})
})

io.on('connection', function (socket) {
    socket.on('report_location', function (data) {
        users[socket.id] = {lat: data.latitude, lon: data.longitude}
        console.log(socket.id + " login at (" + data.latitude+ ", " +  data.longitude + ")")
        console.log(Object.keys(users).length + " users online")
    });

    socket.on('find_nearby', ()=>{
        const this_user = socket.id
        const this_user_loc = users[this_user]
        let devices = []
        Object.keys(users).forEach((user) => {
            console.log(user)
            if (user !== this_user && geodist(users[user], this_user_loc, {unit: 'km'}) < 5){
                console.log(geodist(users[user], this_user_loc, {unit: 'km'}))
                devices.push(user)
            }
        })
        socket.emit("nearby_devices", {'devices': devices})
    })













    socket.on('disconnect', function(){
        console.log(socket.id + ' disconnected');
        delete users[socket.id]
        console.log(Object.keys(users).length + " users online")
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});