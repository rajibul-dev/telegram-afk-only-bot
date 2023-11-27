function formatAfkInterval(afkInterval) {
  const { years, months, days, hours, minutes, seconds } = afkInterval;

  const roundedSeconds = Math.round(seconds);

  if (years >= 1) {
    return `${years} year${years > 1 ? "s" : ""}, ${months} month${
      months > 1 ? "s" : ""
    }, ${days} day${days > 1 ? "s" : ""}, ${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (months >= 1) {
    return `${months} month${months > 1 ? "s" : ""}, ${days} day${
      days > 1 ? "s" : ""
    }, ${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (days >= 1) {
    return `${days} day${days > 1 ? "s" : ""}, ${hours} hour${
      hours > 1 ? "s" : ""
    }, ${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (hours >= 1) {
    return `${hours} hour${hours > 1 ? "s" : ""}, ${minutes} minute${
      minutes > 1 ? "s" : ""
    }, ${roundedSeconds} second${roundedSeconds > 1 ? "s" : ""}`;
  } else if (minutes >= 1) {
    return `${minutes} minute${
      minutes > 1 ? "s" : ""
    }, ${roundedSeconds} second${roundedSeconds > 1 ? "s" : ""}`;
  } else {
    return `${roundedSeconds} second${roundedSeconds > 1 ? "s" : ""}`;
  }
}

module.exports = { formatAfkInterval };
