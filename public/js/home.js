window.onload = function () {
    var socket = io.connect('http://localhost:5890');
    socket.emit('test', { my: 'data' })
}