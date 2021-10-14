
module.exports = {
	dbURI: process.env.MONGODB_URI,
	ORIGIN_CORS: process.env.ORIGIN_CORS.split(","),
	ticketValidationInDays: process.env.ticketValidationInDays,
	banDurationInHours: process.env.banDurationInHours,
	freeRetriesOnStrictRoutes: 5,
	SESSION_SECRET: process.env.SESSION_SECRET,
	timeBetweenPasswordResetsInHours: process.env.timeBetweenPasswordResetsInHours,
	maxLogins: process.env.maxLogins,
	TempToken: process.env.TEMP_TOKEN_SECRET,
	RedisHost: process.env.RedisHost,
	RedisPort: process.env.RedisPort,
	maxTicketUsagePerHour: process.env.maxTicketUsagePerHour,
	foreignIpBlockInDays: 365,
	scanBlockInDays: 15,
	tempTokenDurationInHours: process.env.tempTokenDurationInHours,
	canUseCustomErrorPages: Boolean(process.env.canUseCustomErrorPages)
}