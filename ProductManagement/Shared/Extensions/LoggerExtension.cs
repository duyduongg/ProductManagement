using Microsoft.Extensions.Logging;
using System;

namespace ProductManagement.Extensions
{
    public static class LoggerExtension
    {
        public static void LogInfo(this ILogger logger, string message)
        {
            logger.LogInformation($"{DateTime.UtcNow.ToLocalTime()}: {message}");
        }
    }
}
