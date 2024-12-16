import _ from 'lodash';
import { parseDate } from '../Utils/transformData';

export const transformMentionUsers = (data) =>
  _.map(data, (item) => ({
    name: item.displayName,
    id: `${item.tenantId},${item.userId}`,
  }));

export const transformMentionMessage = (message) => {
  if (!message) return '';
  return message.replace(/@\[(.+?)\]\((.+?)\)/g, '@<$2>');
};

export const transformParams = (task, teamList, taskId = null) => {
  const taskTeams = task.teamIds
    .map((teamId) => {
      const team = _.find(teamList, { id: teamId });
      if (!team) return null;
      return {
        teamId,
        tenantId: team.tenantId,
        taskId,
      };
    })
    .filter(Boolean);

  const transformedTask = {
    ...task,
    isTeamSelectionFirst: task.isTeamSelectionFirst[0],
    isPublic: task.isPublic[0],
    startDate: parseDate(task.startDate),
    endDate: parseDate(task.endDate),
    taskTeams,
    frequency: parseInt(task.frequency, 10)
  };

  // Process reminders
  if (transformedTask.reminder && transformedTask.reminder.isActive) {
    transformedTask.reminders = parseReminder(transformedTask.reminder);
  } else {
    transformedTask.reminders = [];
  }

  return transformedTask;
};

export const removeUnnecessaryProperties = (task) => {
  const propertiesToRemove = ['creatorUser', 'assignees', 'status', 'priority', 'tenant', 'teams', 'team', 'teamIds', 'reminder', 'newReminderBefore', 'newReminderAfter'];
  const cleanedTask = { ...task };
  propertiesToRemove.forEach((prop) => {
    delete cleanedTask[prop];
  });

  return cleanedTask;
};

export const parseReminder = (reminder) => {
  const { reminderInMinutes = [], reminderInMinutesAfter = [], emails, users } = reminder;

  const reminders = [];

  const maxLength = Math.max(reminderInMinutes.length, reminderInMinutesAfter.length);

  for (let i = 0; i < maxLength; i++) {
    const reminderObj = {
      userIds: users.map((item) => item.id),
      emails: emails,
      users: users,
    };

    if (reminderInMinutes[i] !== undefined) {
      reminderObj.reminderInMinute = reminderInMinutes[i];
    }

    if (reminderInMinutesAfter[i] !== undefined) {
      reminderObj.reminderInMinuteAfter = reminderInMinutesAfter[i];
    }

    reminders.push(reminderObj);
  }

  return reminders;
};

export const convertRemindersToReminder = (reminders) => {
  if (!reminders || reminders.length === 0) {
    return {
      isActive: false,
      reminderInMinutes: [],
      reminderInMinutesAfter: [],
      emails: [],
      userIds: [],
      users: [],
    };
  }
  const firstReminder = reminders[0];
  return {
    isActive: true,
    reminderInMinutes: reminders
      .map((item) => item.reminderInMinute)
      .filter((item) => item !== undefined),
    reminderInMinutesAfter: reminders
      .map((item) => item.reminderInMinuteAfter)
      .filter((item) => item !== undefined),
    emails: firstReminder.emails || [],
    userIds: firstReminder.userIds || [],
    users: firstReminder.users || [],
  };
};