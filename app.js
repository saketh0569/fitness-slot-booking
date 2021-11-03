const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))


var classes = {
	"yoga": {
		"start_time": new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
		"limit": 6
	},
	"gym": {
		"start_time": new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
		"limit": 6
	},
	"dance": {
		"start_time": new Date(new Date().getTime() + 4 * 60 * 60 * 1000),
		"limit": 6
	}
}

var booked_users_yoga = []
var booked_users_gym = []
var booked_users_dance = []

var waiting_users_yoga = []
var waiting_users_gym = []
var waiting_users_dance = []


app.post("/api/", function (req, res) {
	console.log(req.body);
	if (req.body["bookingtype"] === "Booking")
		res.render("availableSlots")
	else if (req.body["bookingtype"] === "Cancellation")
		res.render("classSelection")
	else
		res.redirect("/api")
})

app.get("/api/bookings/yoga", function (req, res) {
	res.status(200).json({
		success: true,
		yoga_bookings: booked_users_yoga
	})
})
app.get("/api/bookings/gym", function (req, res) {
	res.status(200).json({
		success: true,
		yoga_bookings: booked_users_gym
	})
})
app.get("/api/bookings/dance", function (req, res) {
	res.status(200).json({
		success: true,
		yoga_bookings: booked_users_dance
	})
})

app.get("/api", function (req, res) {
	res.render("landing")
})

app.get("/api/waitinglist/yoga", function (req, res) {
	res.status(200).json({
		success: true,
		yoga_bookings: waiting_users_yoga
	})
})
app.get("/api/waitinglist/gym", function (req, res) {
	res.status(200).json({
		success: true,
		yoga_bookings: waiting_users_gym
	})
})
app.get("/api/waitinglist/dance", function (req, res) {
	res.status(200).json({
		success: true,
		yoga_bookings: waiting_users_dance
	})
})

app.post("/api/booking", function (req, res) {
	var user = req.body;
	console.log(user)
	if (user.class === "yoga") {
		if (classes.yoga.limit > 0) {
			booked_users_yoga.push(user)
			classes.yoga.limit -= 1
			res.status(200).json({
				success: true,
				data: { limit_remaining: classes.yoga.limit, user: user }
			})
			// user.limit = classes.yoga.limit;
			// res.render("availableSlots", { user: user })
		}
		else {
			waiting_users_yoga.push(user)
			res.send("Maximum limit for yoga class reached added to waiting list");
		}

	}
	else if (user.class === "gym") {
		if (classes.gym.limit > 0) {
			booked_users_gym.push(user)
			classes.gym.limit -= 1
			res.status(200).json({
				success: true,
				data: { limit_remaining: classes.gym.limit, user: user }
			})
		}
		else {
			waiting_users_gym.push(user)
			res.send("Maximum limit for gym class reached added to waiting list");
		}

	}
	else if (user.class === "dance") {

		if (classes.dance.limit > 0) {
			booked_users_dance.push(user)
			classes.dance.limit -= 1
			res.status(200).json({
				success: true,
				data: { limit_remaining: classes.dance.limit, user: user }
			})
		}
		else {
			waiting_users_dance.push(user)
			res.send("Maximum limit for dance class reached added to waiting list");
		}
	}

})


app.post("/api/cancelbooking", function (req, res) {
	var user = req.body;
	console.log(user)
	if (user.class === "yoga") {
		var ind = find_user_index(booked_users_yoga, user.name);
		if (ind === -1) {
			res.send("Requested user is not registered in yoga class");
		} else {
			var date1 = new Date();
			var diff = timeDifference(classes.yoga.start_time, date1)
			if (diff > 30) {
				cancel_user = booked_users_yoga[ind]
				booked_users_yoga.splice(ind, 1)

				if (waiting_users_yoga.length > 0) {
					var first_user = waiting_users_yoga[0];
					booked_users_yoga.push(first_user);
					waiting_users_yoga.shift();
				} else {
					classes.yoga.limit += 1;
				}
				res.status(200).json(
					{
						success: true,
						data: { limit_remaining: classes.yoga.limit, cancelled_user: cancel_user }
					}
				)
			}
			else {
				res.status(200).json({
					success: false,
					message: "Cannot cancel class before 30 min to start"
				})
			}
		}

	}
	else if (user.class === "gym") {
		var ind = find_user_index(booked_users_gym, user.name);
		if (ind === -1) {
			res.send("Requested user is not registered in gym class");
		} else {
			var date1 = new Date();
			var diff = timeDifference(classes.gym.start_time, date1)
			if (diff > 30) {

				cancel_user = booked_users_gym[ind]
				booked_users_gym.splice(ind, 1)

				if (waiting_users_gym.length > 0) {
					var first_user = waiting_users_gym[0];
					booked_users_gym.push(first_user);
					waiting_users_gym.shift();
				} else {
					classes.gym.limit += 1;
				}
				res.status(200).json(
					{
						success: true,
						data: { limit_remaining: classes.gym.limit, cancelled_user: cancel_user }
					}
				)
			}
			else {
				res.status(200).json({
					success: false,
					message: "Cannot cancel class before 30 min to start"
				})
			}
		}

	}
	else if (user.class === "dance") {

		var ind = find_user_index(booked_users_dance, user.name);
		if (ind === -1) {
			res.send("Requested user is not registered in dance class");
		} else {
			var date1 = new Date();
			var diff = timeDifference(classes.dance.start_time, date1)
			if (diff > 30) {
				cancel_user = booked_users_dance[ind]
				booked_users_dance.splice(ind, 1)

				if (waiting_users_dance.length > 0) {
					var first_user = waiting_users_dance[0];
					booked_users_dance.push(first_user);
					waiting_users_dance.shift();
				} else {
					classes.dance.limit += 1;
				}
				res.status(200).json(
					{
						success: true,
						data: { limit_remaining: classes.dance.limit, cancelled_user: cancel_user }
					}
				)
			}
			else {
				res.status(200).json({
					success: false,
					message: "Cannot cancel class before 30 min to start"
				})
			}

		}
	}

})


function find_user_index(lst, name) {
	var index = -1
	for (var i = 0; i < lst.length; i++) {
		if (lst[i].name === name) {
			index = i;
			break;
		}
	}
	return index;
}

function timeDifference(date1, date2) {
	var difference = date1.getTime() - date2.getTime();
	var minutesDifference = Math.floor(difference / 1000 / 60);
	// difference -= minutesDifference*1000*60
	return minutesDifference
}
const port = process.env.PORT || 3000

app.listen(port, function () {
	console.log(`server is running at ${port}...`);
})