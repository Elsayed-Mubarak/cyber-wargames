module.exports = {
	dbURI: "mongodb://127.0.0.1:27017/wargames-milatry-collage",
	SESSION_SECRET: "7fa6f51e-92ae-4f9c-aaa5-9080a003f254",
	ORIGIN_CORS: ["http://192.168.1.55:4200", "http://localhost:4200"],
	ticketValidationInDays: 365,
	RedisHost: "127.0.0.1",
	RedisPort: 6379,
	"banDurationInHours": 1,
	"freeRetriesOnStrictRoutes": 100,
	"timeBetweenPasswordResetsInHours": 2,
	"maxLogins": 3,
	"maxTicketUsagePerHour": 1200,
	"foreignIpBlockInDays": 365,
	"scanBlockInDays": 15,
	tempTokenDurationInHours: 1,
	"timeZone": "Africa/Cairo"
}