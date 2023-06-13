module.exports = class DateHelper {
    static hasAtLeastTimeAgo(targetDate = new Date(), timeSeconds) {
        const curDate = new Date();

        const curTime = curDate.getTime() / 1000;
        const targetTime = targetDate.getTime() / 1000;

        return targetTime <= curTime - timeSeconds;
    }
};
