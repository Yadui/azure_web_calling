// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const localStorageAvailable = typeof Storage !== 'undefined';

export enum LocalStorageKeys {
  DisplayName = 'DisplayName',
  Theme = 'AzureCommunicationUI_Theme',
  MeetingHistory = 'MeetingHistory'
}

export interface MeetingHistoryItem {
  id: string;
  timestamp: number;
  displayName: string; // The user's display name used
  callDescription: string;
  url: string;
  status?: 'live' | 'ended';
  isCreated?: boolean;
}

/**
 * Get display name from local storage.
 */
export const getDisplayNameFromLocalStorage = (): string | null =>
  window.localStorage.getItem(LocalStorageKeys.DisplayName);

/**
 * Save display name into local storage.
 */
export const saveDisplayNameToLocalStorage = (displayName: string): void =>
  window.localStorage.setItem(LocalStorageKeys.DisplayName, displayName);

/**
 * Get theme from local storage.
 */
export const getThemeFromLocalStorage = (scopeId: string): string | null =>
  window.localStorage.getItem(LocalStorageKeys.Theme + '_' + scopeId);

/**
 * Save theme into local storage.
 */
export const saveThemeToLocalStorage = (theme: string, scopeId: string): void =>
  window.localStorage.setItem(LocalStorageKeys.Theme + '_' + scopeId, theme);

/**
 * Get meeting history from local storage.
 */
export const getMeetingHistory = (): MeetingHistoryItem[] => {
  const history = window.localStorage.getItem(LocalStorageKeys.MeetingHistory);
  return history ? JSON.parse(history) : [];
};

/**
 * Add a meeting to the history.
 */
export const addMeetingToHistory = (meeting: MeetingHistoryItem): void => {
  const history = getMeetingHistory();
  // Add new meeting to the beginning with default status 'live'
  history.unshift({ ...meeting, status: 'live' });
  // Keep only the last 20 (pagination handles display, but let's limit total storage)
  if (history.length > 20) {
    history.pop();
  }
  window.localStorage.setItem(LocalStorageKeys.MeetingHistory, JSON.stringify(history));
};

/**
 * End a meeting in the history based on locator.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const endMeeting = (locator: any): void => {
  const history = getMeetingHistory();
  const idToMatch = locator.groupId || locator.meetingLink || locator.roomId || locator.meetingId;
  
  if (!idToMatch) return;

  const encodedId = encodeURIComponent(idToMatch);
  
  const updatedHistory = history.map((item) => {
    // Check if the URL contains the identifier (robust enough for this demo)
    if (item.status === 'live' && item.url && item.url.indexOf(encodedId) !== -1) {
      return { ...item, status: 'ended' } as MeetingHistoryItem;
    }
    return item;
  });
  
  window.localStorage.setItem(LocalStorageKeys.MeetingHistory, JSON.stringify(updatedHistory));
};
