import { logger } from "../index.js";
import cron from "node-cron";

let isRunning = false;
let counter = 1;

// 1 Second 
// cron.schedule(" */1 * * * * *", async () => {
//     logger.info(`🚀 Cron started : ${counter}`);
//     counter++;
//     // await syncContactMomentum();
//     // logger.info("✅ Cron finished");
// });

// 1 Hour 
cron.schedule("0 0 */1 * * *", async () => {
    logger.info(`🚀 Cron started : ${counter}`);
    counter++;
    // await syncContactMomentum();
    // logger.info("✅ Cron finished");
});





// if (isRunning) {
//     console.log("⏳ Previous job still running, skipping...");
//     return;
//   }

//   isRunning = true;

//   try {
//     console.log("🚀 Cron started");
//     await syncInquirer();
//     console.log("✅ Cron finished");
//   } catch (error) {
//     console.error("❌ Cron error:", error);
//   } finally {
//     isRunning = false;
//   }