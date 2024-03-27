class NotificationService {
    constructor(gateway) {
      this.gateway = gateway;
      this.rateLimits = {};
    }
  
    sendMessage(type, userId, message) {
      const rule = this.getRateLimitRule(type);
      if (!rule) {
        throw new Error(`Rate limit rule not defined for type: ${type}`);
      }
  
      const currentTime = new Date().getTime();
      const lastSentTime = this.rateLimits[userId]?.[type]?.lastSentTime || 0;
      const count = this.rateLimits[userId]?.[type]?.count || 0;
  
      if (currentTime - lastSentTime < rule.interval) {
        if (count >= rule.limit) {
          throw new Error(`Rate limit exceeded for ${type} notifications to user ${userId}`);
        }
      } else {
        this.rateLimits[userId] = this.rateLimits[userId] || {};
        this.rateLimits[userId][type] = { count: 0, lastSentTime: currentTime };
      }
  
      this.rateLimits[userId][type].count++;
      this.gateway.sendMessage(userId, message);
    }
  
    getRateLimitRule(type) {
      const rules = {
        status: { limit: 2, interval: 60 * 1000 }, // 2 per minute
        news: { limit: 1, interval: 24 * 60 * 60 * 1000 }, // 1 per day
        marketing: { limit: 3, interval: 60 * 60 * 1000 } // 3 per hour
      };
      return rules[type];
    }
}
  
class Gateway {
    sendMessage(userId, message) {
        console.log(`Sending message to user ${userId}: ${message}`);
    }
}


// ~~~~~~~~~~~~~~ TESTING ~~~~~~~~~~~~~~
const service = new NotificationService(new Gateway());

try {
  // Send status notifications
  service.sendMessage("status", "user", "status 1");
  service.sendMessage("status", "user", "status 2");

  // Send news notifications
  service.sendMessage("news", "user", "news 1");
  // service.sendMessage("news", "user", "news 2"); // Should not succeed

  // Attempt to send more status notifications within the same minute
  setTimeout(() => {
    try {
      service.sendMessage("status", "user", "status 3"); // Should not succeed
    } catch (error) {
      console.error(error.message);
    }
  }, 2000); // Wait for 2 seconds to ensure a new minute

  // Send marketing notifications
  service.sendMessage("marketing", "user", "marketing 1");
  service.sendMessage("marketing", "user", "marketing 2");
  service.sendMessage("marketing", "user", "marketing 3"); 
  // service.sendMessage("marketing", "user", "marketing 4"); // Should not succeed
} catch (error) {
  console.error(error);
}

