const cron = require("node-cron");

function startConcurrentBookingJob({ baseUrl, booking, userIds }) {
  return new Promise((resolve, reject) => {
    const task = cron.schedule("* * * * * *", async () => {
      task.stop();

      try {
        const results = await Promise.all(
          userIds.map(async (userId) => {
            const response = await fetch(`${baseUrl}/api/bookings`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...booking, userId }),
            });

            return {
              userId,
              status: response.status,
              body: await response.json(),
            };
          })
        );
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = { startConcurrentBookingJob };
